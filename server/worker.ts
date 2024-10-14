import * as schema from '@/drizzle/schema'
import { transactionsTable } from '@/drizzle/schema'
import { type Job, Worker } from 'bullmq'
import dotenv from 'dotenv'
import { and, eq, lte, notInArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { processTransaction } from './actions'
import { handleWorkerError } from './error-service'
import {
  connection,
  scheduleTransaction,
  transactionQueue,
} from './transaction-queue'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL as string

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

const sql = postgres(databaseUrl, { max: 1 })
const db = drizzle(sql, { schema, logger: true })

const worker = new Worker(
  'transactionQueue',
  async (job: Job) => {
    const { transactionId } = job.data

    console.log('🦋 Job running', job.data)

    try {
      const transaction = await db.query.transactionsTable.findFirst({
        where: (transactionsTable, { eq }) =>
          eq(transactionsTable.id, transactionId),
      })

      if (transaction) {
        const processedTransaction = await processTransaction(transaction)
        return processedTransaction.status
      }
    } catch (error) {
      handleWorkerError(error)
    }
  },
  { connection }
)

worker.on('ready', () => {
  console.log('✅ Worker is ready, waiting for jobs')
  processDueTransactions()
})

worker.on('active', (job) => {
  console.log('⚙️  Starting job ', job.id)
})

worker.on('completed', (job) => {
  console.log('🎉 Job completed', job.id)
})

worker.on('failed', (job) => {
  console.log('💥 Job failed', job?.id)
})

worker.on('error', (error) => {
  console.error('🚨 Worker error', error)
})

async function processDueTransactions() {
  const waitingJobs = await transactionQueue.getWaiting()
  const activeJobs = await transactionQueue.getActive()

  const waitingJobTransactionIds = waitingJobs.map(
    ({ data }) => data.transactionId
  )
  const activeJobTransactionIds = activeJobs.map(
    ({ data }) => data.transactionId
  )

  const queuedJobTransactionIds = [
    ...waitingJobTransactionIds,
    ...activeJobTransactionIds,
  ]

  console.log('🤌', queuedJobTransactionIds.length, 'queued jobs')

  // Fetch all transactions that are scheduled to be processed
  const transactions = await db
    .select()
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.status, 'scheduled'),
        lte(transactionsTable.scheduledFor, new Date()),
        notInArray(transactionsTable.id, queuedJobTransactionIds)
      )
    )

  // Schedule the transactions
  for (const transaction of transactions) {
    console.log('🚀 Scheduling transaction', { transaction })
    await scheduleTransaction({
      transactionId: transaction.id,
      scheduledFor: transaction.scheduledFor!,
    })
  }
}
