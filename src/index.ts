import {logger} from './logger'
import {BlockIndexer} from './indexer/BlockIndexer'
import {LogIndexer} from './indexer/LogIndexer'
import {ShardID} from 'src/types/blockchain'
import {store} from 'src/store'
import {config} from 'src/indexer/config'

const l = logger(module)

// todo checks on start. shard chainId
const run = async () => {
  try {
    l.info('Indexer starting...')
    await store.start()

    const shards = [0] as ShardID[]
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
  } catch (err) {
    l.error(err)
    process.exit(1)
  }
}

run()
