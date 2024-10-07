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
