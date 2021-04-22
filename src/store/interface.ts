import {
  ShardID,
  Block,
  Log,
  TransactionHash,
  BlockNumber,
  BlockHash,
  RPCTransactionHarmony,
  RPCStakingTransactionHarmony,
  Transaction,
  StakingTransaction,
} from 'src/types/blockchain'
import {
  Filter,
  TransactionQueryField,
  TransactionQueryValue,
  StakingTransactionQueryQuery,
} from 'src/types'

export interface IStorageBlock {
  addBlock: (block: Block) => Promise<any>
  addBlocks: (blocks: Block[]) => Promise<any>
  getBlockByNumber: (number: BlockNumber) => Promise<Block | null>
  getBlockByHash: (hash: BlockHash) => Promise<Block | null>
  getBlocks: (filter: Filter) => Promise<Block[]>
}

export interface IStorageLog {
  addLog: (block: Log) => Promise<any>
  getLogsByTransactionHash: (transactionHash: TransactionHash) => Promise<Log[] | null>
  getLogsByBlockNumber: (num: BlockNumber) => Promise<Log[] | null>
  getLogsByBlockHash: (hash: BlockHash) => Promise<Log[] | null>
}

export interface IStorageIndexer {
  getLastIndexedBlockNumber: () => Promise<number | null>
  setLastIndexedBlockNumber: (num: BlockNumber) => Promise<any>
  getLastIndexedLogsBlockNumber: () => Promise<number>
  setLastIndexedLogsBlockNumber: (num: BlockNumber) => Promise<any>
}

export interface IStorageTransaction {
  addTransaction: (block: RPCTransactionHarmony) => Promise<any>
  addTransactions: (blocks: RPCTransactionHarmony[]) => Promise<any>
  getTransactionsByField: (
    field: TransactionQueryField,
    value: TransactionQueryValue
  ) => Promise<Transaction[]>
  getTransactions: (filter: Filter) => Promise<Transaction[]>
}

export interface IStorageStakingTransaction {
  addStakingTransaction: (block: RPCStakingTransactionHarmony) => Promise<any>
  addStakingTransactions: (blocks: RPCStakingTransactionHarmony[]) => Promise<any>
  getStakingTransactionsByField: (
    field: StakingTransactionQueryQuery,
    value: TransactionQueryValue
  ) => Promise<StakingTransaction[]>
  getStakingTransactions: (filter: Filter) => Promise<StakingTransaction[]>
}

export interface IStorage {
  block: IStorageBlock
  log: IStorageLog
  transaction: IStorageTransaction
  staking: IStorageStakingTransaction
  indexer: IStorageIndexer
}
