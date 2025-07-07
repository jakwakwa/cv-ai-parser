# Implementation Plan – Auth & Account Enhancements

Created: 2025-07-07  
Maintainer: @team-auth

---

## Overview

We will deliver the new account experience in **three phases** to mitigate risk and allow incremental release:

1. Phase 1 – Foundation & Profile (MVP)  
2. Phase 2 – Security Hardening  
3. Phase 3 – Stretch Goals & Polish

Each phase is designed to be deployable and to preserve current functionality (no regressions).

---

## Phase 1 — Foundation & Profile (2 weeks)

### Back-End Tasks

| # | Task | Owner | Notes |
|---|------|-------|-------|
| 1 | **Database**: create `profiles` table (if not exists) with `avatar_url`, `full_name` (moved from auth metadata) | DBA | `id` PK references `auth.users.id`  |
| 2 | **RLS**: Enable row-level security, policy `users_can_manage_own_profile` | DBA | `auth.uid() = id` |
| 3 | **Edge Functions** *(supabase)*: `delete_user` – deletes user and cascades to resumes & storage | Backend | Uses service role |
| 4 | **REST/Next API Routes**:  `/app/api/account/` <br/> - `GET  route.ts` → returns profile & stats <br/> - `PATCH route.ts` → update name, avatar <br/> - `POST change-email.ts` <br/> - `POST change-password.ts` <br/> - `POST delete.ts` | Backend | Implement with `createClient()` (server) |
| 5 | **Email templates** (Resend) for verification, password reset, account deletion confirmation | DevRel | |

### Front-End Tasks

| # | Task | Component / File | Notes |
|---|------|------------------|-------|
| 1 | Add protected route `/account` under `app/account/page.tsx` | Next.js App Router, dynamic UI |
| 2 | Create reusable `AccountLayout` with sidebar nav | |
| 3 | Build **ProfileForm** component (CSS Modules) | autopopulate from `/api/account` |
| 4 | Implement avatar uploader using Supabase Storage & pre-signed URLs | |
| 5 | Integrate password reset request (opens email) | Use `supabase.auth.resetPasswordForEmail` |
| 6 | Implement delete account modal -> calls `/api/account/delete` | Show irreversibility warning |

### QA / Acceptance

- ✅ Email change triggers verification email from Supabase.
- ✅ User can change full name & avatar; changes are reflected on next refresh.
- ✅ Delete account removes DB row and associated resumes.
- ✅ No Tailwind introduced; all new styles in CSS Modules.

---

## Phase 2 — Security Hardening (1 week)

### Features

1. Two-Factor Authentication (TOTP)
2. Active Sessions list + revoke
3. Rate-limit sign-in attempts via Supabase Edge Function
4. Force email verification before allowing resume sharing

### Milestones

- Implement `auth.mfa.*` flows (Supabase beta feature) or custom TOTP table.
- Add `/api/account/sessions` endpoint.
- Add server middleware to reject unverified email on protected actions.

---

## Phase 3 — Stretch (Optional, 2 weeks)

- OAuth providers (Google, GitHub, LinkedIn)
- Data export job (generate ZIP of resumes + JSON)
- Marketing preferences with Supabase `public.user_preferences` table

---

## Rollback Strategy

- Feature flags via environment variables:  
  `PROFILE_PAGE_ENABLED`, `TWO_FACTOR_REQUIRED` etc.
- Database migrations wrapped in transactions.

---

## Monitoring & Metrics

- Track success/error rates of new API routes with open-telemetry
- Log password reset & delete account events

---

## Task Board (Jira)

A detailed task breakdown is available in the Jira epic `AUTH-1001`.  
This document will be kept in sync with ticket status.