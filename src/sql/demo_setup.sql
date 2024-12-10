-- Function to create or update demo user and related data
CREATE OR REPLACE FUNCTION create_demo_data()
RETURNS void AS $$
DECLARE
    demo_user_id UUID;
    demo_account_id UUID;
BEGIN
    -- Create or update demo user
    INSERT INTO users (
        email,
        first_name,
        last_name,
        role,
        email_verified,
        active
    )
    VALUES (
        'demo@modcrm.com',
        'Demo',
        'User',
        'user',
        true,
        true
    )
    ON CONFLICT (email) DO UPDATE
    SET 
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email_verified = true,
        active = true,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO demo_user_id;

    -- Create or update demo account
    INSERT INTO accounts (
        name, 
        industry, 
        website, 
        phone, 
        address, 
        city, 
        state, 
        country, 
        owner_id
    )
    VALUES (
        'Acme Corporation',
        'Technology',
        'www.acme.com',
        '(555) 123-4567',
        '123 Tech Street',
        'San Francisco',
        'CA',
        'United States',
        demo_user_id
    )
    ON CONFLICT (name) DO UPDATE 
    SET 
        owner_id = EXCLUDED.owner_id,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO demo_account_id;

    -- Create or update demo contacts
    INSERT INTO contacts (
        first_name,
        last_name,
        email,
        phone,
        position,
        account_id,
        owner_id
    )
    VALUES 
        ('John', 'Smith', 'john@acme.com', '(555) 123-4567', 'CEO', demo_account_id, demo_user_id),
        ('Jane', 'Doe', 'jane@acme.com', '(555) 987-6543', 'CTO', demo_account_id, demo_user_id)
    ON CONFLICT (email, account_id) DO UPDATE 
    SET 
        owner_id = EXCLUDED.owner_id,
        updated_at = CURRENT_TIMESTAMP;

    -- Create or update demo tasks
    INSERT INTO tasks (
        type,
        subject,
        description,
        due_date,
        priority,
        account_id,
        owner_id
    )
    VALUES (
        'Call',
        'Follow up with Acme Corp',
        'Discuss new project requirements',
        CURRENT_TIMESTAMP + INTERVAL '7 days',
        'high',
        demo_account_id,
        demo_user_id
    )
    ON CONFLICT DO NOTHING;

END;
$$ LANGUAGE plpgsql;

-- Execute the function to create/update demo data
SELECT create_demo_data();

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;