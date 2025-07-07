# Target Authentication & Account Features

The following list defines the **minimum viable** and **stretch** capabilities required to deliver a modern, trustworthy account experience.

## 1. Core Account Settings (MVP)

- View profile details (email, full name, created date, number of resumes)
- Update profile fields:
  - Full name
  - Avatar image
- Change email address (with re-verification flow)
- Change password (requires current password)
- Password reset via emailed magic link (forgot password)
- Delete account (irreversible; cascades deletion of resumes & stored files)
- Resend email verification
- Display verification & subscription status banners

## 2. Security Enhancements (Phase 2)

- Two-Factor Authentication (TOTP & email fallback)
- List active sessions/devices; allow revocation
- Login history audit log
- Rate limiting & captchas on auth endpoints

## 3. Privacy & Data Portability

- Export user data (JSON + resume PDFs)
- Toggle marketing email preferences
- Privacy policy link & consent flags

## 4. Social & Enterprise Login (Stretch)

- OAuth providers: Google, GitHub, LinkedIn
- SAML / OIDC for enterprise customers

## 5. Resume-Specific Utilities

- Bulk privacy toggle
- Quick links to edit / duplicate / download resumes from account dashboard

All features will respect the project rules: no Tailwind, use CSS Modules, Supabase as auth provider, TypeScript, and existing naming conventions.