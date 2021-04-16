import {logger} from './logger'
import {BlockIndexer} from './indexer/BlockIndexer'
import {LogIndexer} from './indexer/LogIndexer'
import {ShardID} from 'src/types/blockchain'
import {api} from 'src/api'
import {config} from 'src/config'

const l = logger(module)

// todo checks on start. shard chainId
const run = async () => {
  l.info(`Harmony Explorer v${config.info.version}. Git commit hash: ${config.info.gitCommitHash}`)

  try {
    if (config.api.isEnabled) {
      l.info(`API starting... Shards[${config.api.shards.join(', ')}]`)
      await api()
    } else {
      l.debug('API is disabled')
    }

    if (config.indexer.isEnabled) {
      l.info(`Indexer starting... Shards[${config.indexer.shards.join(', ')}]`)

      const shards = config.indexer.shards as ShardID[]
      const blockIndexers = shards.map(
        (shardID) =>
          new BlockIndexer(
            shardID,
            config.indexer.batchCount,
            config.indexer.initialBlockSyncingHeight
          )
      )
      blockIndexers.forEach((b) => b.loop())

      if (config.indexer.isSyncingLogsEnabled && config.indexer.shards.includes(0)) {
        const logIndexer0 = new LogIndexer(0)
        await logIndexer0.loop()
      }
    } else {
      l.debug('Indexer is disabled')
    }
  } catch (err) {
    l.error(err)
    process.exit(1)
  }
}

run()
