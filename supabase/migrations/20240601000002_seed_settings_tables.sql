-- Seed data for users_settings table
-- Note: These users must exist in auth.users table first
-- For demo purposes, we're using NULL for user_id since the referenced users don't exist yet
INSERT INTO users_settings (user_id, role, email, full_name, active)
VALUES
  (NULL, 'Claims Admin', 'admin@example.com', 'Admin User', true),
  (NULL, 'Claims Supervisor', 'supervisor1@example.com', 'Jane Smith', true),
  (NULL, 'Claims Supervisor', 'supervisor2@example.com', 'Michael Johnson', true),
  (NULL, 'Claims Investigator', 'investigator1@example.com', 'Sarah Williams', true),
  (NULL, 'Claims Investigator', 'investigator2@example.com', 'Robert Brown', true),
  (NULL, 'Claims Investigator', 'investigator3@example.com', 'Emily Davis', true),
  (NULL, 'Claims Investigator', 'investigator4@example.com', 'David Miller', true),
  (NULL, 'Read Only', 'readonly1@example.com', 'Jennifer Wilson', true),
  (NULL, 'Read Only', 'readonly2@example.com', 'Thomas Moore', true),
  (NULL, 'Claims Admin', 'admin2@example.com', 'Lisa Taylor', false)
ON CONFLICT (email) DO NOTHING;

-- Seed data for customer_accounts table
INSERT INTO customer_accounts (customer_code, customer_name, contact_name, contact_email, contact_phone, active)
VALUES
  ('ACME001', 'Acme Corporation', 'John Doe', 'john.doe@acme.com', '+61 2 9876 5432', true),
  ('GLOB002', 'Global Logistics', 'Jane Smith', 'jane.smith@globallogistics.com', '+61 3 8765 4321', true),
  ('FAST003', 'Fast Freight Ltd', 'Michael Johnson', 'mjohnson@fastfreight.com.au', '+61 4 7654 3210', true),
  ('EXPR004', 'Express Shipping', 'Sarah Williams', 'sarah@expressshipping.com', '+61 8 6543 2109', true),
  ('CARG005', 'Cargo Masters', 'Robert Brown', 'rbrown@cargomasters.com.au', '+61 7 5432 1098', true),
  ('PREM006', 'Premium Transport', 'Emily Davis', 'emily.davis@premiumtransport.com', '+61 2 4321 0987', true),
  ('ELIT007', 'Elite Logistics', 'David Miller', 'dmiller@elitelogistics.com.au', '+61 3 3210 9876', true),
  ('SPEE008', 'Speedy Delivery', 'Jennifer Wilson', 'jennifer@speedydelivery.com', '+61 4 2109 8765', false),
  ('RELI009', 'Reliable Freight', 'Thomas Moore', 'tmoore@reliablefreight.com.au', '+61 8 1098 7654', true),
  ('PRIM010', 'Prime Shipping', 'Lisa Taylor', 'lisa.taylor@primeshipping.com', '+61 7 0987 6543', true)
ON CONFLICT (customer_code) DO NOTHING;

-- Seed data for cost_centres table
INSERT INTO cost_centres (code, name, description, active)
VALUES
  ('CC001', 'Transport Operations', 'All transport related operational costs', true),
  ('CC002', 'Warehouse Sydney', 'Sydney warehouse operational costs', true),
  ('CC003', 'Warehouse Melbourne', 'Melbourne warehouse operational costs', true),
  ('CC004', 'Warehouse Brisbane', 'Brisbane warehouse operational costs', true),
  ('CC005', 'Warehouse Perth', 'Perth warehouse operational costs', true),
  ('CC006', 'Customer Service', 'Customer service department costs', true),
  ('CC007', 'Claims Department', 'Claims processing department costs', true),
  ('CC008', 'Fleet Maintenance', 'Vehicle maintenance and repair costs', true),
  ('CC009', 'Administration', 'General administrative costs', true),
  ('CC010', 'IT Department', 'Information technology costs', true)
ON CONFLICT (code) DO NOTHING;

-- Seed data for claim_types table
INSERT INTO claim_types (code, name, description, validity_period_days, extended_period_days, active)
VALUES
  ('DAMAGE', 'Damage Claim', 'Claims for damaged goods during transport', 7, 45, true),
  ('LOSS', 'Loss Claim', 'Claims for lost items during transport', 14, 45, true),
  ('DELAY', 'Delay Claim', 'Claims for delayed delivery', 5, 30, true),
  ('STORAGE', 'Storage Damage', 'Claims for damage during warehouse storage', 10, 45, true),
  ('HANDLING', 'Handling Damage', 'Claims for damage during loading/unloading', 7, 45, true),
  ('SHORTAGE', 'Shortage Claim', 'Claims for partial loss of goods', 14, 45, true),
  ('TEMPERATURE', 'Temperature Damage', 'Claims for temperature-sensitive goods', 3, 21, true),
  ('PACKAGING', 'Packaging Damage', 'Claims for damage due to insufficient packaging', 7, 30, false),
  ('WATER', 'Water Damage', 'Claims for water/moisture damage', 7, 45, true),
  ('OTHER', 'Other Claims', 'Miscellaneous claims not fitting other categories', 14, 60, true)
ON CONFLICT (code) DO NOTHING;

