import {logger} from 'src/logger'
import {IStorageIndexer} from 'src/store/interface'
import {Block, BlockHash, BlockNumber, ShardID} from 'src/types/blockchain'
import {generateQuery} from './queryMapper'

import {Query} from 'src/store/postgres/types'

const l = logger(module)

export class PostgresStorageIndexer implements IStorageIndexer {
  query: Query
  constructor(query: Query) {
    this.query = query
  }

  getLastIndexedBlockNumber = async (shardID: ShardID): Promise<number | null> => {
    const res = await this.query(
      `select blocks_shard${shardID}_last_synced_block_number from indexer_state where id=0;`,
      []
    )
    const lastIndexedBlock = +res[0][`blocks_shard${shardID}_last_synced_block_number`]

    return lastIndexedBlock || null
  }

  setLastIndexedBlockNumber = async (shardID: ShardID, num: BlockNumber): Promise<number> => {
    return this.query(
      `update indexer_state set blocks_shard${shardID}_last_synced_block_number=$1 where id=0;`,
      [num]
    )
  }

  getLastIndexedLogsBlockNumber = async (shardID: ShardID): Promise<number> => {
    const res = await this.query(
      `select logs_last_synced_block_number from indexer_state where id=0;`,
      []
    )

    const lastIndexedBlock = +res[0][`logs_last_synced_block_number`]
    return lastIndexedBlock || 0
  }

  setLastIndexedLogsBlockNumber = async (shardId: ShardID, num: BlockNumber): Promise<number> => {
    return this.query(`update indexer_state set logs_last_synced_block_numberr=$1 where id=0;`, [
      num,
    ])
  }
}
