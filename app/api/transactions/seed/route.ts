import { NextRequest, NextResponse } from 'next/server'
import { transactionsTable } from '@/drizzle/schema'
import { seedDatabase } from '@/drizzle/seed'
import { handleUnexpectedError } from '@/server/error-service'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const count: number = body.count ? parseInt(body.count) : 1

  try {
    const insertedTxIds = await seedDatabase(count).returning({
      insertedId: transactionsTable.id,
    })

    const txIds = insertedTxIds.map((row) => row.insertedId)

    return NextResponse.json(txIds, { status: 200 })
  } catch (error) {
    handleUnexpectedError(error)
    return NextResponse.json(
      { message: 'Error seeding database' },
      { status: 500 }
    )
  }
}
