-- Drop existing constraints
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_owner_id_fkey,
DROP CONSTRAINT IF EXISTS tasks_account_id_fkey,
DROP CONSTRAINT IF EXISTS tasks_contact_id_fkey,
DROP CONSTRAINT IF EXISTS tasks_opportunity_id_fkey;

-- Ensure columns have correct types
ALTER TABLE tasks
ALTER COLUMN owner_id TYPE UUID USING owner_id::UUID,
ALTER COLUMN account_id TYPE UUID USING account_id::UUID,
ALTER COLUMN contact_id TYPE UUID USING contact_id::UUID,
ALTER COLUMN opportunity_id TYPE UUID USING opportunity_id::UUID;

-- Add foreign key constraints
ALTER TABLE tasks
ADD CONSTRAINT tasks_owner_id_fkey 
  FOREIGN KEY (owner_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL,
ADD CONSTRAINT tasks_account_id_fkey 
  FOREIGN KEY (account_id) 
  REFERENCES accounts(id) 
  ON DELETE SET NULL,
ADD CONSTRAINT tasks_contact_id_fkey 
  FOREIGN KEY (contact_id) 
  REFERENCES contacts(id) 
  ON DELETE SET NULL,
ADD CONSTRAINT tasks_opportunity_id_fkey 
  FOREIGN KEY (opportunity_id) 
  REFERENCES opportunities(id) 
  ON DELETE SET NULL;

-- Update task status constraint
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE tasks
ADD CONSTRAINT tasks_status_check
  CHECK (status IN ('todo', 'in_progress', 'completed'));

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