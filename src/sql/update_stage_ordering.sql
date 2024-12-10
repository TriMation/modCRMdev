-- Add order_position column if it doesn't exist
ALTER TABLE lead_stages 
ADD COLUMN IF NOT EXISTS order_position INTEGER;

ALTER TABLE opportunity_stages 
ADD COLUMN IF NOT EXISTS order_position INTEGER;

-- Update order_position for existing records if null
UPDATE lead_stages 
SET order_position = subquery.row_num 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num 
  FROM lead_stages
) as subquery 
WHERE lead_stages.id = subquery.id 
AND lead_stages.order_position IS NULL;

UPDATE opportunity_stages 
SET order_position = subquery.row_num 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num 
  FROM opportunity_stages
) as subquery 
WHERE opportunity_stages.id = subquery.id 
AND opportunity_stages.order_position IS NULL;

-- Make order_position required
ALTER TABLE lead_stages 
ALTER COLUMN order_position SET NOT NULL;

ALTER TABLE opportunity_stages 
ALTER COLUMN order_position SET NOT NULL;

-- Add unique constraint on order_position
ALTER TABLE lead_stages 
ADD CONSTRAINT lead_stages_order_position_unique UNIQUE (order_position);

ALTER TABLE opportunity_stages 
ADD CONSTRAINT opportunity_stages_order_position_unique UNIQUE (order_position);