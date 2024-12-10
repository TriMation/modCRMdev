-- Drop existing foreign key constraints if they exist
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_owner_id_fkey,
DROP CONSTRAINT IF EXISTS tasks_account_id_fkey,
DROP CONSTRAINT IF EXISTS tasks_contact_id_fkey,
DROP CONSTRAINT IF EXISTS tasks_opportunity_id_fkey;

-- Ensure owner_id is UUID type
ALTER TABLE tasks
ALTER COLUMN owner_id TYPE UUID USING owner_id::UUID;

-- Add foreign key constraints
ALTER TABLE tasks
ADD CONSTRAINT tasks_owner_id_fkey 
  FOREIGN KEY (owner_id) 
  REFERENCES users(id) 
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

-- Fix task status
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE tasks
ADD CONSTRAINT tasks_status_check
  CHECK (status IN ('todo', 'in_progress', 'completed'));

-- Enable RLS policies for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Grant necessary permissions
GRANT ALL ON tasks TO authenticated;