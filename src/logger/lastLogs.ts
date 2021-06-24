import LRU from 'lru-cache'

const options = {
  max: 20,
  maxAge: 1000 * 60 * 60 * 24 * 7,
}

export const cache = new LRU(options)

export const addLastLog = (message: any) => {
  cache.set(message, message)
}

export const getLastLogs = () => {
  return cache.values()
}
