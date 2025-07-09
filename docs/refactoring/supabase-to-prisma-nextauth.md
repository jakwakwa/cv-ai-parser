# Refactoring from Supabase to Prisma and NextAuth.js

## 1. Introduction

This document outlines the recent architectural refactoring of the application, moving from **Supabase** as a Backend-as-a-Service (BaaS) to a more modular, self-hosted approach using **Prisma** for the database ORM and **NextAuth.js** for authentication.

### 1.1. Motivation

The primary motivation for this refactor was to gain more control over the application's backend, improve developer experience, and adopt a more scalable and maintainable architecture. While Supabase provided a quick way to get started, a more decoupled approach was needed to support the project's long-term goals.

**Key Drivers:**

*   **Modularity:** Decoupling the database and authentication from a single provider allows for more flexibility and easier integration with other services.
*   **Type Safety:** Prisma's auto-generated TypeScript client provides superior, end-to-end type safety for all database queries.
*   **Developer Experience:** A more streamlined local development setup with Prisma's powerful tooling, including migrations and a local database studio.
*   **Scalability:** A flexible architecture that can be easily extended with new authentication providers (e.g., OAuth with Google or GitHub) or database features.

## 2. Database Migration to Prisma

The database has been migrated from Supabase's managed Postgres instance to a new database managed by **Prisma**. This involved a complete overhaul of the data access layer.

### 2.1. Prisma Schema

The source of truth for our database schema is now the `prisma/schema.prisma` file. This file defines all the models, their fields, and the relationships between them.

The schema has been updated to include the models required by NextAuth.js, in addition to our application-specific models.

**New and Updated Models:**

*   **`User`:** The `User` model has been updated to include fields required by NextAuth.js, such as `emailVerified` and `image`, and relations to the new `Account` and `Session` models.
*   **`Account`:** Stores information about user accounts linked via OAuth providers.
*   **`Session`:** Manages user sessions.
*   **`VerificationToken`:** Used for email verification and password resets.
*   **`Resume` & `ResumeVersion`:** These models remain largely the same but have been updated to use camelCase naming conventions for their fields.

### 2.2. Migrations

Database migrations are now handled by **Prisma Migrate**. The `prisma/migrations` directory contains the full history of schema changes. To apply new migrations, the `pnpm prisma migrate dev` command is used.

## 3. New Authentication System with NextAuth.js

Authentication is now powered by **NextAuth.js**, the industry standard for authentication in Next.js applications.

### 3.1. Authentication Flow

The authentication flow is handled by a dynamic API route at `app/api/auth/[...nextauth]/route.ts`. This route manages all authentication requests, including sign-in, sign-out, and session management.

We are currently using the **Credentials Provider** for email and password authentication. This provider validates user credentials against the `User` model in our database.

### 3.2. Session Management

Client-side session management is handled by the `SessionProvider` from `next-auth/react`, which is wrapped in our custom `AuthProvider` component. The `useSession` hook is now used throughout the application to access the user's session.

Server-side session management is handled by the `getServerSession` function, which can be used in API routes and server components to get the current session.

## 4. Component Refactoring: An Example

To illustrate the changes, let's look at how the `SiteHeader` component was refactored.

### 4.1. Before (with Supabase)

```tsx
// src/components/site-header/site-header.tsx (Old)
'use client';

import { useAuth } from '@/src/components/auth-provider/auth-provider';
import { UserNav } from '../user-nav/user-nav';
import { Button } from '../ui/ui-button/button';

export function SiteHeader() {
  const { user } = useAuth();

  return (
    <header>
      {user ? (
        <UserNav />
      ) : (
        <Button>Sign in</Button>
      )}
    </header>
  );
}
```

### 4.2. After (with NextAuth.js)

```tsx
// src/components/site-header/site-header.tsx (New)
'use client';

import { useSession } from 'next-auth/react';
import { UserNav } from '../user-nav/user-nav';
import { Button } from '../ui/ui-button/button';
import { useAuthModal } from '../auth-component/AuthModalContext';

export function SiteHeader() {
  const { data: session } = useSession();
  const { setAuthModalOpen } = useAuthModal();

  return (
    <header>
      {session?.user ? (
        <UserNav />
      ) : (
        <Button onClick={() => setAuthModalOpen(true)}>Sign in</Button>
      )}
    </header>
  );
}
```

As you can see, the `useAuth` hook has been replaced with the `useSession` hook, and the logic for displaying the `UserNav` or "Sign in" button is now based on the `session` object from NextAuth.js.

## 5. Benefits of the Refactor

This refactor brings several key benefits:

*   **Improved Modularity:** The application is no longer tightly coupled to a single BaaS provider.
*   **Enhanced Type Safety:** Prisma provides strong type safety for all database interactions.
*   **Greater Flexibility:** We can now easily add new authentication providers or switch database vendors if needed.
*   **Better Developer Experience:** Prisma's tooling and NextAuth.js's ecosystem make for a more pleasant and productive development process.

## 6. Next Steps and Considerations

*   **OAuth Providers:** We can now easily add OAuth providers like Google, GitHub, or Twitter to our authentication system.
*   **Environment Variables:** The `.env` file now requires a `NEXTAUTH_SECRET` for signing JWTs.
*   **`postinstall` Script:** A `postinstall` script has been added to `package.json` to automatically run `prisma generate` after every installation. This is a best practice to avoid caching issues on deployment platforms like Vercel. 