import {transport} from './transport'
import {config} from 'src/config'
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
  InternalTransaction,
} from 'types/blockchain'
import {mapBlockFromResponse, mapInternalTransactionFromBlockTrace} from './mappers'

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
    // disable including staking txs for main net before 3358745 where implemented
    inclStaking: config.indexer.chainID === 'mainnet' && +to >= 3358745 ? inclStaking : false,
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
): Promise<InternalTransaction> => {
  return transport(shardID, 'debug_traceTransaction', [hash, {tracer}])
}

export const traceBlock = (shardID: ShardID, num: BlockNumber): Promise<InternalTransaction[]> => {
  // this block always fails
  if (config.indexer.chainID === 'mainnet' && num === 4864036) {
    return Promise.resolve([])
  }

  const hex = '0x' + num.toString(16)
  return transport(shardID, 'trace_block', [hex]).then((txs) =>
    txs.map(mapInternalTransactionFromBlockTrace)
  )
}
