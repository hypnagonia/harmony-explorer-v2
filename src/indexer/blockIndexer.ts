import {config} from 'src/indexer/config'
import * as RPCClient from 'src/indexer/rpc/client'
import {urls} from 'src/indexer/rpc/RPCUrls'

import {logger} from 'src/logger'

const l = logger(module)
const approximateBlockMintingTime = 2000
const pool = Array(config.indexer.batchCount).fill(0)
let currentHeight = 11468007 // config.indexer.initialBlockSyncingHeight

export const loop = async () => {
  try {
    const now = Date.now()
    const latestBlockchainBlock = (await RPCClient.getBlockByNumber('latest')).number

    const blocks = (
      await Promise.all(
        pool.map((_, i) => {
          if (currentHeight + i <= latestBlockchainBlock) {
            return query(currentHeight + i)
          }

          return Promise.resolve(null)
        })
      )
    ).filter((b) => b)

    l.info(
      `Fetched [${currentHeight}, ${currentHeight + blocks.length}] ${
        blocks.length
      } blocks. Done in ${Date.now() - now}ms`
    )
    currentHeight += blocks.length

    console.log({
      stats: urls.map((s) => s.totalQueries),
      fails: urls.map((s) => s.failedRequests),
    })
    urls.forEach((u) => {
      u.totalQueries = 0
    })

    if (blocks.length === pool.length) {
      process.nextTick(loop)
    } else {
      setTimeout(loop, approximateBlockMintingTime)
    }
  } catch (e) {
    setTimeout(loop, approximateBlockMintingTime)
  }
}

const query = (height: number) => {
  return RPCClient.getBlockByNumber(height).then((block) => {
    return block
  })
}
