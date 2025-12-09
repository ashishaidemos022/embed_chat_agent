// src/lib/utils.ts

// Simple utility for merging classNames
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}