// lib/utils.ts

/**
 * Simple className merger utility.
 * Joins all truthy class strings (similar to clsx).
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}
