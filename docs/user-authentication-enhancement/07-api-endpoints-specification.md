# API Endpoints Specification

## Overview

This document defines the API endpoints required for the enhanced user authentication system. All endpoints follow RESTful conventions and include proper authentication, validation, and error handling.

## Base Configuration

### Base URL
```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

### Authentication
All user-specific endpoints require authentication via Supabase session cookies or Authorization header.

```typescript
// Headers for authenticated requests
{
  "Authorization": "Bearer <supabase_access_token>",
  "Content-Type": "application/json"
}
```

### Response Format
All endpoints return JSON with consistent structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
```

## User Profile Endpoints

### GET /api/user/profile
Get the current user's profile information.

#### Request
```typescript
GET /api/user/profile
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "456e7890-e89b-12d3-a456-426614174000",
    "display_name": "John Doe",
    "bio": "Software Developer with 5 years experience",
    "avatar_url": "https://storage.supabase.co/bucket/avatars/user123.jpg",
    "website_url": "https://johndoe.com",
    "location": "San Francisco, CA",
    "timezone": "America/Los_Angeles",
    "profile_visibility": {
      "show_name_on_public_resumes": true,
      "allow_email_discovery": false,
      "show_profile_in_sharing": true
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  }
}
```

#### Error Responses
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Profile not found (auto-created on first access)

---

### PUT /api/user/profile
Update the current user's profile information.

#### Request
```typescript
PUT /api/user/profile
Content-Type: application/json

{
  "display_name": "John Smith",
  "bio": "Updated bio text",
  "website_url": "https://johnsmith.com",
  "location": "New York, NY",
  "timezone": "America/New_York",
  "profile_visibility": {
    "show_name_on_public_resumes": true,
    "allow_email_discovery": true,
    "show_profile_in_sharing": false
  }
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    // Updated profile object
  }
}
```

#### Error Responses
- `400 Bad Request`: Invalid data format
- `401 Unauthorized`: User not authenticated
- `422 Unprocessable Entity`: Validation errors

---

### POST /api/user/profile/avatar
Upload or update user avatar.

#### Request
```typescript
POST /api/user/profile/avatar
Content-Type: multipart/form-data

{
  "avatar": File // Image file (max 5MB, PNG/JPG/WEBP)
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "avatar_url": "https://storage.supabase.co/bucket/avatars/user123-new.jpg",
    "file_size": 1024768,
    "uploaded_at": "2024-01-20T15:30:00Z"
  }
}
```

#### Error Responses
- `400 Bad Request`: Invalid file format or size
- `401 Unauthorized`: User not authenticated
- `413 Payload Too Large`: File exceeds size limit

---

### DELETE /api/user/profile/avatar
Delete user avatar.

#### Request
```typescript
DELETE /api/user/profile/avatar
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "message": "Avatar deleted successfully"
  }
}
```

## User Preferences Endpoints

### GET /api/user/preferences
Get user preferences and settings.

#### Request
```typescript
GET /api/user/preferences
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "456e7890-e89b-12d3-a456-426614174000",
    "theme": "dark",
    "language": "en",
    "timezone": "America/Los_Angeles",
    "default_resume_privacy": false,
    "default_resume_colors": {
      "primary": "#0ea5e9",
      "secondary": "#64748b",
      "accent": "#8dd0ca",
      "background": "#ffffff",
      "text": "#1f2937"
    },
    "notification_preferences": {
      "email_notifications": true,
      "marketing_emails": false,
      "security_alerts": true,
      "product_updates": true,
      "weekly_digest": false
    },
    "privacy_settings": {
      "analytics_tracking": true,
      "usage_data": true,
      "crash_reports": true,
      "feature_announcements": true
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  }
}
```

---

### PUT /api/user/preferences
Update user preferences.

#### Request
```typescript
PUT /api/user/preferences
Content-Type: application/json

{
  "theme": "light",
  "language": "en",
  "timezone": "America/New_York",
  "default_resume_privacy": true,
  "default_resume_colors": {
    "primary": "#3b82f6",
    "secondary": "#6b7280",
    "accent": "#10b981",
    "background": "#f9fafb",
    "text": "#111827"
  },
  "notification_preferences": {
    "email_notifications": false,
    "marketing_emails": false,
    "security_alerts": true,
    "product_updates": false,
    "weekly_digest": true
  },
  "privacy_settings": {
    "analytics_tracking": false,
    "usage_data": true,
    "crash_reports": true,
    "feature_announcements": false
  }
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    // Updated preferences object
  }
}
```

## Authentication & Security Endpoints

