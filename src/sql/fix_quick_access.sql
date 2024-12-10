-- Drop existing quick_access table if it exists
DROP TABLE IF EXISTS quick_access CASCADE;

-- Create quick_access table with proper relations
CREATE TABLE quick_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    record_id UUID NOT NULL,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('account', 'contact')),
    record_name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX quick_access_user_id_idx ON quick_access(user_id);
CREATE INDEX quick_access_record_type_idx ON quick_access(record_type);

-- Create updated_at trigger
CREATE TRIGGER set_quick_access_updated_at
    BEFORE UPDATE ON quick_access
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE quick_access ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own quick access records"
    ON quick_access FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quick access records"
    ON quick_access FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quick access records"
    ON quick_access FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quick access records"
    ON quick_access FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON quick_access TO authenticated;