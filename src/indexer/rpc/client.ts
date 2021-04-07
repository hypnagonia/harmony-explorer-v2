import {fetch} from './fetch'
import {RPCETHMethod, RPCHarmonyMethod} from 'types/blockchain'

// todo url block type
export const getBlockByNumber = (num: number | 'latest') => {
  return fetch('https://api.s0.b.hmny.io', 'eth_getBlockByNumber', [num])
}
