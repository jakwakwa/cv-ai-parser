# Figma API Tokens & Permissions Guide

## Overview

This document provides comprehensive guidance on managing Figma API tokens for both use cases in our MCP Figma integration. **Each use case requires a different token strategy** for optimal security, performance, and user experience.

## Use Case Comparison: API Key Strategies

| Aspect | Use Case 1: Developer Workflow | Use Case 2: User Upload Feature |
|--------|--------------------------------|----------------------------------|
| **Token Type** | Personal Developer Tokens | Service/Application Token |
| **Scope** | Individual developer access | Application-wide access |
| **Location** | Local development environment | Server-side only |
| **Rate Limits** | Per developer (1000/hour) | Shared across all users |
| **Security** | Developer responsibility | Application responsibility |
| **Cost** | Free (personal use) | May require Figma organization plan |

## Use Case 1: Developer Workflow Enhancement

### Token Strategy: Personal Developer Tokens

For the developer workflow enhancement, **each developer should use their own personal Figma API token**. This approach offers several advantages:

#### Benefits
- **Individual Rate Limits**: Each developer gets their own 1000 requests/hour
- **Personal Access**: Developers can access their own private files
- **No Shared Dependencies**: No single point of failure
- **Zero Cost**: Uses personal Figma accounts

#### Setup Process

1. **Each Developer Creates Their Own Token**
   ```bash
   # Each developer follows this process individually
   # Visit: https://www.figma.com/settings
   # Navigate to: Account → Personal access tokens
   # Create token with name: "MCP Development - [Developer Name]"
   ```

2. **Local Environment Configuration**
   ```bash
   # Each developer adds to their local .env.local
   FIGMA_API_KEY=figd_[their_personal_token]
   ```

3. **MCP Server Configuration**
   ```json
   {
     "mcpServers": {
       "Framelink Figma MCP": {
         "command": "npx",
         "args": [
           "-y",
           "figma-developer-mcp",
           "--figma-api-key=${FIGMA_API_KEY}",
           "--stdio"
         ]
       }
     }
   }
   ```

#### Required Permissions
Personal tokens automatically have access to:
- ✅ **File Read Access**: View file metadata and structure
- ✅ **Node Access**: Read specific design elements
- ✅ **Export Access**: Generate images from designs
- ✅ **Personal Files**: Access own private files
- ✅ **Team Files**: Access shared team files (if team member)

#### Security Guidelines for Developers
```bash
# ✅ DO: Store in local environment files
echo "FIGMA_API_KEY=figd_xyz..." >> .env.local

# ✅ DO: Add to .gitignore
echo ".env.local" >> .gitignore

# ❌ DON'T: Commit tokens to version control
# ❌ DON'T: Share tokens between developers
# ❌ DON'T: Use in production builds
```

## Use Case 2: User Upload Feature

### Token Strategy: Dedicated Service Token

For the user-facing upload feature, we need a **dedicated application/service token** that handles all user requests server-side.

#### Benefits
- **Centralized Management**: Single token to manage and rotate
- **Server-Side Security**: Token never exposed to client
- **Consistent Access**: Uniform file access policies
- **Monitoring**: Centralized rate limit and usage tracking

#### Setup Process

1. **Create Dedicated Figma Account** (Recommended)
   ```
   Email: figma-service@[your-domain].com
   Purpose: Dedicated service account for API access
   Plan: Consider Figma Organization plan for higher limits
   ```

2. **Generate Service Token**
   ```
   Token Name: "Resume Parser Service - Production"
   Scope: Full API access
   Expiration: 90 days (set calendar reminder for rotation)
   ```

3. **Production Environment Configuration**
   ```bash
   # Production environment variables
   FIGMA_API_KEY=figd_[service_token]
   FIGMA_SERVICE_ACCOUNT_EMAIL=figma-service@yourdomain.com
   ```

#### Required Permissions & Limitations

**✅ What the Service Token Can Access:**
- Public Figma files (shared via public URL)
- Files explicitly shared with the service account
- Community files and templates

**❌ What the Service Token Cannot Access:**
- Private user files (unless explicitly shared)
- Team files from organizations not including the service account
- Draft files marked as private

**Important:** Users must ensure their resume designs are publicly accessible or shared with appropriate permissions.

#### Enhanced Security Configuration

