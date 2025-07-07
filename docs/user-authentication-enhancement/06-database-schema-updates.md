# Database Schema Updates

## Overview

This document outlines the database schema updates required for the enhanced user authentication system. All changes are designed to be backward compatible and implement proper data relationships with the existing Supabase schema.

## New Database Tables

### 1. user_profiles Table

Extended user profile information beyond what's available in Supabase Auth.

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  location VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'UTC',
  profile_visibility JSONB DEFAULT '{
    "show_name_on_public_resumes": false,
    "allow_email_discovery": false,
    "show_profile_in_sharing": false
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_updated_at ON user_profiles(updated_at);

-- Add RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 2. user_preferences Table

User preferences and settings for customization.

```sql
-- Create user_preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  default_resume_privacy BOOLEAN DEFAULT false,
  default_resume_colors JSONB DEFAULT '{
    "primary": "#0ea5e9",
    "secondary": "#64748b",
    "accent": "#8dd0ca",
    "background": "#ffffff",
    "text": "#1f2937"
  }',
  notification_preferences JSONB DEFAULT '{
    "email_notifications": true,
    "marketing_emails": false,
    "security_alerts": true,
    "product_updates": true,
    "weekly_digest": false
  }',
  privacy_settings JSONB DEFAULT '{
    "analytics_tracking": true,
    "usage_data": true,
    "crash_reports": true,
    "feature_announcements": true
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_theme ON user_preferences(theme);

-- Add RLS policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. user_activity Table

Track user activity for security and analytics.

```sql
-- Create user_activity table
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  location_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX idx_user_activity_action ON user_activity(action);
CREATE INDEX idx_user_activity_resource ON user_activity(resource_type, resource_id);

-- Add RLS policies
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own activity
CREATE POLICY "Users can view their own activity" ON user_activity
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: System can insert activity (no user requirement)
CREATE POLICY "System can insert activity" ON user_activity
  FOR INSERT WITH CHECK (true);
```

### 4. user_sessions Table

Track active user sessions for security management.

```sql
-- Create user_sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255),
  device_info JSONB,
  ip_address INET,
  location_data JSONB,
  is_active BOOLEAN DEFAULT true,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Add RLS policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own sessions
CREATE POLICY "Users can update their own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid() = user_id);
```

### 5. user_exports Table

Track data export requests for GDPR compliance.

```sql
-- Create user_exports table
CREATE TABLE user_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type VARCHAR(50) NOT NULL CHECK (export_type IN ('full_data', 'resumes_only', 'profile_only')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
  file_url TEXT,
  file_size_bytes BIGINT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  download_count INTEGER DEFAULT 0,
  metadata JSONB
);

-- Create indexes
CREATE INDEX idx_user_exports_user_id ON user_exports(user_id);
CREATE INDEX idx_user_exports_status ON user_exports(status);
CREATE INDEX idx_user_exports_requested_at ON user_exports(requested_at);
CREATE INDEX idx_user_exports_expires_at ON user_exports(expires_at);

-- Add RLS policies
ALTER TABLE user_exports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own exports
CREATE POLICY "Users can view their own exports" ON user_exports
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own export requests
CREATE POLICY "Users can insert their own export requests" ON user_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 6. account_deletions Table

Track account deletion requests with recovery period.

```sql
-- Create account_deletions table
CREATE TABLE account_deletions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'cancelled', 'completed')),
  recovery_token VARCHAR(255),
  metadata JSONB,
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_account_deletions_user_id ON account_deletions(user_id);
CREATE INDEX idx_account_deletions_scheduled_for ON account_deletions(scheduled_for);
CREATE INDEX idx_account_deletions_status ON account_deletions(status);
CREATE INDEX idx_account_deletions_recovery_token ON account_deletions(recovery_token);

-- Add RLS policies
ALTER TABLE account_deletions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own deletion requests
CREATE POLICY "Users can view their own deletion requests" ON account_deletions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own deletion requests
CREATE POLICY "Users can insert their own deletion requests" ON account_deletions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own deletion requests
CREATE POLICY "Users can update their own deletion requests" ON account_deletions
  FOR UPDATE USING (auth.uid() = user_id);
```

## Updated Types

### TypeScript Interface Updates

```typescript
// lib/types.ts - Add new interfaces

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  location: string | null;
  timezone: string;
  profile_visibility: {
    show_name_on_public_resumes: boolean;
    allow_email_discovery: boolean;
    show_profile_in_sharing: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  default_resume_privacy: boolean;
  default_resume_colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  notification_preferences: {
    email_notifications: boolean;
    marketing_emails: boolean;
    security_alerts: boolean;
    product_updates: boolean;
    weekly_digest: boolean;
  };
  privacy_settings: {
    analytics_tracking: boolean;
    usage_data: boolean;
    crash_reports: boolean;
    feature_announcements: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  location_data: Record<string, any> | null;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  refresh_token: string | null;
  device_info: Record<string, any> | null;
  ip_address: string | null;
  location_data: Record<string, any> | null;
  is_active: boolean;
  last_accessed: string;
  expires_at: string | null;
  created_at: string;
}

export interface UserExport {
  id: string;
  user_id: string;
  export_type: 'full_data' | 'resumes_only' | 'profile_only';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  file_url: string | null;
  file_size_bytes: number | null;
  requested_at: string;
  completed_at: string | null;
  expires_at: string | null;
  download_count: number;
  metadata: Record<string, any> | null;
}

export interface AccountDeletion {
  id: string;
  user_id: string;
  requested_at: string;
  scheduled_for: string;
  reason: string | null;
  status: 'pending' | 'cancelled' | 'completed';
  recovery_token: string | null;
  metadata: Record<string, any> | null;
}
```

