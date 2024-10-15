import { testApiHandler } from 'next-test-api-route-handler'
import * as appHandler from '@/app/api/hello/route'

test('GET /hello returns 200', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: 'GET' })
      const json = await response.json()
      expect(response.status).toBe(200)
      await expect(json).toStrictEqual({
        hello: true,
      })
    },
  })
})
