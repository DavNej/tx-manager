import * as schema from '@/drizzle/schema'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import IORedis from 'ioredis'
import postgres from 'postgres'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL as string
const redisUrl = process.env.REDIS_URL as string

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

if (!redisUrl) {
  throw new Error('REDIS_URL is not set')
}

const sql = postgres(databaseUrl, { max: 1 })

export const db = drizzle(sql, { schema, logger: true })
export const redis = new IORedis(redisUrl, { maxRetriesPerRequest: null })
