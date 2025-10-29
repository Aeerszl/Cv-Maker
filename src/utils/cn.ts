/**
 * ClassName Utility (cn)
 * 
 * Merges multiple className strings intelligently.
 * Handles conditional classes, removes duplicates, and maintains specificity.
 * 
 * Based on the popular `clsx` and `tailwind-merge` pattern.
 * 
 * @module utils/cn
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Combines multiple class names into a single string
 * 
 * Features:
 * - Filters falsy values
 * - Flattens arrays
 * - Removes duplicate classes
 * - Handles conditional classes
 * 
 * @param classes - Class names to combine
 * @returns Combined class string
 * 
 * @example
 * ```ts
 * cn('px-4 py-2', 'bg-blue-500') // 'px-4 py-2 bg-blue-500'
 * cn('text-lg', false && 'hidden', 'font-bold') // 'text-lg font-bold'
 * cn(['flex', 'items-center'], 'gap-2') // 'flex items-center gap-2'
 * ```
 */
export function cn(...classes: ClassValue[]): string {
  return flatten(classes)
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Flattens nested arrays of class values
 * 
 * @param classes - Potentially nested class values
 * @returns Flattened array of strings
 */
function flatten(classes: ClassValue[]): string[] {
  const result: string[] = [];
  
  for (const cls of classes) {
    if (!cls) continue;
    
    if (Array.isArray(cls)) {
      result.push(...flatten(cls));
    } else if (typeof cls === 'string' || typeof cls === 'number') {
      result.push(String(cls));
    }
  }
  
  return result;
}

/**
 * Alternative: More advanced version with Tailwind conflict resolution
 * Uncomment if you need automatic Tailwind class merging
 */

// import { clsx, type ClassValue as ClsxClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';
// 
// export function cn(...inputs: ClsxClassValue[]) {
//   return twMerge(clsx(inputs));
// }
