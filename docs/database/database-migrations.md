# Database Migrations

This document outlines the database migrations required for the CV AI Parser application.

## Migration Scripts

All migration scripts are located in the `scripts/` directory and should be executed in order.

### 001-create-tables.sql

Initial database setup with core tables structure.

### 002-add-additional-context.sql

Adds support for JobFit Tailor feature by adding the `additional_context` column to store job specification and tone settings.

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** (in the left sidebar)
4. Click **New query**
5. Copy and paste the SQL from the migration file
6. Click **Run** (or press Cmd/Ctrl + Enter)

### Option 2: Using Supabase CLI

```bash
supabase db push --db-url "your-database-url"
```

### Option 3: Direct PostgreSQL Connection

If you have a direct database connection string:

```bash
psql "your-connection-string" -f scripts/001-create-tables.sql
psql "your-connection-string" -f scripts/002-add-additional-context.sql
```

## Migration Details

### 002-add-additional-context.sql Details

**Purpose**: Adds JobFit Tailor feature support to the database.

**Changes**:

- Adds `additional_context` column to `resumes` table
- Column type: `JSONB`
- Stores job specification text, tone settings, and extra prompts for tailored resumes

**SQL**:

```sql
-- Add additional_context column to resumes table for JobFit Tailor feature
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS additional_context JSONB;

-- Add comment to document the column
COMMENT ON COLUMN resumes.additional_context IS 'Stores job specification and tone settings for tailored resumes';
```

## Verifying Migrations

After running a migration, verify it was successful:

### Check if additional_context column exists

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'resumes' 
AND column_name = 'additional_context';
```

### Check table structure

Expected result:

```sql
\d resumes
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure your database user has `ALTER TABLE` privileges
2. **Column Already Exists**: The `IF NOT EXISTS` clause should prevent this, but if you see warnings, it's safe to ignore
3. **Connection Issues**: Verify your database connection string and network access

### Getting Help

If you encounter issues:

1. Check the Supabase project logs
2. Verify your database permissions
3. Ensure you're connected to the correct database environment

## Data Types Used

- `JSONB`: Optimized JSON data type that supports indexing and efficient queries
- Used for `additional_context` to store flexible job specification data

## Temporary Workaround (Current Status)

⚠️ **Important**: A temporary workaround is currently implemented in the codebase to handle the missing `additional_context` column.

### What's Currently Active

**File**: `app/api/parse-resume-enhanced/route.ts`  
**Location**: Database save operation (around line 205)

**Temporary Fix**:
```typescript
try {
  savedResume = await ResumeDatabase.saveResume(supabase, {
    // ... resume data including additionalContext
  });
} catch (error) {
  console.error('Database save failed (missing migration?), continuing without save:', error);
  // Continue without saving - user will still get the tailored resume
  // TODO: Remove this try-catch after running the database migration
}
```

### What This Means

- ✅ **Job tailoring feature works** - users get tailored resumes
- ✅ **No API crashes** - graceful error handling
- ⚠️ **Database saves fail silently** - resumes aren't saved to database until migration is run
- 📝 **Console warnings** - you'll see database save errors in logs

### How to Remove the Temporary Fix

After running the `002-add-additional-context.sql` migration:

1. **Test the feature** - ensure database saves work
2. **Remove the try-catch block** in `app/api/parse-resume-enhanced/route.ts`
3. **Revert to original code**:

```typescript
// REMOVE the try-catch wrapper and restore:
savedResume = await ResumeDatabase.saveResume(supabase, {
  userId: user.id,
  title: resumeTitle,
  originalFilename: file.name,
  fileType: file.type,
  fileSize: file.size,
  parsedData: finalParsedData,
  parseMethod: 'ai_enhanced',
  confidenceScore: 98,
  isPublic: true,
  slug,
  additionalContext,
});
```

4. **Remove the TODO comment** and cleanup

### Why This Workaround Was Added

- **Error**: `Could not find the 'additional_context' column of 'resumes' in the schema cache`
- **Impact**: Job tailoring feature crashed when trying to save to database
- **Solution**: Allow feature to work while database migration is pending

## Best Practices

1. **Always backup** your database before running migrations
2. **Test migrations** on a development environment first
3. **Run migrations in order** - they may have dependencies
4. **Verify results** after each migration
5. **Keep migration scripts** in version control for team synchronization
