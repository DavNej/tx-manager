import * as React from 'react'
import Header from '@/components/header'
import TransactionForm from '@/components/transaction-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewTransactionPage() {
  return (
    <main className="p-8 flex flex-col gap-8">
      <Header />

      <Card className="drop-shadow-md w-1/2 mx-auto">
        <CardHeader>
          <CardTitle>New transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm />
        </CardContent>
      </Card>
    </main>
  )
}
