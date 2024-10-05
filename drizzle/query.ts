import { db } from './db'
import {
  type CreateTransaction,
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
