import { config } from "../configuration"

export const logger = {
  log: (text: string, context?: string) => {
    if (config.enableLogs) {
      console.log(`[${context?.toUpperCase()}]: - ${text}`)
    }
  },
  error: (err: unknown, context?: string) => {
    if (config.enableLogs) {
      console.error(`ERROR [${context}]: \n`)
      console.error(err)
    }
  },
}