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
  return db.insert(transactionsTable).values(transactionData)
}

/**
 * Find all transactions in descending order of creation
 * @returns Promise that resolves to an array of transactions
 */
export function findTransactions(): Promise<SelectTransaction[]> {
  return db
    .select()
    .from(transactionsTable)
    .orderBy(desc(transactionsTable.createdAt))
}

/**
 * Find a transaction by its ID
 * @returns Promise that resolves to a single transaction
 */
export function findTransactionById({
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
