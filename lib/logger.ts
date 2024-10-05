function info(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'development') return

  console.log('🦋 |', ...args)
}

function error({ message, error }: { message: string; error: unknown }) {
  console.log('💥💥💥 |', message)
  console.error('---')
  console.error(error)
  console.error('💥💥💥')
}

const logger = {
  info,
  error,
}

export default logger
