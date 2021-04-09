import {ShardID, Block, Log, TransactionHash, BlockNumber, BlockHash} from 'src/types/blockchain'

export interface IStorageBlock {
  addBlock: (shardId: ShardID, block: Block) => Promise<any>
  addBlocks: (shardId: ShardID, blocks: Block[]) => Promise<any>
  getBlockByNumber: (shardId: ShardID, number: BlockNumber) => Promise<Block | null>
  getBlockByHash: (shardId: ShardID, hash: BlockHash) => Promise<Block | null>
  getLastIndexedBlockNumber: (shardId: ShardID) => Promise<number | null>
  setLastIndexedBlockNumber: (shardId: ShardID, num: BlockNumber) => Promise<any>
}

export interface IStorageLog {
  addLog: (shardId: ShardID, block: Log) => Promise<any>
  getLogsByTransactionHash: (
    shardId: ShardID,
    transactionHash: TransactionHash
  ) => Promise<Log[] | null>
  getLogsByBlockNumber: (shardId: ShardID, num: BlockNumber) => Promise<Log[] | null>
  getLogsByBlockHash: (shardId: ShardID, hash: BlockHash) => Promise<Log[] | null>
  getLastIndexedLogsBlockNumber: (shardId: ShardID) => Promise<number>
  setLastIndexedLogsBlockNumber: (shardId: ShardID, num: BlockNumber) => Promise<any>
}

export interface IStorage {
  block: IStorageBlock
  log: IStorageLog
}
