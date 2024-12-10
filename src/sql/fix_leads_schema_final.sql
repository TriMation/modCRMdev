-- Drop status column from leads if it exists
ALTER TABLE leads 
DROP COLUMN IF EXISTS status;

-- Ensure stage_id exists and is properly constrained
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS stage_id UUID REFERENCES lead_stages(id);

-- Set default stage for existing leads
UPDATE leads 
SET stage_id = (
    SELECT id 
    FROM lead_stages 
    WHERE order_position = 1
    LIMIT 1
)
WHERE stage_id IS NULL;

-- Make stage_id required
ALTER TABLE leads
ALTER COLUMN stage_id SET NOT NULL;

-- Refresh RLS policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON leads;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON leads;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON leads;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON leads;

CREATE POLICY "Enable read access for authenticated users"
    ON leads FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
    ON leads FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
    ON leads FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users"
    ON leads FOR DELETE
    USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON leads TO authenticated;