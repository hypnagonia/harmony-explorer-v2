import {IStorageLog} from 'src/store/interface'
import {BlockHash, BlockNumber, Log, ShardID} from 'src/types/blockchain'

import {Query} from 'src/store/postgres/types'

export class PostgresStorageLog implements IStorageLog {
  query: Query

  constructor(query: Query) {
    this.query = query
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
