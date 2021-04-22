import {IStorageLog} from 'src/store/interface'
import {BlockHash, BlockNumber, Log, ShardID} from 'src/types/blockchain'

import {Query} from 'src/store/postgres/types'

export class PostgresStorageLog implements IStorageLog {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  addLog = async (log: Log): Promise<any> => {
    return await this.query(
      `insert into logs
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
       ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);`,
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

  getLogsByTransactionHash = async (TransactionHash: string): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs where transaction_hash=$1;`, [TransactionHash])

    return res as Log[]
  }
  getLogsByBlockNumber = async (num: BlockNumber): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs where block_number=$1;`, [num])

    return res as Log[]
  }
  getLogsByBlockHash = async (hash: BlockHash): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs where block_hash=$1;`, [hash])

    return res as Log[]
  }
}
