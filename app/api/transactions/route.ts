import { NextRequest, NextResponse } from 'next/server'
import {
  insertTransaction,
  findTransactions,
  updateTransactionById,
} from '@/drizzle/query'
import { insertTransactionSchema } from '@/drizzle/schema'
import logger from '@/lib/logger'
import { simulateExternalApiCall } from '@/lib/payment-api'
import { scheduleTransaction } from '@/lib/transaction-queue'
import { getErrorCause } from '@/lib/utils'

const bodySchema = insertTransactionSchema.pick({
  amount: true,
  senderWallet: true,
  receiverWallet: true,
  scheduledFor: true,
})

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    if (body.scheduledFor) {
      body.scheduledFor = new Date(body.scheduledFor)
    }

    const result = bodySchema.safeParse(body)

    if (!result.success) {
      const message = 'Wrong transaction data format'
      const cause = result.error.issues
      logger.error({ message, error: cause })
      return NextResponse.json({ message, cause }, { status: 400 })
    }

    const { scheduledFor } = result.data

    // Insert the transaction
    const [insertedTransaction] = await insertTransaction({
      ...result.data,
      status: scheduledFor ? 'scheduled' : 'pending',
    }).returning()

    // Schedule the transaction if a scheduledFor time is provided
    if (scheduledFor) {
      await scheduleTransaction({
        transactionId: insertedTransaction.id,
        scheduledFor: new Date(scheduledFor),
      })
      return NextResponse.json(insertedTransaction, { status: 200 })
    }

    // Attempt the external API call
    const isTransactionSuccess = await simulateExternalApiCall()
    const updatedStatus = isTransactionSuccess ? 'completed' : 'failed'
    const [updatedTransaction] = await updateTransactionById({
      id: insertedTransaction.id,
      updatedData: { status: updatedStatus },
    }).returning()

    return NextResponse.json(updatedTransaction, { status: 200 })

    // Return the updated transaction
  } catch (error) {
    const message = 'Error inserting transaction'
    logger.error({ message, error })
    return NextResponse.json(
      { message, cause: getErrorCause(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const transactions = await findTransactions()
    return NextResponse.json(transactions)
  } catch (error) {
    const message = 'Error fetching transactions'
    logger.error({ message, error })
    return NextResponse.json(
      { message, cause: getErrorCause(error) },
      { status: 500 }
    )
  }
}
