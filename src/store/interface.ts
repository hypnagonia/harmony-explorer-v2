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
} from 'src/types/blockchain'
import {Filter, TransactionQueryField, TransactionQueryValue} from 'src/types'

export interface IStorageBlock {
  addBlock: (shardId: ShardID, block: Block) => Promise<any>
  addBlocks: (shardId: ShardID, blocks: Block[]) => Promise<any>
  getBlockByNumber: (shardId: ShardID, number: BlockNumber) => Promise<Block | null>
  getBlockByHash: (shardId: ShardID, hash: BlockHash) => Promise<Block | null>
  getBlocks: (shardID: ShardID, filter: Filter) => Promise<Block[]>
}

export interface IStorageLog {
  addLog: (shardId: ShardID, block: Log) => Promise<any>
  getLogsByTransactionHash: (
    shardId: ShardID,
    transactionHash: TransactionHash
  ) => Promise<Log[] | null>
  getLogsByBlockNumber: (shardId: ShardID, num: BlockNumber) => Promise<Log[] | null>
  getLogsByBlockHash: (shardId: ShardID, hash: BlockHash) => Promise<Log[] | null>
}

export interface IStorageIndexer {
  getLastIndexedBlockNumber: (shardId: ShardID) => Promise<number | null>
  setLastIndexedBlockNumber: (shardId: ShardID, num: BlockNumber) => Promise<any>
  getLastIndexedLogsBlockNumber: (shardId: ShardID) => Promise<number>
  setLastIndexedLogsBlockNumber: (shardId: ShardID, num: BlockNumber) => Promise<any>
}

export interface IStorageTransaction {
  addTransaction: (shardId: ShardID, block: RPCTransactionHarmony) => Promise<any>
  addTransactions: (shardId: ShardID, blocks: RPCTransactionHarmony[]) => Promise<any>
  getTransactionByField: (
    shardID: ShardID,
    field: TransactionQueryField,
    value: TransactionQueryValue
  ) => Promise<Transaction | null>
}

export interface IStorageStakingTransaction {
  addStakingTransaction: (shardId: ShardID, block: RPCStakingTransactionHarmony) => Promise<any>
  addStakingTransactions: (shardId: ShardID, blocks: RPCStakingTransactionHarmony[]) => Promise<any>
}

// todo shardID redundant
export interface IStorage {
  block: IStorageBlock
  log: IStorageLog
  transaction: IStorageTransaction
  staking: IStorageStakingTransaction
  indexer: IStorageIndexer
}
