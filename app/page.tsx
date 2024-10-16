import * as React from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { getTransactionsOptions } from '@/lib/get-transactions'
import CreateTransactionButton from '@/components/create-transaction-button'
import Header from '@/components/header'
import TransactionList from '@/components/transaction-list'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(getTransactionsOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="p-8 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <Header />
          <CreateTransactionButton />
        </div>

        <Card className="drop-shadow-md">
          <CardContent className="pt-4">
            <TransactionList />
          </CardContent>
        </Card>
      </main>
    </HydrationBoundary>
  )
}
