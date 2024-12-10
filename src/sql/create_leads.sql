-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  value DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  probability INTEGER CHECK (probability >= 0 AND probability <= 100) DEFAULT 50,
  source VARCHAR(50),
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  converted_opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  converted_at TIMESTAMP WITH TIME ZONE,
  expected_close_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

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

-- Create updated_at trigger
CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();