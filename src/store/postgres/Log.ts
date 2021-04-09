import {IStorageLog} from 'src/store/interface'
import {BlockHash, BlockNumber, Log, ShardID} from 'src/types/blockchain'

import {Query} from 'src/store/postgres/types'

export class PostgresStorageLog implements IStorageLog {
  query: Query

  constructor(query: Query) {
    this.query = query
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

  addLog = async (shardID: ShardID, log: Log): Promise<any> => {
    return await this.query(
      `insert into logs${shardID}
       (
        address,
        topics,
        data,
        block_number,
        transaction_hash,
        transaction_index,
        block_hash,
        log_index,
        removed
       ) values
       ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,
      [
        log.address,
        log.topics,
        log.data,
        parseInt(log.blockNumber, 16),
        log.transactionHash,
        parseInt(log.transactionIndex, 16),
        log.blockHash,
        parseInt(log.logIndex, 16),
        log.removed,
      ]
    )
  }

  getLogsByTransactionHash = async (
    shardId: ShardID,
    TransactionHash: string
  ): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs${shardId} where transactionHash=$1;`, [
      TransactionHash,
    ])

    return res as Log[]
  }
  getLogsByBlockNumber = async (shardId: ShardID, num: BlockNumber): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs${shardId} where blockNumber=$1;`, [num])

    return res as Log[]
  }
  getLogsByBlockHash = async (shardId: ShardID, hash: BlockHash): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs${shardId} where blockHash=$1;`, [hash])

    return res as Log[]
  }
}
