# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project name: "ui-component-generator"
6. Enter database password (save this securely)
7. Choose region closest to you
8. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" (gear icon) in the sidebar
3. Click on "API" under Project Settings
4. Copy your:
   - Project URL (VITE_SUPABASE_URL)
   - Anon public key (VITE_SUPABASE_ANON_KEY)

## 3. Update Environment Variables

Replace the placeholder values in your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Set Up Database Table

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Click "New query"
4. Paste and run this SQL:

```sql
-- Create saved_components table
CREATE TABLE saved_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT DEFAULT 'component',
  description TEXT,
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE saved_components ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own components" ON saved_components
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own components" ON saved_components
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own components" ON saved_components
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own components" ON saved_components
  FOR DELETE USING (auth.uid() = user_id);

-- Add user_id automatically
CREATE OR REPLACE FUNCTION add_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_user_id_trigger
  BEFORE INSERT ON saved_components
  FOR EACH ROW
  EXECUTE FUNCTION add_user_id();
```

## 5. Configure Authentication (Optional)

1. Go to "Authentication" > "Settings" in your Supabase dashboard
2. Under "Auth Settings":
   - Enable email confirmations if you want users to verify their email
   - Configure redirect URLs if needed
   - Set up any additional auth providers (Google, GitHub, etc.)

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Try creating an account and logging in
3. Generate a component and try saving it
4. Check your Supabase dashboard > "Table Editor" > "saved_components" to see saved data

## Features Implemented

✅ User registration and login
✅ User authentication state management
✅ Component saving to database
✅ User-specific component lists
✅ Component deletion
✅ Secure data access with Row Level Security
✅ Automatic user_id assignment
✅ Beautiful login/register modals
✅ Account display in sidebar
✅ Sign out functionality

## Security Notes

- Row Level Security (RLS) is enabled to ensure users can only access their own data
- Environment variables are used for sensitive credentials
- Supabase handles password hashing and security automatically
- All database operations are authenticated and authorized

## Troubleshooting

- **"Invalid JWT"**: Check your VITE_SUPABASE_ANON_KEY is correct
- **"Cross-origin error"**: Verify your project URL is correct
- **"Table doesn't exist"**: Make sure you ran the SQL setup script
- **"Permission denied"**: Check RLS policies are correctly applied