```typescript
// lib/figma-service-config.ts
export const FigmaServiceConfig = {
  // Use different tokens for different environments
  apiKey: process.env.NODE_ENV === 'production' 
    ? process.env.FIGMA_PRODUCTION_API_KEY
    : process.env.FIGMA_STAGING_API_KEY,
  
  // Service account identifier
  serviceAccount: process.env.FIGMA_SERVICE_ACCOUNT_EMAIL,
  
  // Rate limiting for production
  rateLimits: {
    requestsPerHour: 800, // Conservative limit for shared usage
    requestsPerUser: 10,  // Per-user rate limiting
    burstLimit: 50       // Short-term burst allowance
  },
  
  // Security settings
  security: {
    requireHttps: true,
    validateFileAccess: true,
    logAllRequests: true,
    enableRequestSigning: true
  }
};
```

## API Token Permissions & Scopes

### Understanding Figma API Permissions

Figma API tokens have **implicit permissions** based on the account that created them:

#### File Access Levels
```
🟢 Public Files
├── Community templates
├── Files shared via public link
└── Published libraries

🟡 Shared Files  
├── Files shared with token owner
├── Team files (if team member)
└── Organization files (if org member)

🔴 Private Files
├── Personal drafts
├── Private team files
└── Restricted organization files
```

#### API Capabilities
```
📖 Read Operations (All tokens)
├── File metadata and structure
├── Node properties and styling
├── Component definitions
├── Variable collections
└── Comment data

🖼️ Export Operations (All tokens)
├── Image generation
├── PDF export
├── SVG export
└── Thumbnail creation

❌ Write Operations (Not supported)
├── File modifications
├── Comment creation
├── Version control
└── Team management
```

### Token Validation & Testing

#### Validate Token Access
```typescript
// lib/figma-token-validator.ts
export class FigmaTokenValidator {
  static async validateToken(apiKey: string): Promise<{
    isValid: boolean;
    permissions: string[];
    rateLimit: {
      remaining: number;
      resetTime: number;
    };
    user?: {
      id: string;
      email: string;
      handle: string;
    };
  }> {
    try {
      const response = await fetch('https://api.figma.com/v1/me', {
        headers: { 'X-Figma-Token': apiKey }
      });

      if (!response.ok) {
        return { isValid: false, permissions: [], rateLimit: { remaining: 0, resetTime: 0 } };
      }

      const userData = await response.json();
      
      return {
        isValid: true,
        permissions: ['read', 'export'], // Figma tokens have read/export by default
        rateLimit: {
          remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '1000'),
          resetTime: parseInt(response.headers.get('X-RateLimit-Reset') || '0')
        },
        user: {
          id: userData.id,
          email: userData.email,
          handle: userData.handle
        }
      };
    } catch (error) {
      return { isValid: false, permissions: [], rateLimit: { remaining: 0, resetTime: 0 } };
    }
  }

  static async validateFileAccess(apiKey: string, fileId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
        headers: { 'X-Figma-Token': apiKey }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

## Token Management Best Practices

### Development Environment

#### Team Setup Checklist
```bash
# 1. Each developer creates personal token
echo "✅ Personal Figma API token created"

# 2. Configure local environment
echo "FIGMA_API_KEY=figd_..." >> .env.local
echo "✅ Local environment configured"

# 3. Test MCP connection
# In Cursor: "Test Figma MCP connection"
echo "✅ MCP server working"

# 4. Verify .gitignore
grep -q ".env.local" .gitignore && echo "✅ Token security verified"
```

#### Developer Token Rotation
```bash
# Quarterly token rotation process
# 1. Create new token in Figma settings
# 2. Update local .env.local
# 3. Test MCP functionality
# 4. Revoke old token
# 5. Update team documentation
```

### Production Environment

#### Service Token Management
```typescript
// Token rotation automation
export class TokenRotationService {
  static async rotateToken(): Promise<void> {
    // 1. Generate new token (manual process)
    // 2. Update environment variables
    // 3. Test new token functionality
    // 4. Revoke old token
    // 5. Log rotation event
    console.log(`Token rotated at ${new Date().toISOString()}`);
  }

