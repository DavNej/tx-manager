import Image from 'next/image'
import * as React from 'react'
import TransactionForm from '@/components/transaction-form'
import { Card, CardContent } from '@/components/ui/card'
import Typography from '@/components/ui/typography'

export default async function NewTransactionPage() {
  return (
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
            <Typography.H2 className="border-none p-0">
              New transaction
            </Typography.H2>
          </div>
        </div>
      </div>

      <Card className="drop-shadow-md w-1/2">
        <CardContent className="pt-4">
          <TransactionForm />
        </CardContent>
      </Card>
    </main>
  )
}
