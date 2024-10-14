import { handleDatabaseError } from '@/server/error-service'
import { desc, eq } from 'drizzle-orm'
import { db } from './db'
import {
  type InsertTransaction,
  type SelectTransaction,
  transactionsTable,
} from './schema'

/**
 * Create a new transaction
 * @param transactionData Transaction data
 * @returns Promise that resolves to the inserted transaction
 */
export function insertTransaction(transactionData: InsertTransaction) {
  try {
    return db.insert(transactionsTable).values(transactionData)
  } catch (error) {
    throw handleDatabaseError(
      error,
      'Failed to insert transaction',
      transactionData
    )
  }
}

/**
 * Find all transactions in descending order of creation
 * @returns Promise that resolves to an array of transactions
 */
export function findTransactions(): Promise<SelectTransaction[]> {
  try {
    return db
      .select()
      .from(transactionsTable)
      .orderBy(desc(transactionsTable.createdAt))
  } catch (error) {
    throw handleDatabaseError(error, 'Failed to find transactions')
  }
}

/**
 * Find a transaction by its ID
 * @returns Promise that resolves to a single transaction
 */
export function findTransactionById(id: string) {
  try {
    return db.query.transactionsTable.findFirst({
      where: eq(transactionsTable.id, id),
    })
  } catch (error) {
    throw handleDatabaseError(
      error,
      `Failed to find transaction with ID: ${id}`
    )
  }
}

/**
 * Update a transaction by its ID
 * @param id Transaction ID
 * @param dataToUpdate Set of data to update
 * @returns Promise that resolves to the updated transaction
 */
export function updateTransactionById(
  id: string,
  dataToUpdate: Partial<SelectTransaction>
) {
  try {
    return db
      .update(transactionsTable)
      .set({ ...dataToUpdate, updatedAt: new Date() })
      .where(eq(transactionsTable.id, id))
  } catch (error) {
    throw handleDatabaseError(
      error,
      `Failed to update transaction with ID: ${id}`,
      dataToUpdate
    )
  }
}
