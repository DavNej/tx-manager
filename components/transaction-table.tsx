'use client'

import React from 'react'
import type { SelectTransaction } from '@/drizzle/schema'
import { RefreshCw } from 'lucide-react'
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
  }).format(new Date(date))
}

function handleRetry(id: string) {
  console.log(`Retrying transaction ${id}`)
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

export default function TransactionTable({
  data,
}: {
  data: SelectTransaction[]
}) {
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
              <TableCell>{tx.amount}</TableCell>
              <TableCell>{tx.senderWallet}</TableCell>
              <TableCell>{tx.receiverWallet}</TableCell>
              <TableCell>{tx.status}</TableCell>
              <TableCell>{formatDate(tx.scheduledFor)}</TableCell>
              <TableCell>{formatDate(tx.createdAt)}</TableCell>
              <TableCell className="text-right">
                {tx.status === 'failed' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRetry(tx.id)}
                    title="Retry"
                  >
                    <RefreshCw className="size-4" />
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
