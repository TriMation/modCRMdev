-- Fix task relations
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_owner_id_fkey;

-- Ensure owner_id is UUID type and references auth.users
ALTER TABLE tasks
ALTER COLUMN owner_id TYPE UUID USING owner_id::UUID;

ALTER TABLE tasks
ADD CONSTRAINT tasks_owner_id_fkey
  FOREIGN KEY (owner_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- Fix task status
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE tasks
ADD CONSTRAINT tasks_status_check
  CHECK (status IN ('todo', 'in_progress', 'completed'));

-- Grant permissions
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON leads TO authenticated;

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