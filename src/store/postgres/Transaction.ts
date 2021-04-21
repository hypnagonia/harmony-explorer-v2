import {logger} from 'src/logger'
import {IStorageTransaction} from 'src/store/interface'
import {
  Block,
  BlockHash,
  TransactionQueryField,
  TransactionQueryValue,
  RPCTransactionHarmony,
  ShardID,
  Transaction,
} from 'src/types'
import {normalizeAddress} from 'src/utils/normalizeAddress'
import {Query} from 'src/store/postgres/types'
import {fromSnakeToCamelResponse, generateQuery} from 'src/store/postgres/queryMapper'

export class PostgresStorageTransaction implements IStorageTransaction {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  getTransactionByField = async (
    shardID: ShardID,
    field: TransactionQueryField,
    value: TransactionQueryValue
  ): Promise<Transaction | null> => {
    const res = await this.query(`select * from transactions where ${field} = $1;`, [value])

    return fromSnakeToCamelResponse(res[0]) as Transaction
  }

  addTransactions = async (shardID: ShardID, txs: RPCTransactionHarmony[]) => {
    return Promise.all(txs.map((t) => this.addTransaction(shardID, t)))
  }

  addTransaction = async (shardID: ShardID, tx: RPCTransactionHarmony) => {
    const newTx = {
      ...tx,
      hash: tx.ethHash,
      hash_harmony: tx.hash,
      to: normalizeAddress(tx.to),
      from: normalizeAddress(tx.from),
      ethHash: undefined,
      blockNumber: BigInt(tx.blockNumber).toString(),
      value: BigInt(tx.value).toString(),
      gas: BigInt(tx.gas).toString(),
      gasPrice: BigInt(tx.gasPrice).toString(),
    }

    const {query, params} = generateQuery(newTx)
    return await this.query(
      `insert into transactions ${query} on conflict (hash) do nothing;`,
      params
    )
  }
}
