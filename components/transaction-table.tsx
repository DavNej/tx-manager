'use client'

import React from 'react'
import type { SelectTransaction } from '@/drizzle/schema'
import { Eye, MoreHorizontal, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function formatDate(date: Date | null) {
  return date ? date.toLocaleString() : 'N/A'
}

function handleRetry(id: string) {
  console.log(`Retrying transaction ${id}`)
}

function handleView(id: string) {
  console.log(`Viewing transaction ${id}`)
}

export default function TransactionTable({
  data,
}: {
  data: SelectTransaction[]
}) {
  if (data.length === 0) return <p>No transactions</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Amount</TableHead>
          <TableHead>Sender</TableHead>
          <TableHead>Receiver</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Scheduled For</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>{tx.amount}</TableCell>
            <TableCell>{tx.senderWallet}</TableCell>
            <TableCell>{tx.receiverWallet}</TableCell>
            <TableCell>{tx.status}</TableCell>
            <TableCell>{formatDate(tx.scheduledFor)}</TableCell>
            <TableCell>{formatDate(tx.createdAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleRetry(tx.id)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Retry</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleView(tx.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
