-- Create lead_stages table
CREATE TABLE IF NOT EXISTS lead_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    order_position INTEGER NOT NULL,
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(order_position)
);

-- Add stage_id to leads table
ALTER TABLE leads 
DROP COLUMN IF EXISTS status;

ALTER TABLE leads
ADD COLUMN stage_id UUID REFERENCES lead_stages(id);

-- Add lost_reason to leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS lost_reason TEXT;

-- Insert default stages
INSERT INTO lead_stages (name, description, order_position, color) 
VALUES 
    ('New', 'Newly created leads', 1, 'blue'),
    ('Contacting', 'In the process of initial contact', 2, 'yellow'),
    ('Qualifying', 'Evaluating lead potential', 3, 'orange'),
    ('Converted', 'Successfully converted to opportunity', 4, 'green'),
    ('Lost', 'Lead was lost or disqualified', 5, 'red')
ON CONFLICT (order_position) DO NOTHING;

-- Update triggers
CREATE TRIGGER set_lead_stages_updated_at
    BEFORE UPDATE ON lead_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for lead_stages
ALTER TABLE lead_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
    ON lead_stages FOR SELECT
    USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON lead_stages TO authenticated;