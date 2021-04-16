import {config} from 'src/config'
import {BlockIndexer} from 'src/indexer/BlockIndexer'
import {LogIndexer} from 'src/indexer/LogIndexer'
import {logger} from 'src/logger'

const l = logger(module)

export const indexer = async () => {
  const shards = config.indexer.shards
  const blockIndexers = shards.map(
    (shardID) =>
      new BlockIndexer(shardID, config.indexer.batchCount, config.indexer.initialBlockSyncingHeight)
  )
  blockIndexers.forEach((b) => b.loop())

  if (config.indexer.isSyncingLogsEnabled && config.indexer.shards.includes(0)) {
    const logIndexer0 = new LogIndexer(0)
    await logIndexer0.loop()
  }
}
