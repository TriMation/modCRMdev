-- Ensure proper foreign key constraints and column names
DO $$ 
BEGIN
    -- Make sure account_id exists and has proper type
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'accounts'
    ) THEN
        ALTER TABLE tasks RENAME COLUMN accounts TO account_id;
    END IF;

    -- Update or add foreign key constraint
    ALTER TABLE tasks 
    DROP CONSTRAINT IF EXISTS tasks_account_id_fkey;

    ALTER TABLE tasks
    ADD CONSTRAINT tasks_account_id_fkey 
    FOREIGN KEY (account_id) 
    REFERENCES accounts(id) 
    ON DELETE SET NULL;

    -- Grant necessary permissions
    GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO authenticated;
    GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
END $$;