-- Add status column to tasks table if it doesn't exist
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) CHECK (status IN ('todo', 'in_progress', 'completed'));

-- Set default value for existing rows
UPDATE tasks SET status = 'todo' WHERE status IS NULL;

-- Make status column required
ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;

-- Add default value for new rows
ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'todo';