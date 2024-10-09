'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'

export default function CreateTransactionButton() {
  return (
    <Button
      className="drop-shadow-md"
      onClick={() => console.log('Create transaction')}
    >
      <Plus size={24} className="mr-2" />
      New
    </Button>
  )
}
