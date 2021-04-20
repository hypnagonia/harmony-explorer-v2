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
  RPCBlockHarmony,
  RPCTransactionHarmony,
  Topic,
  Address,
  BlockNumber,
  Log,
} from 'types/blockchain'

const mapBlockFromResponse = (block: RPCBlockHarmony): Block => {
  // todo
  if (parseInt(block.number, 16) === 12003009) {
    // console.log(block)
    // process.exit(0)
  }

  // @ts-ignore
  return {
    ...block,
    number: parseInt(block.number, 16),
  } as Block
}

export const getBlocks = (
  shardID: ShardID,
  fromBlock: BlockNumber,
  toBlock: BlockNumber,
  fullTx = true,
  withSigners = false,
  inclStaking = true
): Promise<Block[]> => {
  const from = '0x' + fromBlock.toString(16)
  const to = '0x' + toBlock.toString(16)
  const o = {
    fullTx,
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
  return transport(shardID, 'eth_getTransactionByHash', [hash])
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

// todo
export const getBalance = () => {}

export const getTransactionTrace = (
  shardID: ShardID,
  hash: TransactionHash,
  tracer: 'callTracer' = 'callTracer'
): Promise<RPCTransactionHarmony> => {
  return transport(shardID, 'debug_traceTransaction', [hash, {tracer}])
}
