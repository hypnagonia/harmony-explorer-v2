import {logger} from './logger'
import {BlockIndexer} from './indexer/blockIndexer'
import {ShardID} from 'src/types/blockchain'
import {store} from 'src/store'

const l = logger(module)

const run = async () => {
  try {
    l.info('Indexer starting...')
    await store.start()

    const shards = [0] as ShardID[]
    const blockIndexers = shards.map((shardID) => new BlockIndexer(shardID))
    blockIndexers.forEach((b) => b.loop())
  } catch (err) {
    l.error(err)
    process.exit(1)
  }
}

run()
