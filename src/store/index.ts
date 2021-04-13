import {PostgresStorage} from 'src/store/postgres'
import {logger} from 'src/logger'
import {config} from 'src/indexer/config'
import {ShardID} from 'src/types/blockchain'
import {PostgresStorageOptions} from './postgres/types'

const l = logger(module)
const shards: ShardID[] = [0, 1, 2, 3]

export const stores = shards.map((shardID) => {
  const p = config.store.postgres[shardID]
  l.info(`Shard${shardID} postgres://${p.user}@${p.host}:${p.port}/${p.database}`)
  return new PostgresStorage({...p, shardID} as PostgresStorageOptions)
})
