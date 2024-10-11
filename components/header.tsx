import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import Typography from '@/components/ui/typography'

export default function Header() {
  return (
    <div>
      <div className="flex items-center">
        <Link href="/">
          <Image
            className="rouded-full drop-shadow-md mr-4"
            src="/logo.svg"
            alt="Tx Manager logo"
            width={40}
            height={40}
          />
        </Link>
        <Typography.H1>Tx Manager</Typography.H1>
      </div>
      <Typography.Lead className="mt-2">
        Send, schedule and view your transactions
      </Typography.Lead>
    </div>
  )
}
