import { handleDatabaseError } from '@/server/error-service'
import { generateRandomEvmAddress } from '@/lib/utils'
import { db } from './db'
import {
  type InsertTransaction,
  transactionStatusEnum,
  transactionsTable,
} from './schema'

/**
 * Get a random status from the transactionStatusEnum
 * @returns Random transaction status (except 'pending')
 */
function getRandomStatus() {
  const randomIndex = Math.floor(
    Math.random() * (transactionStatusEnum.enumValues.length - 1) + 1
  )
  return transactionStatusEnum.enumValues[randomIndex]
}

/**
 * Generate a random date within the next 24 hours
 * @returns Random date within the next 24 hours
 */
function generateRandomDateWithinNext24Hours(): Date {
  const now = new Date()
  const randomTimeOffset = Math.floor(Math.random() * 24 * 60 * 60 * 1000)
  return new Date(now.getTime() + randomTimeOffset)
}

/**
 * Generate a random transaction
 * @returns Random transaction
 */
function generateRandomTransaction(): InsertTransaction {
  const status = getRandomStatus()

  return {
    amount: (Math.random() * 1000).toFixed(2),
    senderWallet: generateRandomEvmAddress(),
    receiverWallet: generateRandomEvmAddress(),
    status,
    scheduledFor:
      status === 'scheduled' ? generateRandomDateWithinNext24Hours() : null,
  }
}

/**
 * Seed the database with random transactions
 * @param count Number of transactions to seed
 * @returns Promise that resolves to the inserted transactions
 */
export function seedDatabase(count = 1) {
  const transactionsData = Array.from(
    { length: count },
    generateRandomTransaction
  )
  try {
    return db.insert(transactionsTable).values(transactionsData)
  } catch (error) {
    throw handleDatabaseError(
      error,
      'Failed to seed database',
      transactionsData
    )
  }
}
