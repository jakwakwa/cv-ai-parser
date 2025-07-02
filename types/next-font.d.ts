declare module 'next/font/google' {
  export type FontOptions = {
    subsets: string[];
    weight?: string[];
    variable?: string;
    display?: string;
  };
  export function DM_Sans(options: FontOptions): { style: { fontFamily: string }; className: string; variable?: string };
  export function DM_Mono(options: FontOptions): { style: { fontFamily: string }; className: string; variable?: string };
}