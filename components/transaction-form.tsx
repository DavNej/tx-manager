'use client'

import { useRouter } from 'next/navigation'
import { createTransactionSchema } from '@/drizzle/schema'
import { toast } from '@/hooks/use-toast'
import { createTransaction } from '@/server/actions'
import { handleUnexpectedError, isZodError } from '@/server/error-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Send, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn, generateRandomEvmAddress } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const formSchema = z
  .object({
    amount: z.string().min(1, { message: 'Amount is required' }),
    senderWallet: z.string().min(1, { message: 'Sender wallet is required' }),
    receiverWallet: z
      .string()
      .min(1, { message: 'Receiver wallet is required' }),
    isScheduled: z.boolean().default(false),
    scheduledDate: z.date({ message: 'Date is required' }),
    scheduledTime: z.string().min(1, { message: 'Time is required' }),
  })
  .refine((data) =>
    data.isScheduled ? data.scheduledDate && data.scheduledTime : true
  )

type FormValues = z.infer<typeof formSchema>

type Body = {
  amount: string
  senderWallet: string
  receiverWallet: string
  scheduledFor?: Date
}

export default function TransactionForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '235',
      senderWallet: '0xd870107bbcd7bd5d7037d5d4baf05d008aff5c99',
      receiverWallet: '0xd870107bbcd7bd5d7037d5d4baf05d008aff5c99',
      isScheduled: false,
      scheduledDate: new Date(),
      scheduledTime: '00:00',
    },
  })

  async function onSubmit(values: FormValues) {
    const body: Body = {
      amount: values.amount,
      senderWallet: values.senderWallet,
      receiverWallet: values.receiverWallet,
    }

    if (values.isScheduled) {
      const scheduledFor = values.scheduledDate
      const [hours, minutes] = values.scheduledTime.split(':').map(Number)
      scheduledFor.setHours(hours, minutes)
      body.scheduledFor = scheduledFor
    }

    try {
      const transactionArgs = createTransactionSchema.parse(body)
      await createTransaction(transactionArgs)
      toast({
        title: 'Success',
        description: 'New transaction created successfully',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      router.push('/')
    } catch (error) {
      handleUnexpectedError(error)
      const description = isZodError(error)
        ? 'Wrong transaction data format'
        : 'Something went wrong'
      toast({ title: 'Oops!', description, variant: 'destructive' })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Enter amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="senderWallet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sender Wallet</FormLabel>
              <FormControl>
                <div className="flex">
                  <Input placeholder="Enter sender wallet" {...field} />
                  <Button
                    type="button"
                    title="Generate random address"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => {
                      form.setValue('senderWallet', generateRandomEvmAddress())
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiverWallet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver Wallet</FormLabel>
              <FormControl>
                <div className="flex">
                  <Input placeholder="Enter receiver wallet" {...field} />
                  <Button
                    type="button"
                    title="Generate random address"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => {
                      form.setValue(
                        'receiverWallet',
                        generateRandomEvmAddress()
                      )
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isScheduled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Schedule Transaction</FormLabel>
                <FormDescription>
                  Check this box to schedule the transaction for a later date.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch('isScheduled') && (
          <>
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel>Schedule Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          fromDate={new Date()}
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel>Schedule Time</FormLabel>
                    <Input
                      placeholder="Enter time"
                      {...field}
                      value={String(field.value)}
                      type="time"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormDescription className="mt-2">
              Select the date and time for the scheduled transaction.
            </FormDescription>
          </>
        )}

        <Button
          className="ml-auto"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>Sending ...</>
          ) : (
            <>
              Send
              <Send className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
