import logger from './logger'

type ApiError = {
  message: string
  cause: unknown
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string

if (!baseUrl) {
  throw new Error('BASE_URL is not set')
}

const headers = {
  'Content-Type': 'application/json',
}

async function GET<T>(url: string): Promise<T> {
  const response = await fetch(new URL(url, baseUrl), {
    method: 'GET',
    headers,
  })

  let responseBody: T

  try {
    responseBody = await response.json()
  } catch (error) {
    const message = `GET ${url} : Failed to parse response JSON`
    logger.error({ message, error })
    throw new Error(message)
  }

  if (!response.ok) {
    const { message, cause } = responseBody as ApiError
    logger.error({ message, error: cause })
    throw new Error(message, { cause })
  }

  return responseBody
}

async function POST<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await fetch(new URL(url, baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  let responseBody: T

  try {
    responseBody = await response.json()
  } catch (error) {
    const message = `POST ${url} : Failed to parse response JSON`
    logger.error({ message, error })
    throw new Error(message)
  }

  if (!response.ok) {
    const { message, cause } = responseBody as ApiError
    logger.error({ message, error: cause })
    throw new Error(message, { cause })
  }

  return responseBody
}

async function PUT<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await fetch(new URL(url, baseUrl), {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })

  let responseBody: T

  try {
    responseBody = await response.json()
  } catch (error) {
    const message = `POST ${url} : Failed to parse response JSON`
    logger.error({ message, error })
    throw new Error(message)
  }

  if (!response.ok) {
    const { message, cause } = responseBody as ApiError
    logger.error({ message, error: cause })
    throw new Error(message, { cause })
  }

  return responseBody
}

export const api = {
  GET,
  POST,
  PUT,
}

export default api
