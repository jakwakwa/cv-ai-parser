# Current Authentication State

_Last updated: 2025-07-07_

## Technology Stack

- **Supabase** for authentication, authorization, and Postgres DB (RLS).
- **@supabase/ssr** helper libraries for client/server SDK instantiation
- React context provider `AuthProvider` (`src/components/auth-provider/auth-provider.tsx`) wraps the application and exposes:
  - `signIn(email, password)`
  - `signUp(email, password, fullName)`
  - `signOut()`
  - `user`, `loading`, `supabase` client instance.
- Minimal UI in `src/components/auth-component/AuthComponent.tsx` supporting Email/Password sign-in & sign-up.
- Server-side API routes call `supabase.auth.getUser()` to gate access.  
  Example: `app/api/parse-resume/route.ts`

## Features already available to an authenticated user

1. Create account with **email + password**
2. Sign-in / Sign-out
3. Persisted session via Supabase cookies (`/lib/supabase/middleware.ts`)
4. CRUD on personal resumes  
   • Save / Edit / Delete  
   • Toggle public ↔ private  
   • Generate share links
5. Full-name metadata captured at sign-up (`full_name`)

## Observed Gaps & Limitations

| Category | Gap | Impact |
|----------|-----|--------|
| Account management | No dedicated **/account** or **/settings** UI | Users cannot self-serve updates |
| Email & Password | • Cannot change email  <br/>• No password change/reset flow | Support burden, security risk |
| Security | • No 2-Factor Auth  <br/>• No session/device management | Modern SaaS expectation |
| Privacy / Compliance | • No account deletion (GDPR/CCPA) <br/>• No data export | Legal risk |
| Profile | • No avatar upload <br/>• Only `full_name` stored | Poor personalisation |
| Communication | • Email verification status not surfaced <br/>• No resend verification link | Confusing onboarding |
| Social Login | Not implemented | Friction for users unwilling to create yet another password |

This document serves as input for the feature roadmap defined in subsequent files.