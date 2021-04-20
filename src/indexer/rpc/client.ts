import {transport} from './transport'
import {
  RPCETHMethod,
  RPCHarmonyMethod,
  Block,
  RPCBlock,
  ShardID,
  TransactionHarmonyHash,
  TransactionHash,
  RPCTransaction,
  RPCTransactionHarmony,
  Topic,
  Address,
  BlockNumber,
  Log,
} from 'types/blockchain'

const mapBlockFromResponse = (block: RPCBlock): Block => {
  // @ts-ignore
  return {
    ...block,
    number: parseInt(block.number, 16),
    transactionsInEthHash: undefined,
  } as Block
}

export const getBlocks = (
  shardID: ShardID,
  fromBlock: BlockNumber,
  toBlock: BlockNumber,
  isFullInfo = true,
  withSigners = false,
  inclStaking = true
): Promise<Block[]> => {
  const from = '0x' + fromBlock.toString(16)
  const to = '0x' + toBlock.toString(16)
  const o = {
    isFullInfo,
    withSigners,
    inclStaking,
  }
  return transport(shardID, 'hmy_getBlocks', [from, to, o]).then((blocks) =>
    blocks.map(mapBlockFromResponse)
  )
}

export const getBlockByNumber = (
  shardID: ShardID,
  num: BlockNumber | 'latest',
  isFullInfo = true
): Promise<Block> => {
  return transport(shardID, 'eth_getBlockByNumber', [num, isFullInfo]).then(mapBlockFromResponse)
}

export const getTransactionByHash = (
  shardID: ShardID,
  hash: TransactionHash
): Promise<RPCTransactionHarmony> => {
  return transport(shardID, 'hmy_getTransactionByHash', [hash])
}

export const getLogs = (
  shardID: ShardID,
  fromBlock: BlockNumber,
  toBlock: BlockNumber,
  address?: Address,
  topics?: Topic[]
): Promise<Log[]> => {
  const o = {
    topics,
    address,
    fromBlock: '0x' + fromBlock.toString(16),
    toBlock: '0x' + toBlock.toString(16),
  }
  return transport(shardID, 'eth_getLogs', [o])
}
