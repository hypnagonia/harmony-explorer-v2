import {config} from 'src/indexer/config'
import * as RPCClient from 'src/indexer/rpc/client'
import {urls} from 'src/indexer/rpc/RPCUrls'

import {logger} from 'src/logger'

const l = logger(module)

let currentHeight = config.indexer.initialBlockSyncingHeight

const pool = Array(1000).fill(0)

export const loop = async () => {
  const now = Date.now()
  l.info(`Syncing block ${currentHeight}`)

  await Promise.all(pool.map((_, i) => query(currentHeight + i))).then((r) => {
    const blocks = new Set(r.map((a) => a.number)).size

    currentHeight += blocks
  })

  l.info(`Done in ${Date.now() - now}ms`)
  console.log({
    currentHeight,
    stats: urls.map((s) => s.totalQueries),
    fails: urls.map((s) => s.fails),
  })
  process.nextTick(loop)
}

const query = (height: number) => {
  return RPCClient.getBlockByNumber(height).then((block) => {
    return block
  })
}
