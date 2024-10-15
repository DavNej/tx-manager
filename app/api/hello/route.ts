import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ hello: true }, { status: 200 })
}
