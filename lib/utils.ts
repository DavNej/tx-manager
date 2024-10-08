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

/**
 * Get the cause for an unknown error
 * @param error Error object
 * @returns Error cause
 */
export function getErrorCause(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Unknown error please check logs'
}
