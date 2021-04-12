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
    shardID: ShardID,
    TransactionHash: string
  ): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs where transaction_hash=$1 and shard=$2;`, [
      TransactionHash,
      shardID,
    ])

    return res as Log[]
  }
  getLogsByBlockNumber = async (shardID: ShardID, num: BlockNumber): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs where block_number=$1 and shard=$2;`, [
      num,
      shardID,
    ])

    return res as Log[]
  }
  getLogsByBlockHash = async (shardID: ShardID, hash: BlockHash): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs where block_hash=$1 and shard=$2;`, [
      hash,
      shardID,
    ])

    return res as Log[]
  }
}
