import { NextRequest, NextResponse } from 'next/server'
import { findTransactions } from '@/drizzle/query'
import { createTransactionSchema } from '@/drizzle/schema'
import { createTransaction } from '@/server/actions'
import logger from '@/lib/logger'
import { getErrorCause } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    if (body.scheduledFor instanceof Date) {
      body.scheduledFor = new Date(body.scheduledFor)
    }

    const result = createTransactionSchema.safeParse(body)

    if (!result.success) {
      const message = 'Wrong transaction data format'
      const cause = result.error.issues
      logger.error({ message, error: cause })
      return NextResponse.json({ message, cause }, { status: 400 })
    }

    const transaction = await createTransaction(body)

    return NextResponse.json(transaction, { status: 200 })
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
