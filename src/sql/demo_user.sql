-- Create demo user if it doesn't exist
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'demo@modcrm.com',
    crypt('demo123!@#', gen_salt('bf')),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Demo","last_name":"User"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO UPDATE SET
    email_confirmed_at = now(),
    updated_at = now();

-- Get the auth.users id for the demo user
WITH demo_auth_user AS (
    SELECT id FROM auth.users WHERE email = 'demo@modcrm.com'
)
-- Create or update the demo user in our users table
INSERT INTO users (
    auth_id,
    email,
    first_name,
    last_name,
    role,
    active,
    email_verified,
    last_login
) VALUES (
    (SELECT id FROM demo_auth_user),
    'demo@modcrm.com',
    'Demo',
    'User',
    'user',
    true,
    true,
    now()
) ON CONFLICT (email) DO UPDATE SET
    auth_id = (SELECT id FROM demo_auth_user),
    email_verified = true,
    active = true,
    last_login = now(),
    updated_at = now();