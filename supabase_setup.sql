-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor to create the required tables

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create learning_plans table
CREATE TABLE IF NOT EXISTS learning_plans (
  id SERIAL PRIMARY KEY,
  plan_name VARCHAR(255) NOT NULL,
  total_days INTEGER NOT NULL,
  plan_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create day_summaries table
CREATE TABLE IF NOT EXISTS day_summaries (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  summary TEXT NOT NULL,
  key_points TEXT[] NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create day_content table
CREATE TABLE IF NOT EXISTS day_content (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  additional_notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create day_quizzes table
CREATE TABLE IF NOT EXISTS day_quizzes (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  questions JSONB NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Create user_progress table (if not exists)
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  day INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  time_spent INTEGER DEFAULT 0,
  quiz_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_learning_plans_active ON learning_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_day_summaries_day ON day_summaries(day);
CREATE INDEX IF NOT EXISTS idx_day_content_day ON day_content(day);
CREATE INDEX IF NOT EXISTS idx_day_quizzes_day ON day_quizzes(day);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_day ON user_progress(day);

-- 8. Enable Row Level Security (RLS) - Optional, adjust based on your needs
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE day_summaries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE day_content ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE day_quizzes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 9. Create policies for admin access (adjust based on your security needs)
-- Policy for users table - allow admin to read all users
-- CREATE POLICY "Admin can read all users" ON users
--   FOR SELECT USING (auth.jwt() ->> 'email' = 'shashanknani1312@gmail.com');

-- Policy for learning_plans table - allow admin to manage all plans
-- CREATE POLICY "Admin can manage learning plans" ON learning_plans
--   FOR ALL USING (auth.jwt() ->> 'email' = 'shashanknani1312@gmail.com');

-- Policy for day_summaries table - allow admin to manage all summaries
-- CREATE POLICY "Admin can manage day summaries" ON day_summaries
--   FOR ALL USING (auth.jwt() ->> 'email' = 'shashanknani1312@gmail.com');

-- Policy for day_content table - allow admin to manage all content
-- CREATE POLICY "Admin can manage day content" ON day_content
--   FOR ALL USING (auth.jwt() ->> 'email' = 'shashanknani1312@gmail.com');

-- Policy for day_quizzes table - allow admin to manage all quizzes
-- CREATE POLICY "Admin can manage day quizzes" ON day_quizzes
--   FOR ALL USING (auth.jwt() ->> 'email' = 'shashanknani1312@gmail.com');

-- Policy for user_progress table - allow admin to read all progress
-- CREATE POLICY "Admin can read all user progress" ON user_progress
--   FOR SELECT USING (auth.jwt() ->> 'email' = 'shashanknani1312@gmail.com');

-- 10. Insert default admin user (optional)
INSERT INTO users (email, name, status) 
VALUES ('shashanknani1312@gmail.com', 'Admin User', 'active')
ON CONFLICT (email) DO NOTHING;

-- 11. Insert default learning plan (optional)
INSERT INTO learning_plans (plan_name, total_days, plan_data, is_active)
VALUES (
  'Default AI Learning Plan',
  90,
  '{"totalDays": 90, "weeks": []}'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- Note: If you're getting 403 errors, you might need to:
-- 1. Disable RLS temporarily: ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
-- 2. Or create proper policies for your admin user
-- 3. Or use service role key instead of anon key for admin operations
