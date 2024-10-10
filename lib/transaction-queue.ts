import { Queue } from 'bullmq'
import dotenv from 'dotenv'
import IORedis from 'ioredis'

dotenv.config()

const redisUrl = process.env.REDIS_URL

if (!redisUrl) {
  throw new Error('REDIS_URL is not set')
}

export const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })

export const transactionQueue = new Queue('transactionQueue', { connection })

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
