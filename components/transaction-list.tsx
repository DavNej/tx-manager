'use client'

import React from 'react'
import { toast } from '@/hooks/use-toast'
import { logError } from '@/server/error-service'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getTransactionsOptions } from '@/lib/get-transactions'
import TransactionTable from './transaction-table'
import { TransactionTableLoading } from './transaction-table-loading'

export default function TransactionList() {
  const { data, isFetching, error, isError } = useSuspenseQuery(
    getTransactionsOptions()
  )

  React.useEffect(() => {
    if (isError) {
      logError(error)

      toast({
        title: 'Something went wrong',
        description: error?.message,
        variant: 'destructive',
      })
    }
  }, [error, isError])

  if (isFetching) return <TransactionTableLoading />

  return <TransactionTable data={data || []} />
}
