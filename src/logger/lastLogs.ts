import LRU from 'lru-cache'
import {TLogMessage} from 'zerg/dist/types'

const options = {
  max: 20,
  maxAge: 1000 * 60 * 60 * 24 * 7,
}

export const cache = new LRU(options)

export const addLastLog = (logMessage: TLogMessage) => {
  const m = `${logMessage.moduleName} ${logMessage.message}`
  cache.set(m, m)
}

export const getLastLogs = () => {
  return cache.values()
}
