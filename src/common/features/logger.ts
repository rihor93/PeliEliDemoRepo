import { config } from "../configuration"

export const logger = {
  log: (text: string, context?: string) => {
    if (config.enableLogs) {
      console.log(`%c[${context?.toUpperCase()}]`, "color: rgb(88,88,88) ;",`${text}`)
    }
  },
  error: (err: unknown, context?: string) => {
    if (config.enableLogs) {
      console.error(`ERROR [${context}]: \n`)
      console.error(err)
    }
  },
}