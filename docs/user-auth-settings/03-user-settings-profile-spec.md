# User Settings & Profile Page — Functional Specification

Route: `/account` (protected, requires authentication)

## Page Anatomy

| Section | Description |
|---------|-------------|
| Header  | Page title, breadcrumb and optional 'Back to dashboard' link |
| Sidebar (desktop ≥768 px) | Vertical nav tabs: **Profile**, **Security**, **Privacy & Data**, **Resumes** |
| Content area | Renders form for selected tab |
| Toast region | Success & error notifications |

On mobile the sidebar collapses into a top `<Tabs />` component.

### 1. Profile Tab

| Field | Type | Notes |
|-------|------|-------|
| Email (read-only) | `input[type=email]` | Verification badge + "Change" CTA opens modal |
| Full name | text input | Editable |
| Avatar | image uploader (uses Supabase Storage `avatars/`) | Cropping 1:1 |
| Save button | Primary |

### 2. Security Tab

- Change Password form (current + new + confirm)
- Two-Factor Auth section
  - Activate / Disable TOTP
  - QR code + recovery codes
- Active Sessions list (device, IP, last used) with "Sign out" button

### 3. Privacy & Data Tab

- Export Data button (triggers background job, emails downloadable link)
- Delete Account destructive action (double confirmation + password re-entry)
- Marketing preferences checkboxes

### 4. Resumes Tab

Reuse `ResumeLibrary` component; adds bulk privacy toggle and delete.

## UX & Accessibility

- All forms use accessible labels & descriptions
- Keyboard-navigable
- Error messages inline, success via toast
- Confirm dialogs (`@radix-ui/react-alert-dialog`) for destructive actions
- Responsive: 1-column on ≤640 px

## Technical Notes

- Uses existing `useAuth()` for user context
- Data mutations via `/app/api/account/**` routes (see implementation plan)
- Styling: new CSS Modules co-located with each component (`account.module.css`, etc.)
- Animations: fade transitions with Framer Motion