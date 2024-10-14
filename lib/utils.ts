import { type ClassValue, clsx } from 'clsx'
import { randomBytes } from 'crypto'
import { twMerge } from 'tailwind-merge'

/**
 * Shadcn classes utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a random EVM address
 * @returns Random EVM address
 */
export function generateRandomEvmAddress() {
  const randomValue = randomBytes(20)
  const address = randomValue.toString('hex')
  return `0x${address}`
}
