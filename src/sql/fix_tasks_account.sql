-- First rename the column if it exists with the wrong name
ALTER TABLE tasks 
RENAME COLUMN IF EXISTS accounts TO account_id;

-- Add account_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'tasks' AND column_name = 'account_id') THEN
        ALTER TABLE tasks ADD COLUMN account_id UUID REFERENCES accounts(id) ON DELETE SET NULL;
    END IF;
END $$;