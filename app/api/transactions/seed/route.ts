import { NextRequest, NextResponse } from 'next/server'
import { transactionsTable } from '@/drizzle/schema'
import { seedDatabase } from '@/drizzle/seed'
import logger from '@/lib/logger'
import { getErrorCause } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const count: number = body.count ? parseInt(body.count) : 1

  try {
    const insertedTxIds = await seedDatabase(count).returning({
      insertedId: transactionsTable.id,
    })

    return NextResponse.json({ insertedTxIds }, { status: 201 })
  } catch (error) {
    const message = 'Error seeding database'
    logger.error({ message, error })
    return NextResponse.json(
      { message, cause: getErrorCause(error) },
      { status: 500 }
    )
  }
}
