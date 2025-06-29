import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '@/lib/utils';
import styles from './button.module.css';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const buttonClasses = cn(
      styles.button,
      styles[variant],
      styles[size],
      className
    );

    return <Comp className={buttonClasses} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button };
