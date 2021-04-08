import {fetch} from './fetch'
import {
  RPCETHMethod,
  RPCHarmonyMethod,
  Block,
  RPCBlock,
  ShardID,
  TransactionHarmony,
  TransactionHash,
  RPCTransaction,
  RPCTransactionHarmony,
  Topic,
  Address,
  BlockNumber,
} from 'types/blockchain'

const mapBlockFromResponse = (block: RPCBlock): Block => {
  return {
    block,
    number: parseInt(block.number, 16),
    timestamp: new Date(parseInt(block.timestamp, 16)),
  }
}

export const getBlockByNumber = (
  shardID: ShardID,
  num: BlockNumber | 'latest',
  isFullInfo = true
): Promise<Block> => {
  return fetch(shardID, 'eth_getBlockByNumber', [num, isFullInfo]).then(mapBlockFromResponse)
}

export const getTransactionByHash = (
  shardID: ShardID,
  hash: TransactionHash
): Promise<RPCTransactionHarmony> => {
  return fetch(shardID, 'eth_getTransactionByHash', [hash])
}

export const getLogs = (
  shardID: ShardID,
  fromBlock: BlockNumber,
  toBlock: BlockNumber,
  address?: Address,
  topics?: Topic[]
): Promise<RPCTransactionHarmony> => {
  const o = {
    topics,
    address,
    fromBlock: fromBlock.toString(16),
    toBlock: toBlock.toString(16),
  }
  return fetch(shardID, 'eth_getLogs', [o])
}
