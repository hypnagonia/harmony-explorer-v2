import {config} from 'src/indexer/config'
import * as RPCClient from 'src/indexer/rpc/client'
import {logger} from 'src/logger'
const l = logger(module)

let currentHeight = config.indexer.initialBlockSyncingHeight

const pool = Array(1000).fill(0)

export const loop = async () => {
  const now = Date.now()
  l.info(`Syncing block ${currentHeight}`)

  await Promise.all(pool.map(() => query()))

  l.info(`Done in ${Date.now() - now}ms`)
  console.log({currentHeight})
  process.nextTick(loop)
}

const query = () => {
  return RPCClient.getBlockByNumber(currentHeight).then((block) => {
    currentHeight++
  })
}
