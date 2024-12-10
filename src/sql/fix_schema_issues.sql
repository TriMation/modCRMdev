-- Fix tasks table
ALTER TABLE tasks
DROP COLUMN IF EXISTS accounts,
DROP COLUMN IF EXISTS status CASCADE;

ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed'));

-- Fix leads table
ALTER TABLE leads
DROP COLUMN IF EXISTS status CASCADE;

-- Add stage_id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'stage_id'
    ) THEN
        ALTER TABLE leads 
        ADD COLUMN stage_id UUID REFERENCES lead_stages(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Update existing leads to use first stage
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
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON tasks;

CREATE POLICY "Enable read access for authenticated users"
    ON tasks FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
    ON tasks FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
    ON tasks FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users"
    ON tasks FOR DELETE
    USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON leads TO authenticated;