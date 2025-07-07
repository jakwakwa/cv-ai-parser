import * as React from 'react';
import { cn } from '@/lib/utils';
import styles from './input.module.css';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    const isFile = type === 'file';
    const inputClasses = cn(
      styles.input,
      isFile && styles.inputFile,
      className
    );

    return <input type={type} className={inputClasses} ref={ref} {...props} />;
  }
);
Input.displayName = 'Input';

export { Input };
