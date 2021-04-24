import {logger} from 'src/logger'
import {IStorageInternalTransaction} from 'src/store/interface'
import {
  Block,
  BlockHash,
  TransactionQueryField,
  TransactionQueryValue,
  RPCTransactionHarmony,
  ShardID,
  Transaction,
  Filter,
  InternalTransaction,
  TransactionHash,
} from 'src/types'
import {normalizeAddress} from 'src/utils/normalizeAddress'
import {Query} from 'src/store/postgres/types'
import {fromSnakeToCamelResponse, generateQuery} from 'src/store/postgres/queryMapper'
import {buildSQLQuery} from 'src/store/postgres/filters'

export class PostgresStorageInternalTransaction implements IStorageInternalTransaction {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  addInternalTransaction = async (tx: InternalTransaction) => {
    const newTx = {
      ...tx,
      blockHash: undefined,
      value: BigInt(tx.value).toString(),
      gas: BigInt(tx.gas).toString(),
      gasUsed: BigInt(tx.gasUsed).toString(),
    }

    const {query, params} = generateQuery(newTx)
    return await this.query(
      `insert into internal_transactions ${query} on conflict (transaction_hash, index) do nothing;`,
      params
    )
  }
}
