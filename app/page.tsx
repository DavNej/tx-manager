import Image from 'next/image'
import * as React from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/get-query-client'
import { getTransactionsOptions } from '@/lib/get-transactions'
import CreateTransactionButton from '@/components/create-transaction-button'
import TransactionList from '@/components/transaction-list'
import { Card, CardContent } from '@/components/ui/card'
import Typography from '@/components/ui/typography'

export default async function Home() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(getTransactionsOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="p-8 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="">
            <div className="flex items-center">
              <Image
                className="rouded-full drop-shadow-md mr-4"
                src="/logo.svg"
                alt="Tx Manager logo"
                width={40}
                height={40}
              />
              <Typography.H1>Tx Manager</Typography.H1>
            </div>
            <Typography.Lead className="mt-2">
              Create, schedule and review your transactions
            </Typography.Lead>
          </div>
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
