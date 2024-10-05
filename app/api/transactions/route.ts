import { NextRequest, NextResponse } from 'next/server'
import { insertTransactionSchema } from '@/drizzle/schema'
import { createTransaction } from '@/drizzle/query'
import { getErrorReason } from '@/lib/utils'
import logger from '@/lib/logger'

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    const result = insertTransactionSchema.safeParse(body)

    if (!result.success) {
      const message = 'Wrong transaction data format'
      const reason = result.error.issues
      logger.error({ message, error: reason })
      return NextResponse.json({ message, reason }, { status: 400 })
    }

    const insertedTransaction = await createTransaction(result.data).returning()
    return NextResponse.json(insertedTransaction, { status: 201 })
  } catch (error) {
    const message = 'Error inserting transaction'
    logger.error({ message, error })
    return NextResponse.json(
      { message, reason: getErrorReason(error) },
      { status: 500 }
    )
  }
}
