-- Drop existing table and recreate with proper structure
DROP TABLE IF EXISTS lead_stages CASCADE;

CREATE TABLE lead_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    order_position INTEGER NOT NULL,
    color VARCHAR(50) DEFAULT 'gray',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(order_position)
);

-- Insert default stages
INSERT INTO lead_stages (name, description, order_position, color) 
VALUES 
    ('New', 'Newly created leads', 1, 'blue'),
    ('Contacting', 'In the process of initial contact', 2, 'yellow'),
    ('Qualifying', 'Evaluating lead potential', 3, 'orange'),
    ('Converted', 'Successfully converted to opportunity', 4, 'green'),
    ('Lost', 'Lead was lost or disqualified', 5, 'red')
ON CONFLICT (order_position) DO NOTHING;

-- Enable RLS
ALTER TABLE lead_stages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Grant permissions
GRANT ALL ON lead_stages TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add updated_at trigger
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

-- Update leads table to reference lead_stages
ALTER TABLE leads
DROP CONSTRAINT IF EXISTS leads_stage_id_fkey;

ALTER TABLE leads
ADD CONSTRAINT leads_stage_id_fkey
    FOREIGN KEY (stage_id)
    REFERENCES lead_stages(id)
    ON DELETE SET NULL;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';