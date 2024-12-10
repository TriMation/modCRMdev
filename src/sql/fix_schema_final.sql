-- Fix tasks table structure
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_owner_id_fkey,
DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;

-- Ensure columns have correct types
ALTER TABLE tasks
ALTER COLUMN owner_id TYPE UUID USING owner_id::UUID,
ALTER COLUMN assigned_to TYPE UUID USING assigned_to::UUID;

-- Add foreign key constraints
ALTER TABLE tasks
ADD CONSTRAINT tasks_owner_id_fkey 
  FOREIGN KEY (owner_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL,
ADD CONSTRAINT tasks_assigned_to_fkey 
  FOREIGN KEY (assigned_to) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

-- Fix lead_stages table
ALTER TABLE lead_stages
ALTER COLUMN name SET NOT NULL;

-- Add default stages if table is empty
INSERT INTO lead_stages (name, description, order_position, color) 
SELECT 
    name, description, order_position, color
FROM (VALUES 
    ('New', 'Newly created leads', 1, 'blue'),
    ('Contacting', 'In the process of initial contact', 2, 'yellow'),
    ('Qualifying', 'Evaluating lead potential', 3, 'orange'),
    ('Converted', 'Successfully converted to opportunity', 4, 'green'),
    ('Lost', 'Lead was lost or disqualified', 5, 'red')
) AS default_stages(name, description, order_position, color)
WHERE NOT EXISTS (SELECT 1 FROM lead_stages);

-- Refresh RLS policies for tasks
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON tasks;

CREATE POLICY "Enable read access for authenticated users"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON tasks FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON tasks FOR DELETE
  TO authenticated
  USING (true);

-- Refresh RLS policies for lead_stages
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON lead_stages;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON lead_stages;

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

-- Grant necessary permissions
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON lead_stages TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';