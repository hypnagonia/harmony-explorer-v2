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
      `select lastBlocks${shardID}IndexedBlockNumber from indexer_state where id=0;`,
      []
    )
    const lastIndexedBlock = +res[0][`lastblocks${shardID}indexedblocknumber`]

    return lastIndexedBlock || null
  }

  setLastIndexedBlockNumber = async (shardID: ShardID, num: BlockNumber): Promise<number> => {
    return this.query(
      `update indexer_state set lastBlocks${shardID}IndexedBlockNumber=$1 where id=0;`,
      [num]
    )
  }

  getLastIndexedLogsBlockNumber = async (shardID: ShardID): Promise<number> => {
    const res = await this.query(
      `select lastLogs${shardID}IndexedBlockNumber from indexer_state where id=0;`,
      []
    )

    const lastIndexedBlock = +res[0][`lastlogs${shardID}indexedblocknumber`]
    return lastIndexedBlock || 0
  }

  setLastIndexedLogsBlockNumber = async (shardId: ShardID, num: BlockNumber): Promise<number> => {
    return this.query(
      `update indexer_state set lastLogs${shardId}IndexedBlockNumber=$1 where id=0;`,
      [num]
    )
  }
}
