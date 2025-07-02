import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names
 * Simplified version without tailwind-merge since we're using CSS modules
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .substring(0, 50) // Limit length
    .replace(/^-+|-+$/g, ''); // Trim - from start and end
}
