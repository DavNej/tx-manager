import {
  decimal,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Define transaction statuses
export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending',
  'scheduled',
  'completed',
  'failed',
])

// Transactions table schema
export const transactionsTable = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  senderWallet: varchar('sender_wallet', { length: 255 }).notNull(),
  receiverWallet: varchar('receiver_wallet', { length: 255 }).notNull(),
  status: transactionStatusEnum('status').default('pending').notNull(),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})

// Transaction validation schema
export const insertTransactionSchema = createInsertSchema(transactionsTable)
export const selectTransactionSchema = createSelectSchema(transactionsTable)
export const createTransactionSchema = insertTransactionSchema.pick({
  amount: true,
  senderWallet: true,
  receiverWallet: true,
  scheduledFor: true,
})

export type InsertTransaction = z.infer<typeof insertTransactionSchema>
export type SelectTransaction = z.infer<typeof selectTransactionSchema>
export type CreateTransaction = z.infer<typeof createTransactionSchema>
