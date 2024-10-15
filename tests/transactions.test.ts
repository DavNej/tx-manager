import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from '@/app/api/transactions/route'

describe('/transactions routes', () => {
  test('GET returns 200', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const response = await fetch({ method: 'GET' })
        const json = await response.json()
        console.log(json)
        expect(response.status).toBe(200)
        expect(json).toBeTruthy()
      },
    })
  })
})
