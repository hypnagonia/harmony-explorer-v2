import {config} from 'src/config'
import {BlockIndexer} from 'src/indexer/BlockIndexer'
import {LogIndexer} from 'src/indexer/LogIndexer'
import {indexerServer} from 'src/indexer/server'

import {logger} from 'src/logger'

const l = logger(module)

// todo check if node stuck
export const indexer = async () => {
  l.info(`Indexer starting... Shards[${config.indexer.shards.join(', ')}]`)

  const shards = config.indexer.shards
  const blockIndexers = shards.map(
    (shardID) =>
      new BlockIndexer(shardID, config.indexer.batchCount, config.indexer.initialBlockSyncingHeight)
  )
  // blockIndexers.forEach((b) => b.loop())

  await indexerServer()

  if (config.indexer.isSyncingLogsEnabled && config.indexer.shards.includes(0)) {
    const logIndexer0 = new LogIndexer(0)
    await logIndexer0.loop()
  }
}
