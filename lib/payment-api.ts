export async function simulateExternalApiCall() {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(Math.random() > 0.3) // 30% failure rate
    }, 1000)
  })
}