  static async checkTokenExpiry(): Promise<boolean> {
    const response = await fetch('https://api.figma.com/v1/me', {
      headers: { 'X-Figma-Token': process.env.FIGMA_API_KEY! }
    });
    
    return response.ok;
  }
}
```

#### Production Security Checklist
```bash
# ✅ Environment Security
- [ ] API key stored in secure environment variables
- [ ] No API keys in source code or logs
- [ ] HTTPS-only API communications
- [ ] Request logging enabled
- [ ] Rate limiting implemented

# ✅ Access Control
- [ ] Service account with minimal necessary permissions
- [ ] Regular token rotation schedule (every 90 days)
- [ ] Token expiry monitoring and alerts
- [ ] Backup authentication methods ready

# ✅ Monitoring
- [ ] API usage tracking
- [ ] Error rate monitoring
- [ ] Rate limit monitoring
- [ ] Security event logging
```

## Rate Limiting & Usage Management

### Use Case 1: Developer Workflow
```
Individual Rate Limits per Developer:
├── 1000 requests/hour per personal token
├── Burst capacity: ~100 requests/minute
├── Reset: Every hour
└── Multiple developers = multiplied capacity
```

### Use Case 2: User Upload Feature
```
Shared Rate Limits for Application:
├── 1000 requests/hour per service token
├── Users per hour: ~100-200 (depending on complexity)
├── Peak capacity planning needed
└── Consider multiple tokens for scaling
```

#### Rate Limit Management Strategy
```typescript
// lib/rate-limit-strategy.ts
export class RateLimitStrategy {
  // For production: Implement request queuing
  static async queueRequest(fileId: string): Promise<void> {
    // Add to queue if near rate limit
    // Process in order of priority
    // Return cached results when possible
  }

  // For high-volume: Multiple service tokens
  static async loadBalanceTokens(): Promise<string> {
    const tokens = [
      process.env.FIGMA_API_KEY_1,
      process.env.FIGMA_API_KEY_2,
      process.env.FIGMA_API_KEY_3
    ].filter(Boolean);

    // Return token with lowest current usage
    return tokens[0]!; // Simplified
  }
}
```

## Troubleshooting Common Issues

### Token-Related Errors

#### 1. "Invalid API Token" (401)
```bash
# Causes:
- Expired token
- Revoked token
- Incorrectly copied token

# Solutions:
- Generate new token
- Verify token format (starts with 'figd_')
- Check token expiration date
```

#### 2. "Forbidden" (403)
```bash
# Causes:
- Private file access attempt
- Team/organization permissions
- Service account not added to team

# Solutions:
- Ensure file is publicly accessible
- Share file with service account
- Check team membership
```

#### 3. "Rate Limit Exceeded" (429)
```bash
# Causes:
- Exceeded 1000 requests/hour
- Too many concurrent requests
- Shared token overuse

# Solutions:
- Implement request caching
- Add request queuing
- Use multiple service tokens
```

### Testing Token Setup

#### Development Testing
```bash
# Test personal token
curl -H "X-Figma-Token: $FIGMA_API_KEY" \
  https://api.figma.com/v1/me

# Test file access
curl -H "X-Figma-Token: $FIGMA_API_KEY" \
  https://api.figma.com/v1/files/FILE_ID
```

#### Production Testing
```typescript
// Automated token health checks
export async function runTokenHealthCheck(): Promise<void> {
  const results = await Promise.all([
    FigmaTokenValidator.validateToken(process.env.FIGMA_API_KEY!),
    FigmaTokenValidator.validateFileAccess(process.env.FIGMA_API_KEY!, 'test-file-id')
  ]);

  console.log('Token Health Check Results:', results);
}
```

## Summary & Recommendations

### For Use Case 1 (Developer Workflow)
- ✅ **Use personal developer tokens**
- ✅ **Each developer manages their own token**
- ✅ **Store in local .env.local files**
- ✅ **Never commit to version control**

### For Use Case 2 (User Upload Feature)
- ✅ **Use dedicated service account token**
- ✅ **Store server-side in production environment**
- ✅ **Implement rate limiting and caching**
- ✅ **Plan for token rotation every 90 days**

### Security Best Practices
- 🔐 **Never expose tokens client-side**
- 🔐 **Implement proper token rotation**
- 🔐 **Monitor usage and errors**
- 🔐 **Use HTTPS for all API calls**

This dual-token strategy ensures optimal security, performance, and user experience for both use cases while maintaining proper separation of concerns.