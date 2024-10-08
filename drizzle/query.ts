import { desc, eq } from 'drizzle-orm'
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
export function getTransactions(): Promise<SelectTransaction[]> {
  return db
    .select()
    .from(transactionsTable)
    .orderBy(desc(transactionsTable.createdAt))
}

/**
 * Get a transaction by its ID
 * @returns Promise that resolves to a single transaction
 */
export function getTransactionById({
  id,
}: {
  id: string
}): Promise<SelectTransaction[]> {
  return db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.id, id))
    .limit(1)
}

/**
 * Update a transaction by its ID
 * @param id Transaction ID
 * @param transactionData Transaction data
 * @returns Promise that resolves to the updated transaction
 */
export function updateTransactionById({
  id,
  updatedData,
}: {
  id: string
  updatedData: Partial<SelectTransaction>
}) {
  return db
    .update(transactionsTable)
    .set({ ...updatedData, updatedAt: new Date() })
    .where(eq(transactionsTable.id, id))
}
