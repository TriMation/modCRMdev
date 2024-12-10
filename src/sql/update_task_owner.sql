-- First, drop the existing foreign key constraint
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_owner_id_fkey;

-- Update the owner_id column to reference auth_id instead of id
ALTER TABLE tasks
ADD CONSTRAINT tasks_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES users(auth_id)
ON DELETE SET NULL;

-- Update existing tasks to use auth_id
UPDATE tasks t
SET owner_id = u.auth_id
FROM users u
WHERE t.owner_id = u.id::text;