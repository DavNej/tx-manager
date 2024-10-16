import { type Job, Worker } from 'bullmq'
import { and, eq, lte, notInArray } from 'drizzle-orm'
import { transactionsTable } from '@/drizzle/schema'
import { handleDatabaseError, handleWorkerError } from '@/server/error-service'
import { sendToPaymentProvider } from '@/server/payment-provider'
import { db, redis } from './init'
import { scheduleTransaction, transactionQueue } from './transaction-queue'

const worker = new Worker(
  'transactionQueue',
  async (job: Job) => {
    const { transactionId } = job.data

    try {
      const transaction = await db.query.transactionsTable.findFirst({
        where: (transactionsTable, { eq }) =>
          eq(transactionsTable.id, transactionId),
      })

      if (transaction) {
        const isTransactionSuccess = await sendToPaymentProvider()
        const newStatus = isTransactionSuccess ? 'completed' : 'failed'

        try {
          const [updatedTransaction] = await db
            .update(transactionsTable)
            .set({ status: newStatus, updatedAt: new Date() })
            .where(eq(transactionsTable.id, transaction.id))
            .returning()
          return updatedTransaction.status
        } catch (error) {
          throw handleDatabaseError(
            error,
            `Failed to update transaction with ID: ${transaction.id}`,
            { status: newStatus, updatedAt: new Date() }
          )
        }
      }
    } catch (error) {
      throw handleWorkerError(error)
    }
  },
  { connection: redis }
)

worker.on('ready', () => {
  console.log('✅ Worker is ready, waiting for jobs')
  processDueTransactions()
})

worker.on('active', (job) => {
  console.log('\n-------------\n')
  console.log(`⚙️  Starting job ${job.id} : `, job.data)
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
