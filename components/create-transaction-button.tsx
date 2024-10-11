import Link from 'next/link'
import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'

export default function CreateTransactionButton() {
  return (
    <Link href="/new">
      <Button className="drop-shadow-md">
        <Plus size={24} className="mr-2" />
        New
      </Button>
    </Link>
  )
}
