import * as Sentry from '@sentry/nextjs'
import { ZodError } from 'zod'

export function logError(error: unknown): void {
  const errorDef =
    error instanceof Error
      ? `${error.name}: ${error.message}`
      : 'Unexpected Error ❓❓❓'

  console.error(`💥💥💥 ${new Date().toISOString()} | ${errorDef}`)
  console.error('---')
  console.error(error)
  console.error('---')

  Sentry.captureException(error)
}

export class DatabaseError extends Error {
  data: unknown
  constructor(message: string, data?: unknown) {
    super(message)
    this.name = 'DatabaseError'
    this.data = data

    if (data) {
      this.message = `${message} | ${JSON.stringify(data)}`
    }
  }
}

export class ApiError extends Error {
  details: unknown
  constructor(message: string, details: unknown) {
    super(message)
    this.name = 'ApiError'
    this.details = details
  }
}

export class WorkerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WorkerError'
  }
}

export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isWorkerError(error: unknown): error is WorkerError {
  return error instanceof WorkerError
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError
}

export function handleDatabaseError(
  error: unknown,
  message?: string,
  data?: unknown
): DatabaseError {
  logError(error)
  return new DatabaseError(
    message || 'An error occurred while interacting with the database',
    data
  )
}

export function handleApiError(
  error: unknown,
  message?: string,
  details?: unknown
): ApiError {
  logError(error)
  return new ApiError(
    message || 'An error occurred while interacting with the api',
    details
  )
}

export function handleWorkerError(
  error: unknown,
  message?: string
): WorkerError {
  logError(error)
  return new WorkerError(message || 'An error occurred while processing a job')
}

export function handleUnexpectedError(error: unknown) {
  if (
    isDatabaseError(error) ||
    isZodError(error) ||
    isApiError(error) ||
    isWorkerError(error)
  ) {
    return
  }
  logError(error)
  return error
}
