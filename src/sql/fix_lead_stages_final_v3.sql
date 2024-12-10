-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON lead_stages;

-- Ensure name column is NOT NULL and has proper constraints
ALTER TABLE lead_stages
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN order_position SET NOT NULL;

-- Add unique constraint for order_position if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'lead_stages_order_position_key'
    ) THEN
        ALTER TABLE lead_stages
        ADD CONSTRAINT lead_stages_order_position_key UNIQUE (order_position);
    END IF;
END $$;

-- Insert default stages if none exist
INSERT INTO lead_stages (name, description, order_position, color)
SELECT * FROM (
  VALUES 
    ('New', 'Newly created leads', 1, 'blue'),
    ('Contacting', 'In the process of initial contact', 2, 'yellow'),
    ('Qualifying', 'Evaluating lead potential', 3, 'orange'),
    ('Converted', 'Successfully converted to opportunity', 4, 'green'),
    ('Lost', 'Lead was lost or disqualified', 5, 'red')
) AS v(name, description, order_position, color)
WHERE NOT EXISTS (SELECT 1 FROM lead_stages);

-- Enable RLS
ALTER TABLE lead_stages ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies with proper permissions
CREATE POLICY "Enable read access for authenticated users"
    ON lead_stages FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON lead_stages FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON lead_stages FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Enable delete for authenticated users"
    ON lead_stages FOR DELETE
    TO authenticated
    USING (true);

-- Grant all permissions to authenticated users
GRANT ALL ON lead_stages TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add trigger for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_lead_stages_updated_at ON lead_stages;
CREATE TRIGGER set_lead_stages_updated_at
    BEFORE UPDATE ON lead_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';