/**
 * Get the reason for an unknown error
 * @param error Error object
 * @returns Error reason
 */
export function getErrorReason(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Unknown error please check logs'
}
