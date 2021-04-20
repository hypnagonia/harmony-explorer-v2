import {logger} from 'src/logger'
import {IStorageStakingTransaction} from 'src/store/interface'
import {
  Block,
  BlockHash,
  BlockNumber,
  RPCTransactionHarmony,
  ShardID,
  RPCStakingTransactionHarmony,
} from 'src/types/blockchain'
import {normalizeAddress} from 'src/utils/normalizeAddress'
import {Query} from 'src/store/postgres/types'
import {generateQuery} from 'src/store/postgres/queryMapper'

export class PostgresStorageStakingTransaction implements IStorageStakingTransaction {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  addStakingTransactions = async (shardID: ShardID, txs: RPCStakingTransactionHarmony[]) => {
    return Promise.all(txs.map((t) => this.addStakingTransaction(shardID, t)))
  }

  addStakingTransaction = async (shardID: ShardID, tx: RPCStakingTransactionHarmony) => {
    const newTx = {
      ...tx,
      shard: shardID,
      to: normalizeAddress(tx.to),
      from: normalizeAddress(tx.from),
      blockNumber: BigInt(tx.blockNumber).toString(),
      gas: BigInt(tx.gas).toString(),
      gasPrice: BigInt(tx.gasPrice).toString(),
    }

    const {query, params} = generateQuery(newTx)
    return await this.query(
      `insert into staking_transactions ${query} on conflict (hash) do nothing;`,
      params
    )
  }
}