-- Seed data for damage_types table
INSERT INTO damage_types (code, name, description, active)
VALUES
  ('CRUSH', 'Crushed', 'Item crushed during transport or handling', true),
  ('BREAK', 'Broken', 'Item broken or fractured', true),
  ('SCRATCH', 'Scratched', 'Surface scratches or marks', true),
  ('DENT', 'Dented', 'Item dented or deformed', true),
  ('TEAR', 'Torn', 'Item torn or ripped', true),
  ('WATER', 'Water Damaged', 'Damage caused by water or moisture', true),
  ('STAIN', 'Stained', 'Item stained or discolored', true),
  ('MOLD', 'Mold/Mildew', 'Damage from mold or mildew growth', true),
  ('HEAT', 'Heat Damaged', 'Damage caused by excessive heat', true),
  ('COLD', 'Cold Damaged', 'Damage caused by freezing or extreme cold', true)
ON CONFLICT (code) DO NOTHING;

-- Seed data for gst_rates table
INSERT INTO gst_rates (rate_name, rate_percentage, is_default, active)
VALUES
  ('Standard GST', 10.00, true, true),
  ('Zero Rated', 0.00, false, true),
  ('Reduced Rate', 5.00, false, true),
  ('Export Rate', 0.00, false, true),
  ('Special Zone', 7.50, false, true),
  ('Luxury Items', 15.00, false, true),
  ('Essential Goods', 0.00, false, true),
  ('Medical Supplies', 0.00, false, true),
  ('Educational Materials', 0.00, false, true),
  ('Custom Rate', 12.50, false, false)
ON CONFLICT (rate_name) DO NOTHING;

-- Seed data for approval_levels table
INSERT INTO approval_levels (level_name, threshold_amount, description, active)
VALUES
  ('Level 1', 1000.00, 'First level approval for small claims', true),
  ('Level 2', 5000.00, 'Second level approval for medium claims', true),
  ('Level 3', 20000.00, 'Third level approval for large claims', true),
  ('Level 4', 50000.00, 'Fourth level approval for major claims', true),
  ('Level 5', 100000.00, 'Fifth level approval for critical claims', true),
  ('Special Case', 0.00, 'Special case approval regardless of amount', true),
  ('Customer Service', 500.00, 'Customer service level approval', true),
  ('Operations Manager', 10000.00, 'Operations manager approval level', true),
  ('Finance Director', 75000.00, 'Finance director approval level', true),
  ('CEO', 200000.00, 'CEO approval level for exceptional cases', true)
ON CONFLICT (level_name) DO NOTHING;

-- Seed data for withdrawal_reasons table
INSERT INTO withdrawal_reasons (code, reason, description, active)
VALUES
  ('CUST_REQ', 'Customer Request', 'Withdrawn at customer request', true),
  ('DUPLICATE', 'Duplicate Claim', 'Claim was a duplicate of an existing claim', true),
  ('RESOLVED', 'Issue Resolved', 'Issue resolved without formal claim process', true),
  ('INCORRECT', 'Incorrect Information', 'Claim contained incorrect information', true),
  ('INSURANCE', 'Insurance Coverage', 'Customer pursuing through their own insurance', true),
  ('TIMEOUT', 'Response Timeout', 'Customer did not respond to information requests', true),
  ('GOODWILL', 'Goodwill Resolution', 'Resolved through goodwill gesture outside claims process', true),
  ('RESUBMIT', 'Will Resubmit', 'Customer will resubmit with correct information', true),
  ('THIRD_PARTY', 'Third Party Liability', 'Liability determined to be with third party', true),
  ('OTHER_WITH', 'Other Withdrawal Reason', 'Other reason not listed', true)
ON CONFLICT (code) DO NOTHING;

-- Seed data for declined_reasons table
INSERT INTO declined_reasons (code, reason, description, active)
VALUES
  ('LATE_CLAIM', 'Late Claim', 'Claim submitted after validity period', true),
  ('NO_EVIDENCE', 'Insufficient Evidence', 'Insufficient evidence provided to support claim', true),
  ('PACKAGING', 'Inadequate Packaging', 'Damage due to inadequate packaging by sender', true),
  ('INHERENT', 'Inherent Vice', 'Damage due to inherent nature of goods', true),
  ('FORCE_MAJ', 'Force Majeure', 'Damage caused by circumstances beyond control', true),
  ('TERMS', 'Terms Exclusion', 'Excluded under terms and conditions', true),
  ('PRE_EXIST', 'Pre-existing Damage', 'Damage existed prior to transport', true),
  ('THIRD_PARTY', 'Third Party Liability', 'Liability lies with third party', true),
  ('FRAUD', 'Suspected Fraud', 'Evidence suggests fraudulent claim', true),
  ('OTHER_DEC', 'Other Decline Reason', 'Other reason not listed', true)
ON CONFLICT (code) DO NOTHING;

-- Seed data for system_settings table
INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
VALUES
  ('default_claim_type', 'DAMAGE', 'string', 'Default claim type for new claims'),
  ('notification_email', 'claims@example.com', 'string', 'Email address for system notifications'),
  ('auto_assign_claims', 'true', 'boolean', 'Automatically assign new claims to investigators'),
  ('claim_number_prefix', 'CLM', 'string', 'Prefix for claim reference numbers'),
  ('max_attachment_size', '10', 'number', 'Maximum attachment size in MB'),
  ('retention_period_days', '365', 'number', 'Number of days to retain closed claims'),
  ('enable_customer_portal', 'true', 'boolean', 'Enable customer web portal access'),
  ('enable_driver_app', 'true', 'boolean', 'Enable driver delivery app integration'),
  ('default_currency', 'AUD', 'string', 'Default currency for claim amounts'),
  ('company_name', 'Transport Claims Management', 'string', 'Company name for reports and emails')
ON CONFLICT (setting_key) DO NOTHING;