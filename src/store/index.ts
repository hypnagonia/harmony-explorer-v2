import {PostgresStorage} from 'src/store/postgres'
import {config} from 'src/config'
import {ShardID} from 'src/types/blockchain'
import {PostgresStorageOptions} from './postgres/types'

const shards: ShardID[] = [0, 1, 2, 3]

// todo pool for indexer and pool for api
export const stores = shards.map((shardID) => {
  const p = config.store.postgres[shardID]
  return new PostgresStorage({...p, shardID} as PostgresStorageOptions)
})

const stores2 = shards.map((shardID) => {
  const p = config.store.postgres[shardID]
  return new PostgresStorage({...p, shardID} as PostgresStorageOptions)
})

export const storesAPI = config.api.isEnabled ? stores2 : stores
