import { Queue } from 'bullmq'
import { redis } from './init'

export const transactionQueue = new Queue('transactionQueue', {
  connection: redis,
})

export async function scheduleTransaction({
  transactionId,
  scheduledFor,
}: {
  transactionId: string
  scheduledFor: Date
}) {
  await transactionQueue.add(
    'processTransaction',
    { transactionId },
    {
      delay: scheduledFor.getTime() - Date.now(),
      removeOnComplete: 100,
      removeOnFail: 500,
    }
  )

  console.log('⏳ Job added to queue', { transactionId, scheduledFor })
}
