import { NextRequest, NextResponse } from 'next/server'
import { findTransactions } from '@/drizzle/query'
import { createTransactionSchema } from '@/drizzle/schema'
import { createTransaction } from '@/server/actions'
import {
  handleUnexpectedError,
  isZodError,
  logError,
} from '@/server/error-service'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    if (body.scheduledFor) {
      const scheduledFor = z.date().parse(body.scheduledFor)
      body.scheduledFor = scheduledFor
    }

    const transactionArgs = createTransactionSchema.parse(body)
    const transaction = await createTransaction(transactionArgs)

    return NextResponse.json(transaction, { status: 200 })
  } catch (error) {
    if (isZodError(error)) {
      logError(error)
      return NextResponse.json(
        { message: 'Wrong transaction data format', details: error.format() },
        { status: 400 }
      )
    }
    handleUnexpectedError(error)
    return NextResponse.json(
      { message: 'Error inserting transaction' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const transactions = await findTransactions()
    return NextResponse.json(transactions, { status: 200 })
  } catch (error) {
    handleUnexpectedError(error)
    return NextResponse.json(
      { message: 'Error fetching transactions' },
      { status: 500 }
    )
  }
}
