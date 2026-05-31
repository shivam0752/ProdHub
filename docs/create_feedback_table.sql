-- =====================================================
-- SQL Script to create public.feedback table in Supabase
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Create the feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy: Allow anyone to insert feedback submissions
CREATE POLICY "Allow anyone to insert feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

-- 4. Create Policy: Allow administrator users to view feedback submissions
CREATE POLICY "Allow admin users to view feedback" 
ON public.feedback 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
  )
);
