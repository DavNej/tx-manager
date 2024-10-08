import { NextRequest, NextResponse } from 'next/server'
import {
  createTransaction,
  getTransactions,
  updateTransactionById,
} from '@/drizzle/query'
import { insertTransactionSchema } from '@/drizzle/schema'
import logger from '@/lib/logger'
import { simulateExternalApiCall } from '@/lib/payment-api'
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
    const result = bodySchema.safeParse(body)

    if (!result.success) {
      const message = 'Wrong transaction data format'
      const cause = result.error.issues
      logger.error({ message, error: cause })
      return NextResponse.json({ message, cause }, { status: 400 })
    }

    // Insert the transaction with 'pending' status
    const [insertedTransaction] = await createTransaction({
      ...result.data,
      status: 'pending',
    }).returning()

    // Attempt the external API call
    const isTransactionSuccess = await simulateExternalApiCall()
    const updatedStatus = isTransactionSuccess ? 'completed' : 'failed'

    const [updatedTransaction] = await updateTransactionById({
      id: insertedTransaction.id,
      updatedData: { status: updatedStatus },
    }).returning()

    // Return the updated transaction
    return NextResponse.json(updatedTransaction, { status: 200 })
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
    const transactions = await getTransactions()
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
