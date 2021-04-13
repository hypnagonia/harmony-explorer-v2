import {logger} from './logger'
import {BlockIndexer} from './indexer/BlockIndexer'
import {LogIndexer} from './indexer/LogIndexer'
import {ShardID} from 'src/types/blockchain'

import {config} from 'src/indexer/config'
import {getBlockByNumber} from 'src/indexer/rpc/client'

const l = logger(module)

// todo checks on start. shard chainId
const run = async () => {
  try {
    if (config.indexer.isEnabled) {
      l.info('Indexer starting...')

      const shards = [0, 1] as ShardID[]
      const blockIndexers = shards.map(
        (shardID) =>
          new BlockIndexer(
            shardID,
            config.indexer.batchCount,
            config.indexer.initialBlockSyncingHeight
          )
      )
      blockIndexers.forEach((b) => b.loop())

      // const logIndexer0 = new LogIndexer(0)
      // await logIndexer0.loop()
    } else {
      l.debug('Indexer is disabled')
    }
  } catch (err) {
    l.error(err)
    process.exit(1)
  }
}

run()
