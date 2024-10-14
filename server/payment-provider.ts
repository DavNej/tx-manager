export async function sendToPaymentProvider() {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(Math.random() > 0.3) // 30% failure rate
    }, 1000)
  })
}
