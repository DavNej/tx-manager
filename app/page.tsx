import * as React from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'

export default async function Home() {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="p-8 text-center">
        <h2>Welcome to TX Manager</h2>
      </main>
    </HydrationBoundary>
  )
}
