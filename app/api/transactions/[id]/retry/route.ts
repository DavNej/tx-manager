import { NextRequest, NextResponse } from 'next/server'
import { getTransactionById, updateTransactionById } from '@/drizzle/query'
import logger from '@/lib/logger'
import { simulateExternalApiCall } from '@/lib/payment-api'
import { getErrorCause } from '@/lib/utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const [transaction] = await getTransactionById({ id })

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

    const isTransactionSuccess = await simulateExternalApiCall()
    const newStatus = isTransactionSuccess ? 'completed' : 'failed'

    const [updatedTransaction] = await updateTransactionById({
      id,
      updatedData: { status: newStatus },
    }).returning()

    return NextResponse.json(
      { message: 'Transaction completed', transaction: updatedTransaction },
      { status: 200 }
    )
  } catch (error) {
    const message = 'Error retrying transaction'
    logger.error({ message, error })
    return NextResponse.json(
      { message, cause: getErrorCause(error) },
      { status: 500 }
    )
  }
}
