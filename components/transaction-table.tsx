'use client'

import React from 'react'
import type { SelectTransaction } from '@/drizzle/schema'
import { toast } from '@/hooks/use-toast'
import { handleUnexpectedError } from '@/server/error-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function formatDate(date: Date | null): string {
  if (!date) return 'N/A'

  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })
    .format(new Date(date))
    .replace('24:', '00:')
}

export function TransactionTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Sender</TableHead>
        <TableHead>Receiver</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Scheduled Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Retry</TableHead>
      </TableRow>
    </TableHeader>
  )
}

function getBadgeVariant(status: string) {
  switch (status) {
    case 'failed':
      return 'destructive'
    case 'completed':
      return 'success'
    default:
      return 'outline'
  }
}

export default function TransactionTable({
  data,
}: {
  data: SelectTransaction[]
}) {
  const [mutatingTransactionId, setMutatingTransactionId] = React.useState('')
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ['retry-transaction'],
    mutationFn: (id: string) =>
      api.PUT<SelectTransaction>(`/api/transactions/${id}/retry`),
    onMutate(id) {
      setMutatingTransactionId(id)
    },
    onError(error) {
      handleUnexpectedError(error)
      toast({
        title: 'Oops!',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    },
    onSuccess(data) {
      if (data.status === 'completed') {
        toast({
          title: 'Success',
          description: 'Transaction completed successfully',
          variant: 'success',
        })
      } else {
        toast({
          title: 'Transaction failed',
          description: 'Transaction reprocessed but failed again',
          variant: 'default',
        })
      }
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onSettled() {
      setMutatingTransactionId('')
    },
  })

  return (
    <Table>
      <TransactionTableHeader />
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7}>No transactions</TableCell>
          </TableRow>
        ) : (
          data.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{formatDate(tx.createdAt)}</TableCell>
              <TableCell>{tx.senderWallet}</TableCell>
              <TableCell>{tx.receiverWallet}</TableCell>
              <TableCell>{tx.amount} €</TableCell>
              <TableCell>{formatDate(tx.scheduledFor)}</TableCell>
              <TableCell>
                <Badge
                  className="capitalize"
                  variant={getBadgeVariant(tx.status)}
                >
                  {tx.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {tx.status === 'failed' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate(tx.id)}
                    title="Retry"
                  >
                    <RefreshCw
                      className={cn(
                        'size-4',
                        mutation.isPending &&
                          mutatingTransactionId === tx.id &&
                          'animate-spin'
                      )}
                    />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
