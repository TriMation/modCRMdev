-- Add assigned_to column to tasks table
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id) ON DELETE SET NULL;

-- Update existing tasks to set assigned_to equal to owner_id
UPDATE tasks 
SET assigned_to = owner_id 
WHERE assigned_to IS NULL;

-- Update task constraints and relations
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
  REFERENCES users(id) 
  ON DELETE SET NULL,
ADD CONSTRAINT tasks_assigned_to_fkey 
  FOREIGN KEY (assigned_to) 
  REFERENCES users(id) 
  ON DELETE SET NULL;

-- Update RLS policies
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