import {logger} from './logger'
import {BlockIndexer} from './indexer/BlockIndexer'
import {LogIndexer} from './indexer/LogIndexer'
import {ShardID} from 'src/types/blockchain'
import {store} from 'src/store'

const l = logger(module)

const run = async () => {
  try {
    l.info('Indexer starting...')
    await store.start()

    const shards = [1] as ShardID[]
    const blockIndexers = shards.map((shardID) => new BlockIndexer(shardID))
    blockIndexers.forEach((b) => b.loop())

    const logIndexer0 = new LogIndexer(0)
    // await logIndexer0.loop()
  } catch (err) {
    l.error(err)
    process.exit(1)
  }
}

run()
