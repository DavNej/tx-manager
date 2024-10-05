import { NextRequest, NextResponse } from 'next/server'
import { getTransactionById, updateTransactionById } from '@/drizzle/query'
import { getErrorReason } from '@/lib/utils'
import logger from '@/lib/logger'

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

    const isTransactionSuccess = await simulateExternalApiCall() // Simulate retry logic (mocking the external API call here)
    const newStatus = isTransactionSuccess ? 'completed' : 'failed'

    const updatedTransaction = await updateTransactionById({
      id,
      updatedData: { status: newStatus },
    })

    return NextResponse.json(
      { message: 'Transaction updated', transaction: updatedTransaction[0] },
      { status: 200 }
    )
  } catch (error) {
    const message = 'Error retrying transaction'
    logger.error({ message, error })
    return NextResponse.json(
      { message, reason: getErrorReason(error) },
      { status: 500 }
    )
  }
}

async function simulateExternalApiCall() {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(Math.random() > 0.3) // 30% failure rate
    }, 1000)
  })
}
