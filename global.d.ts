declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Stub for an optional dependency used by @supabase/auth-js
declare module '@solana/wallet-standard-features' {
  export interface SolanaSignInInput {
    account?: string;
    chain?: string;
    nonce?: string;
    issuedAt?: string;
    expirationTime?: string;
    statement?: string;
  }

  export interface SolanaSignInOutput {
    signature: string;
  }
}

// React 19 removed the deprecated `ReactSVG` type that some libraries (e.g. lucide-react) still reference.
// Provide a backward-compat alias via module augmentation **without** overriding React's existing declarations.
import type * as React from 'react';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface ReactSVG extends SVGSVGElement {}
}