## Database Functions

### 1. Auto-create Profile Function

```sql
-- Function to automatically create user profile and preferences
CREATE OR REPLACE FUNCTION create_user_profile_and_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO user_profiles (user_id, display_name, timezone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
  );
  
  -- Create user preferences
  INSERT INTO user_preferences (user_id, timezone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile_and_preferences();
```

### 2. Activity Logging Function

```sql
-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_action VARCHAR(100),
  p_resource_type VARCHAR(50) DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO user_activity (
    user_id, action, resource_type, resource_id, 
    metadata, ip_address, user_agent
  )
  VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id,
    p_metadata, p_ip_address, p_user_agent
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Session Management Function

```sql
-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions
  WHERE expires_at < NOW()
  OR last_accessed < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. Account Deletion Function

```sql
-- Function to handle account deletion
CREATE OR REPLACE FUNCTION process_account_deletion(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  deletion_record account_deletions%ROWTYPE;
BEGIN
  -- Get deletion record
  SELECT * INTO deletion_record
  FROM account_deletions
  WHERE user_id = p_user_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if scheduled time has passed
  IF deletion_record.scheduled_for > NOW() THEN
    RETURN FALSE;
  END IF;
  
  -- Begin deletion process
  BEGIN
    -- Delete user data (cascade will handle related records)
    DELETE FROM auth.users WHERE id = p_user_id;
    
    -- Update deletion record
    UPDATE account_deletions
    SET status = 'completed'
    WHERE user_id = p_user_id;
    
    RETURN TRUE;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN FALSE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Migration Scripts

### Migration 001: Create User Profiles

```sql
-- migrations/001_create_user_profiles.sql
BEGIN;

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  location VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'UTC',
  profile_visibility JSONB DEFAULT '{
    "show_name_on_public_resumes": false,
    "allow_email_discovery": false,
    "show_profile_in_sharing": false
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_updated_at ON user_profiles(updated_at);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create profiles for existing users
INSERT INTO user_profiles (user_id, display_name, timezone)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', 'User'),
  'UTC'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_profiles);

COMMIT;
```

### Migration 002: Create User Preferences

```sql
-- migrations/002_create_user_preferences.sql
BEGIN;

-- Create user_preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  default_resume_privacy BOOLEAN DEFAULT false,
  default_resume_colors JSONB DEFAULT '{
    "primary": "#0ea5e9",
    "secondary": "#64748b",
    "accent": "#8dd0ca",
    "background": "#ffffff",
    "text": "#1f2937"
  }',
  notification_preferences JSONB DEFAULT '{
    "email_notifications": true,
    "marketing_emails": false,
    "security_alerts": true,
    "product_updates": true,
    "weekly_digest": false
  }',
  privacy_settings JSONB DEFAULT '{
    "analytics_tracking": true,
    "usage_data": true,
    "crash_reports": true,
    "feature_announcements": true
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_theme ON user_preferences(theme);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create preferences for existing users
INSERT INTO user_preferences (user_id, timezone)
SELECT 
  id,
  'UTC'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_preferences);

COMMIT;
```

### Migration Rollback Scripts

```sql
-- rollback/001_rollback_user_profiles.sql
BEGIN;

DROP TABLE IF EXISTS user_profiles CASCADE;

COMMIT;

-- rollback/002_rollback_user_preferences.sql
BEGIN;

DROP TABLE IF EXISTS user_preferences CASCADE;

COMMIT;
```

## Performance Considerations

### Indexing Strategy
- Primary indexes on user_id for all user-related tables
- Composite indexes on frequently queried combinations
- Partial indexes on filtered queries (e.g., active sessions)

### Query Optimization
- Use EXPLAIN ANALYZE for complex queries
- Implement proper pagination for large datasets
- Use connection pooling for high-traffic endpoints

### Data Retention
- Archive old activity logs (>1 year)
- Clean up expired sessions automatically
- Implement data retention policies

## Security Considerations

### Row Level Security (RLS)
- All user tables have RLS enabled
- Users can only access their own data
- System operations use security definer functions

### Data Validation
- Check constraints on enum values
- JSON schema validation for complex fields
- Input sanitization at application layer

### Backup Strategy
- Regular automated backups
- Point-in-time recovery capability
- Encrypted backup storage

## Next Steps

1. **Execute Migrations**: Run migration scripts in staging environment
2. **Test Performance**: Benchmark queries and optimize as needed
3. **Implement APIs**: Create API endpoints using these schema updates
4. **Update Application**: Modify frontend to use new data structures
5. **Monitor Performance**: Set up monitoring for database performance

See [API Endpoints Specification](./07-api-endpoints-specification.md) for related API implementation details.