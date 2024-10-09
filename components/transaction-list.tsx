'use client'

import React from 'react'
import { toast } from '@/hooks/use-toast'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getTransactionsOptions } from '@/lib/get-transactions'
import { Card, CardContent } from '@/components/ui/card'
import TransactionTable from './transaction-table'

export const dynamic = 'force-dynamic'

export default function TransactionList() {
  const { data, isFetching, error, isError } = useSuspenseQuery(
    getTransactionsOptions()
  )

  React.useEffect(() => {
    if (isError) {
      console.log('error', error)

      const description = error?.cause
        ? String(error.cause)
        : 'Something went wrong'

      toast({
        title: error?.message || 'Oops !',
        description,
        variant: 'destructive',
      })
    }
  }, [error, isError])

  return (
    <Card className="drop-shadow-md">
      <CardContent className="pt-4">
        {isFetching ? (
          <p>Loading...</p>
        ) : (
          <TransactionTable data={data || []} />
        )}
      </CardContent>
    </Card>
  )
}
