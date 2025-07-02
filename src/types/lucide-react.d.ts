declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
  }

  export type LucideIcon = React.FC<LucideProps>;

  export const Camera: LucideIcon;
  export const Check: LucideIcon;
  export const Upload: LucideIcon;
  export const User: LucideIcon;
  export const X: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const ImageIcon: LucideIcon;
  export const Palette: LucideIcon;

  // Allow importing any other icon by name.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons: Record<string, LucideIcon>;
  export default icons;
}