import LRU from 'lru-cache'

const options = {
  max: 1 * 1000 * 100,
  maxAge: 1000 * 60 * 60,
}
const pruneCheckIntervalMs = 2000

export const cache = new LRU(options)

export const withCache = async (keys: any[], f: Function, maxAge?: number) => {
  const key = JSON.stringify(keys)
  const cachedRes = cache.get(key)
  if (cachedRes) {
    return cachedRes
  }

  const res = await f()
  cache.set(key, res, maxAge)

  return res
}

const prune = () => {
  cache.prune()
  setTimeout(prune, pruneCheckIntervalMs)
}
prune()
