import {fetch} from './fetch'
import {RPCETHMethod, RPCHarmonyMethod, Block, RPCBlock, ShardID} from 'types/blockchain'

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
  return fetch(shardID, 'hmy_getBlockByNumber', [num, isFullInfo]).then(mapBlockFromResponse)
}
