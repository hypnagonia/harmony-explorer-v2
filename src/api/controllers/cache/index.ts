import LRU from 'lru-cache'

const options = {
  max: 1 * 1000 * 100,
  maxAge: 1000 * 60 * 60,
}
const pruneCheckIntervalMs = 2000

export const cache = new LRU(options)

const prune = () => {
  cache.prune()
  setTimeout(prune, pruneCheckIntervalMs)
}
prune()
