-- NyayaSetu Database Schema
-- Phase 1: Users, Visits, and Admin Management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (linked to Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User visits tracking
CREATE TABLE IF NOT EXISTS public.user_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  page_path TEXT,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT
);

-- Calculator usage tracking
CREATE TABLE IF NOT EXISTS public.calculator_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  calculator_type TEXT NOT NULL, -- 'sip', 'emi', 'tax', 'insurance'
  input_data JSONB,
  result_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI chat history
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI image generations
CREATE TABLE IF NOT EXISTS public.ai_image_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculator_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_image_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Admin can update all users (for premium toggle)
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- RLS Policies for user_visits
CREATE POLICY "Users can view own visits" ON public.user_visits
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert visits" ON public.user_visits
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view all visits" ON public.user_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- RLS Policies for calculator_usage
CREATE POLICY "Users can view own calculator usage" ON public.calculator_usage
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can insert calculator usage" ON public.calculator_usage
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view all calculator usage" ON public.calculator_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- RLS Policies for ai_chat_history
CREATE POLICY "Users can view own chat history" ON public.ai_chat_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own chat history" ON public.ai_chat_history
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for ai_image_generations
CREATE POLICY "Users can view own image generations" ON public.ai_image_generations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own image generations" ON public.ai_image_generations
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Trigger to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, location, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'location', NULL),
    CASE WHEN NEW.email = 'advlakhilohia@gmail.com' THEN TRUE ELSE FALSE END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_visits_user_id ON public.user_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_visits_visited_at ON public.user_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_calculator_usage_user_id ON public.calculator_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_calculator_usage_type ON public.calculator_usage(calculator_type);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_user_id ON public.ai_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_session ON public.ai_chat_history(session_id);
