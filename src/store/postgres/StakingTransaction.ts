import {logger} from 'src/logger'
import {IStorageStakingTransaction} from 'src/store/interface'
import {
  Block,
  BlockHash,
  BlockNumber,
  RPCTransactionHarmony,
  StakingTransaction,
  ShardID,
  RPCStakingTransactionHarmony,
  Transaction,
} from 'src/types/blockchain'
import {normalizeAddress} from 'src/utils/normalizeAddress'
import {Query} from 'src/store/postgres/types'
import {fromSnakeToCamelResponse, generateQuery} from 'src/store/postgres/queryMapper'
import {
  Filter,
  StakingTransactionQueryField,
  TransactionQueryField,
  TransactionQueryValue,
} from 'src/types'
import {buildSQLQuery} from 'src/store/postgres/filters'

export class PostgresStorageStakingTransaction implements IStorageStakingTransaction {
  query: Query
  shardID: ShardID
  constructor(query: Query, shardID: ShardID) {
    this.query = query
    this.shardID = shardID
  }

  addStakingTransactions = async (txs: RPCStakingTransactionHarmony[]) => {
    return Promise.all(txs.map((t) => this.addStakingTransaction(t)))
  }

  addStakingTransaction = async (tx: RPCStakingTransactionHarmony) => {
    // convert one1 to 0x
    // https://docs.harmony.one/home/developers/api/methods/transaction-related-methods/hmy_getstakingtransactionbyblockhashandindex
    const msg = {...tx.msg}
    if (msg.validatorAddress) {
      msg.validatorAddress = normalizeAddress(msg.validatorAddress)
    }
    if (msg.delegatorAddress) {
      msg.delegatorAddress = normalizeAddress(msg.delegatorAddress)
    }

    const newTx = {
      ...tx,
      shard: this.shardID,
      to: normalizeAddress(tx.to),
      from: normalizeAddress(tx.from),
      blockNumber: BigInt(tx.blockNumber).toString(),
      gas: BigInt(tx.gas).toString(),
      gasPrice: BigInt(tx.gasPrice).toString(),
      msg,
    }

    const {query, params} = generateQuery(newTx)
    return await this.query(
      `insert into staking_transactions ${query} on conflict (hash) do nothing;`,
      params
    )
  }

  getStakingTransactionsByField = async (
    field: StakingTransactionQueryField,
    value: TransactionQueryValue
  ): Promise<StakingTransaction[]> => {
    const res = await this.query(`select * from transactions where ${field}=$1;`, [value])
    return res.map(fromSnakeToCamelResponse) as StakingTransaction[]
  }

  getStakingTransactions = async (filter: Filter): Promise<StakingTransaction[]> => {
    const q = buildSQLQuery(filter)
    const res = await this.query(`select * from staking_transactions ${q}`, [])

    return res.map(fromSnakeToCamelResponse)
  }
}
