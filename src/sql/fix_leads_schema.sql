-- Drop existing lead_stages table if it exists
DROP TABLE IF EXISTS lead_stages CASCADE;

-- Create lead_stages table
CREATE TABLE lead_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    order_position INTEGER NOT NULL,
    color VARCHAR(50) DEFAULT 'gray',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(order_position)
);

-- Drop existing leads table if it exists
DROP TABLE IF EXISTS leads CASCADE;

-- Create leads table with proper relations
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    value DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'USD',
    stage_id UUID REFERENCES lead_stages(id) ON DELETE SET NULL,
    probability INTEGER CHECK (probability >= 0 AND probability <= 100) DEFAULT 50,
    source VARCHAR(50),
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    converted_opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
    converted_at TIMESTAMP WITH TIME ZONE,
    expected_close_date DATE,
    lost_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default lead stages
INSERT INTO lead_stages (name, description, order_position, color) 
VALUES 
    ('New', 'Newly created leads', 1, 'blue'),
    ('Contacting', 'In the process of initial contact', 2, 'yellow'),
    ('Qualifying', 'Evaluating lead potential', 3, 'orange'),
    ('Converted', 'Successfully converted to opportunity', 4, 'green'),
    ('Lost', 'Lead was lost or disqualified', 5, 'red')
ON CONFLICT (order_position) DO NOTHING;

-- Create updated_at triggers
CREATE TRIGGER set_lead_stages_updated_at
    BEFORE UPDATE ON lead_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE lead_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lead_stages
CREATE POLICY "Enable read access for authenticated users"
    ON lead_stages FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create RLS policies for leads
CREATE POLICY "Enable read access for authenticated users"
    ON leads FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
    ON leads FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
    ON leads FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users"
    ON leads FOR DELETE
    USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON lead_stages TO authenticated;
GRANT ALL ON leads TO authenticated;