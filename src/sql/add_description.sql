-- Add description column to opportunities table
ALTER TABLE opportunities 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update RLS policies to include the new column
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON opportunities;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON opportunities;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON opportunities;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON opportunities;

-- Recreate policies
CREATE POLICY "Enable read access for authenticated users"
    ON opportunities FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
    ON opportunities FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
    ON opportunities FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users"
    ON opportunities FOR DELETE
    USING (auth.role() = 'authenticated');