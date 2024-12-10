-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON lead_stages;

-- Create comprehensive RLS policies
CREATE POLICY "Enable read access for authenticated users"
    ON lead_stages FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
    ON lead_stages FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
    ON lead_stages FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users"
    ON lead_stages FOR DELETE
    USING (auth.role() = 'authenticated');

-- Grant all permissions to authenticated users
GRANT ALL ON lead_stages TO authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';