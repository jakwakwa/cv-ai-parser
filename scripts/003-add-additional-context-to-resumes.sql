-- Add additional_context column to public.resumes table
ALTER TABLE public.resumes
ADD COLUMN additional_context JSONB;

-- Optionally, set a default value for existing rows (if needed)
-- This is not strictly necessary for JSONB if you prefer NULL for old data
-- UPDATE public.resumes SET additional_context = 'null'::jsonb WHERE additional_context IS NULL;

-- Create an index for faster queries if you plan to query on this column often
-- CREATE INDEX idx_resumes_additional_context ON public.resumes USING GIN (additional_context); 