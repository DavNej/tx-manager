import { handleApiError, logError } from '@/server/error-service'

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
    logError(error)
    throw new Error(`GET ${url} : Failed to parse response JSON`)
  }

  if (!response.ok) {
    throw handleApiError(responseBody)
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
    logError(error)
    throw new Error(`POST ${url} : Failed to parse response JSON`)
  }

  if (!response.ok) {
    throw handleApiError(responseBody)
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
    logError(error)
    throw new Error(`PUT ${url} : Failed to parse response JSON`)
  }

  if (!response.ok) {
    throw handleApiError(responseBody)
  }

  return responseBody
}

export const api = {
  GET,
  POST,
  PUT,
}

export default api
