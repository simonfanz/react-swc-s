-- Create users table (if not exists already)
CREATE TABLE IF NOT EXISTS users_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Claims Investigator', 'Claims Supervisor', 'Claims Admin', 'Read Only')),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer accounts table
CREATE TABLE IF NOT EXISTS customer_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_code VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cost centres table
CREATE TABLE IF NOT EXISTS cost_centres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create claim types table
CREATE TABLE IF NOT EXISTS claim_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  validity_period_days INTEGER NOT NULL DEFAULT 14,
  extended_period_days INTEGER NOT NULL DEFAULT 45,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create damage types table
CREATE TABLE IF NOT EXISTS damage_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create GST rates table
CREATE TABLE IF NOT EXISTS gst_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rate_name VARCHAR(100) NOT NULL UNIQUE,
  rate_percentage DECIMAL(5,2) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approval levels table
CREATE TABLE IF NOT EXISTS approval_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_name VARCHAR(50) NOT NULL UNIQUE,
  threshold_amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approval users table (linking users to approval levels)
CREATE TABLE IF NOT EXISTS approval_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  approval_level_id UUID REFERENCES approval_levels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(approval_level_id, user_id)
);

-- Create withdrawal reasons table
CREATE TABLE IF NOT EXISTS withdrawal_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create declined reasons table
CREATE TABLE IF NOT EXISTS declined_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table users_settings;
alter publication supabase_realtime add table customer_accounts;
alter publication supabase_realtime add table cost_centres;
alter publication supabase_realtime add table claim_types;
alter publication supabase_realtime add table damage_types;
alter publication supabase_realtime add table gst_rates;
alter publication supabase_realtime add table approval_levels;
alter publication supabase_realtime add table approval_users;
alter publication supabase_realtime add table withdrawal_reasons;
alter publication supabase_realtime add table declined_reasons;
alter publication supabase_realtime add table system_settings;

-- Create basic policies for access
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON users_settings;
CREATE POLICY "Allow full access to authenticated users"
  ON users_settings
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON customer_accounts;
CREATE POLICY "Allow full access to authenticated users"
  ON customer_accounts
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON cost_centres;
CREATE POLICY "Allow full access to authenticated users"
  ON cost_centres
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON claim_types;
CREATE POLICY "Allow full access to authenticated users"
  ON claim_types
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON damage_types;
CREATE POLICY "Allow full access to authenticated users"
  ON damage_types
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON gst_rates;
CREATE POLICY "Allow full access to authenticated users"
  ON gst_rates
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON approval_levels;
CREATE POLICY "Allow full access to authenticated users"
  ON approval_levels
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON approval_users;
CREATE POLICY "Allow full access to authenticated users"
  ON approval_users
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON withdrawal_reasons;
CREATE POLICY "Allow full access to authenticated users"
  ON withdrawal_reasons
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON declined_reasons;
CREATE POLICY "Allow full access to authenticated users"
  ON declined_reasons
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow full access to authenticated users" ON system_settings;
CREATE POLICY "Allow full access to authenticated users"
  ON system_settings
  USING (auth.role() = 'authenticated');
