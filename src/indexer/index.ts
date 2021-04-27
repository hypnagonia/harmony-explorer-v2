import {config} from 'src/config'
import {BlockIndexer} from 'src/indexer/BlockIndexer'
import {LogIndexer} from 'src/indexer/LogIndexer'
import {indexerServer} from 'src/indexer/server'
import {ShardID} from 'src/types'
import {logger} from 'src/logger'
import {stores} from 'src/store'
import * as RPCClient from 'src/indexer/rpc/client'
import {urls, RPCUrls} from 'src/indexer/rpc/RPCUrls'

const l = logger(module)

// todo check if node stuck
export const indexer = async () => {
  l.info(`Indexer starting... Shards[${config.indexer.shards.join(', ')}]`)

  const shards = config.indexer.shards

  await Promise.all(shards.map(checkChainID))

  const blockIndexers = shards.map(
    (shardID) =>
      new BlockIndexer(shardID, config.indexer.batchCount, config.indexer.initialBlockSyncingHeight)
  )
  blockIndexers.forEach((b) => b.loop())

  await indexerServer()

  if (config.indexer.isSyncingLogsEnabled && config.indexer.shards.includes(0)) {
    const logIndexer0 = new LogIndexer(0)
    await logIndexer0.loop()
  }
}

const checkChainID = async (shardID: ShardID) => {
  const u = urls[shardID]
  const chainID = await stores[shardID].indexer.getChainID()
  await Promise.all(
    u.map((o) =>
      RPCClient.getChainID(shardID).then((nodeChainID) => {
        if (nodeChainID !== chainID) {
          throw new Error(
            `Wrong chain. ${o.url} returned chain ID ${nodeChainID}. Expected: ${chainID}.`
          )
        }
      })
    )
  )
}
