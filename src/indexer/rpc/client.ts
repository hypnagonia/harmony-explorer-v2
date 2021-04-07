import {fetch} from './fetch'
import {RPCETHMethod, RPCHarmonyMethod, Block, RPCBlock} from 'types/blockchain'

// todo url

const mapBlockFromResponse = (block: RPCBlock): Block => {
  return {
    block,
    number: parseInt(block.number, 16),
    timestamp: parseInt(block.timestamp, 16),
  }
}

export const getBlockByNumber = (num: number | 'latest', isFullInfo = true): Promise<Block> => {
  return fetch('https://api.s0.b.hmny.io', 'hmy_getBlockByNumber', [num, isFullInfo]).then(
    mapBlockFromResponse
  )
}
