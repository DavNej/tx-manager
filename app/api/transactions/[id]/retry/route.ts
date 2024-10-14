import { NextRequest, NextResponse } from 'next/server'
import { findTransactionById } from '@/drizzle/query'
import { processTransaction } from '@/server/actions'
import { catchUnexpectedError } from '@/server/error-service'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const transaction = await findTransactionById(id)

    if (!transaction) {
      return NextResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
      )
    }

    if (transaction.status !== 'failed') {
      return NextResponse.json(
        { message: 'Transaction is not in a failed state' },
        { status: 400 }
      )
    }

    const processedTransaction = await processTransaction(transaction)
    return NextResponse.json(processedTransaction, { status: 200 })
  } catch (error) {
    catchUnexpectedError(error)
    return NextResponse.json(
      { message: 'Error while retrying to process the transaction' },
      { status: 500 }
    )
  }
}
