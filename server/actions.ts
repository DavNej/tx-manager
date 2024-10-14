'use server'

import { insertTransaction, updateTransactionById } from '@/drizzle/query'
import type { CreateTransaction, SelectTransaction } from '@/drizzle/schema'
import { sendToPaymentProvider } from '@/server/payment-provider'
import { scheduleTransaction } from '@/server/transaction-queue'

export async function createTransaction(args: CreateTransaction) {
  const { scheduledFor } = args

  // Insert the transaction
  const [insertedTransaction] = await insertTransaction({
    ...args,
    status: scheduledFor ? 'scheduled' : 'pending',
  }).returning()

  // Schedule the transaction if a scheduledFor time is provided
  if (scheduledFor) {
    await scheduleTransaction({
      transactionId: insertedTransaction.id,
      scheduledFor,
    })
    return insertedTransaction
  }

  // Send transaction to external payment provider API
  const processedTransaction = await processTransaction(insertedTransaction)
  return processedTransaction
}

export async function processTransaction(transaction: SelectTransaction) {
  const isTransactionSuccess = await sendToPaymentProvider()
  const newStatus = isTransactionSuccess ? 'completed' : 'failed'

  const [updatedTransaction] = await updateTransactionById(transaction.id, {
    status: newStatus,
  }).returning()

  return updatedTransaction
}
