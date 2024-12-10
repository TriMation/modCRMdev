-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON lead_stages;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON opportunity_stages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON opportunity_stages;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON opportunity_stages;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON opportunity_stages;

-- Create comprehensive RLS policies for lead_stages
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

-- Create comprehensive RLS policies for opportunity_stages
CREATE POLICY "Enable read access for authenticated users"
    ON opportunity_stages FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON opportunity_stages FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON opportunity_stages FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Enable delete for authenticated users"
    ON opportunity_stages FOR DELETE
    TO authenticated
    USING (true);

-- Grant all permissions to authenticated users
GRANT ALL ON lead_stages TO authenticated;
GRANT ALL ON opportunity_stages TO authenticated;

-- Ensure sequences are accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';