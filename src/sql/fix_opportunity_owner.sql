-- Update opportunities table to ensure owner_id references auth.users
ALTER TABLE opportunities
DROP CONSTRAINT IF EXISTS opportunities_owner_id_fkey;

ALTER TABLE opportunities
ALTER COLUMN owner_id TYPE UUID USING owner_id::UUID;

ALTER TABLE opportunities
ADD CONSTRAINT opportunities_owner_id_fkey
  FOREIGN KEY (owner_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- Grant necessary permissions
GRANT ALL ON opportunities TO authenticated;