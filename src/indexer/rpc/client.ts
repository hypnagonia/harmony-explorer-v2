import {fetch} from './fetch'
import {
  RPCETHMethod,
  RPCHarmonyMethod,
  Block,
  RPCBlock,
  ShardID,
  txHash,
  txHashHarmony,
  RPCTransaction,
  RPCTransactionHarmony,
} from 'types/blockchain'

// todo url

const mapBlockFromResponse = (block: RPCBlock): Block => {
  return {
    block,
    number: parseInt(block.number, 16),
    timestamp: new Date(parseInt(block.timestamp, 16)),
  }
}

export const getBlockByNumber = (
  shardID: ShardID,
  num: number | 'latest',
  isFullInfo = true
): Promise<Block> => {
  return fetch(shardID, 'eth_getBlockByNumber', [num, isFullInfo]).then(mapBlockFromResponse)
}

export const getTransactionByHash = (
  shardID: ShardID,
  hash: txHash
): Promise<RPCTransactionHarmony> => {
  return fetch(shardID, 'hmy_getTransactionByHash', [hash])
}
