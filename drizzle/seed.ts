import { generateRandomEvmAddress } from '@/lib/utils'
import { db } from './db'
import {
  type CreateTransaction,
  transactionStatusEnum,
  transactionsTable,
} from './schema'

/**
 * Get a random status from the transactionStatusEnum
 * @returns Random transaction status
 */
function getRandomStatus() {
  const randomIndex = Math.floor(
    Math.random() * transactionStatusEnum.enumValues.length
  )
  return transactionStatusEnum.enumValues[randomIndex]
}

/**
 * Generate a random transaction
 * @returns Random transaction
 */
function generateRandomTransaction(): CreateTransaction {
  return {
    amount: (Math.random() * 1000).toFixed(2),
    senderWallet: generateRandomEvmAddress(),
    receiverWallet: generateRandomEvmAddress(),
    status: getRandomStatus(),
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
  return db.insert(transactionsTable).values(transactionsData)
}
