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
  Address2Transaction,
  InternalTransaction,
} from 'src/types/blockchain'
import {
  Filter,
  TransactionQueryField,
  TransactionQueryValue,
  StakingTransactionQueryField,
  InternalTransactionQueryField,
  TablePaginatorTableNames,
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
  getChainID: () => Promise<number>
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

export interface IStorageContract {}

export interface IStorageStakingTransaction {
  addStakingTransaction: (block: RPCStakingTransactionHarmony) => Promise<any>
  addStakingTransactions: (blocks: RPCStakingTransactionHarmony[]) => Promise<any>
  getStakingTransactionsByField: (
    field: StakingTransactionQueryField,
    value: TransactionQueryValue
  ) => Promise<StakingTransaction[]>
  getStakingTransactions: (filter: Filter) => Promise<StakingTransaction[]>
}

export interface IStorageInternalTransaction {
  getInternalTransactionsByField: (
    field: InternalTransactionQueryField,
    value: TransactionQueryValue
  ) => Promise<InternalTransaction[]>
}

export interface IStorageAddress {
  addAddress2Transaction: (entry: Address2Transaction) => Promise<any>
}

export interface IStorage {
  block: IStorageBlock
  log: IStorageLog
  transaction: IStorageTransaction
  staking: IStorageStakingTransaction
  indexer: IStorageIndexer
  internalTransaction: IStorageInternalTransaction
  address: IStorageAddress
  contract: IStorageContract
  getTablePage: (
    table: TablePaginatorTableNames,
    fromBlock: number,
    toBlock: number | 'latest',
    limit?: number
  ) => Promise<any>
}
