-- Add additional_context column to resumes table for JobFit Tailor feature
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS additional_context JSONB;

-- Add comment to document the column
COMMENT ON COLUMN resumes.additional_context IS 'Stores job specification and tone settings for tailored resumes';