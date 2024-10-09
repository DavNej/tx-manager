import type { SelectTransaction } from '@/drizzle/schema'
import { queryOptions } from '@tanstack/react-query'
import api from './api'

export function getTransactionsOptions() {
  return queryOptions<SelectTransaction[]>({
    queryKey: ['transactions'],
    queryFn: () => api.GET<SelectTransaction[]>('/api/transactions'),
  })
}
