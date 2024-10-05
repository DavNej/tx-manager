import { desc } from 'drizzle-orm'
import { db } from './db'
import {
  type CreateTransaction,
  type SelectTransaction,
  transactionsTable,
} from './schema'

/**
 * Create a new transaction
 * @param transactionData Transaction data
 * @returns Promise that resolves to the inserted transaction
 */
export function createTransaction(transactionData: CreateTransaction) {
  return db.insert(transactionsTable).values(transactionData)
}

/**
 * Get all transactions in descending order of creation
 * @returns Promise that resolves to an array of transactions
 */
export async function getTransactions(): Promise<SelectTransaction[]> {
  return db
    .select()
    .from(transactionsTable)
    .orderBy(desc(transactionsTable.createdAt))
}