### POST /api/auth/reset-password
Initiate password reset process.

#### Request
```typescript
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "message": "Password reset email sent if account exists",
    "email": "user@example.com"
  }
}
```

#### Error Responses
- `400 Bad Request`: Invalid email format
- `429 Too Many Requests`: Rate limit exceeded

---

### POST /api/auth/confirm-password-reset
Confirm password reset with token.

#### Request
```typescript
POST /api/auth/confirm-password-reset
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "newSecurePassword123!",
  "confirm_password": "newSecurePassword123!"
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

#### Error Responses
- `400 Bad Request`: Invalid token or password mismatch
- `422 Unprocessable Entity`: Password doesn't meet requirements

---

### POST /api/auth/change-password
Change password for authenticated user.

#### Request
```typescript
POST /api/auth/change-password
Content-Type: application/json

{
  "current_password": "oldPassword123!",
  "new_password": "newSecurePassword123!",
  "confirm_password": "newSecurePassword123!"
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

#### Error Responses
- `400 Bad Request`: Invalid current password
- `401 Unauthorized`: User not authenticated
- `422 Unprocessable Entity`: Password validation errors

## User Activity Endpoints

### GET /api/user/activity
Get user activity log.

#### Request
```typescript
GET /api/user/activity?page=1&limit=20&action=login
```

#### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `action`: Filter by action type (optional)
- `from_date`: Start date filter (ISO 8601)
- `to_date`: End date filter (ISO 8601)

#### Response
```typescript
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "action": "login",
      "resource_type": null,
      "resource_id": null,
      "metadata": {
        "device": "Chrome on Mac",
        "success": true
      },
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
      "location_data": {
        "country": "US",
        "city": "San Francisco"
      },
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "pages": 8
    }
  }
}
```

### POST /api/user/activity
Log user activity (internal use).

#### Request
```typescript
POST /api/user/activity
Content-Type: application/json

{
  "action": "resume_created",
  "resource_type": "resume",
  "resource_id": "789e0123-e89b-12d3-a456-426614174000",
  "metadata": {
    "title": "Software Engineer Resume",
    "method": "ai_parsed"
  }
}
```

## Session Management Endpoints

### GET /api/user/sessions
Get active user sessions.

#### Request
```typescript
GET /api/user/sessions
```

#### Response
```typescript
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "device_info": {
        "browser": "Chrome",
        "os": "macOS",
        "device_type": "desktop"
      },
      "ip_address": "192.168.1.100",
      "location_data": {
        "country": "US",
        "city": "San Francisco"
      },
      "is_active": true,
      "last_accessed": "2024-01-20T15:30:00Z",
      "expires_at": "2024-02-20T15:30:00Z",
      "created_at": "2024-01-20T10:30:00Z",
      "is_current": true
    }
  ]
}
```

---

### DELETE /api/user/sessions/[id]
Revoke a specific session.

#### Request
```typescript
DELETE /api/user/sessions/123e4567-e89b-12d3-a456-426614174000
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "message": "Session revoked successfully"
  }
}
```

---

### DELETE /api/user/sessions
Revoke all sessions except current.

#### Request
```typescript
DELETE /api/user/sessions
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "message": "All other sessions revoked successfully",
    "revoked_count": 3
  }
}
```

## Account Management Endpoints

### POST /api/user/delete-account
Request account deletion.

#### Request
```typescript
POST /api/user/delete-account
Content-Type: application/json

{
  "password": "currentPassword123!",
  "reason": "No longer need the service",
  "immediate": false
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "message": "Account deletion scheduled",
    "scheduled_for": "2024-02-01T10:30:00Z",
    "recovery_token": "recovery_token_here",
    "recovery_url": "https://yourdomain.com/recover-account?token=recovery_token_here"
  }
}
```

---

### POST /api/user/cancel-deletion
Cancel account deletion.

#### Request
```typescript
POST /api/user/cancel-deletion
Content-Type: application/json

{
  "recovery_token": "recovery_token_here"
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "message": "Account deletion cancelled successfully"
  }
}
```

## Data Export Endpoints

### POST /api/user/export-data
Request data export.

#### Request
```typescript
POST /api/user/export-data
Content-Type: application/json

{
  "export_type": "full_data", // "full_data" | "resumes_only" | "profile_only"
  "format": "json" // "json" | "csv" (future)
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "export_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "pending",
    "estimated_completion": "2024-01-20T16:00:00Z",
    "expires_at": "2024-01-27T16:00:00Z"
  }
}
```

---

### GET /api/user/export-data/[id]
Get export status and download link.

#### Request
```typescript
GET /api/user/export-data/123e4567-e89b-12d3-a456-426614174000
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "export_type": "full_data",
    "status": "completed",
    "file_url": "https://storage.supabase.co/exports/user123-export.json",
    "file_size_bytes": 1024768,
    "requested_at": "2024-01-20T15:30:00Z",
    "completed_at": "2024-01-20T15:45:00Z",
    "expires_at": "2024-01-27T15:45:00Z",
    "download_count": 1
  }
}
```

---

### GET /api/user/export-data
List all export requests.

#### Request
```typescript
GET /api/user/export-data
```

#### Response
```typescript
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "export_type": "full_data",
      "status": "completed",
      "requested_at": "2024-01-20T15:30:00Z",
      "completed_at": "2024-01-20T15:45:00Z",
      "expires_at": "2024-01-27T15:45:00Z",
      "download_count": 1
    }
  ]
}
```

## Analytics Endpoints

### GET /api/user/analytics
Get user analytics dashboard data.

#### Request
```typescript
GET /api/user/analytics?period=30d
```

#### Query Parameters
- `period`: Time period (7d, 30d, 90d, 1y)

#### Response
```typescript
{
  "success": true,
  "data": {
    "summary": {
      "total_resumes": 12,
      "public_resumes": 3,
      "total_views": 1234,
      "total_downloads": 456,
      "account_age_days": 45
    },
    "resume_performance": [
      {
        "resume_id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Software Engineer Resume",
        "views": 234,
        "downloads": 45,
        "last_viewed": "2024-01-20T10:30:00Z"
      }
    ],
    "activity_timeline": [
      {
        "date": "2024-01-20",
        "resumes_created": 1,
        "views": 23,
        "downloads": 5
      }
    ]
  }
}
```

## Error Handling

### Standard Error Codes
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Response Format
```typescript
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

## Rate Limiting

### Rate Limits
- Authentication endpoints: 5 requests per minute
- Profile updates: 10 requests per minute
- Data exports: 1 request per hour
- General endpoints: 60 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### File Upload Requirements
- Avatar images: Max 5MB, PNG/JPG/WEBP
- Supported formats: image/png, image/jpeg, image/webp
- Automatic resize to 400x400px

### Input Validation
- Email: Valid email format
- URLs: Valid HTTP/HTTPS URLs
- Timezone: Valid IANA timezone
- Theme: One of 'light', 'dark', 'system'

## Security Considerations

### Authentication
- All endpoints require valid Supabase session
- Session tokens expire after 1 hour
- Refresh tokens expire after 30 days

### Data Protection
- All sensitive data encrypted in transit
- Personal data anonymized in logs
- Rate limiting prevents abuse
- Input validation prevents injection attacks

### CORS Configuration
```typescript
{
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## Implementation Guidelines

### API Route Structure
```
app/api/
├── user/
│   ├── profile/
│   │   ├── route.ts
│   │   └── avatar/
│   │       └── route.ts
│   ├── preferences/
│   │   └── route.ts
│   ├── activity/
│   │   └── route.ts
│   ├── sessions/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── delete-account/
│   │   └── route.ts
│   ├── export-data/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   └── analytics/
│       └── route.ts
└── auth/
    ├── reset-password/
    │   └── route.ts
    ├── confirm-password-reset/
    │   └── route.ts
    └── change-password/
        └── route.ts
```

### Response Helper Functions
```typescript
// lib/api-helpers.ts
export function successResponse<T>(data: T, meta?: any) {
  return Response.json({ success: true, data, meta });
}

export function errorResponse(message: string, code: string, status: number) {
  return Response.json(
    { success: false, error: { message, code } },
    { status }
  );
}
```

## Testing

### Unit Tests
- Test each endpoint with valid/invalid inputs
- Test authentication and authorization
- Test rate limiting
- Test error handling

### Integration Tests
- Test complete user flows
- Test data consistency
- Test file upload/download
- Test email notifications

### Load Testing
- Test rate limiting effectiveness
- Test database performance
- Test file storage performance
- Test concurrent user scenarios

## Next Steps

1. **Implement Core Endpoints**: Start with profile and preferences
2. **Add Authentication**: Implement password reset and change
3. **Build Security Features**: Add activity logging and session management
4. **Implement Account Management**: Add deletion and export features
5. **Add Analytics**: Implement user analytics dashboard
6. **Test Thoroughly**: Comprehensive testing of all endpoints
7. **Monitor Performance**: Set up monitoring and alerting

See [Implementation Plan](./05-implementation-plan.md) for detailed development phases.