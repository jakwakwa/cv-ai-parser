'use client';

import { type ComponentType, lazy, Suspense } from 'react';

interface LazyWrapperProps<T = Record<string, unknown>> {
  fallback?: React.ReactNode;
  children?: React.ReactNode;
  component?: ComponentType<T>;
  componentProps?: T;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
  </div>
);

// Generic lazy wrapper for components
export function LazyWrapper<T = Record<string, unknown>>({ 
  fallback = <LoadingSpinner />, 
  children, 
  component: Component,
  componentProps 
}: LazyWrapperProps<T>) {
  return (
    <Suspense fallback={fallback}>
      {children}
      {Component && componentProps && <Component {...componentProps} />}
    </Suspense>
  );
}

// Lazy load heavy libraries
export const LazyPDFUploader = lazy(() => 
  import('./ResumeUploader/ResumeUploader').then(module => ({
    default: module.default
  }))
);

export const LazyColorPicker = lazy(() => 
  import('./color-picker/ColorPicker').then(module => ({
    default: module.default
  }))
);

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function WrappedComponent(props: T) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export default LazyWrapper;