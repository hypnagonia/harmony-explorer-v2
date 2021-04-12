import {WebSocketRPC} from './WebSocketRPC'
import {Client} from 'rpc-websockets'
import {RPCETHMethod, RPCHarmonyMethod, ShardID} from 'src/types/blockchain'

const poolSize = 1
const pool = Array(poolSize)
  .fill(0)
  .map(() => new WebSocketRPC('wss://ws.s0.b.hmny.io'))

pool.forEach((ws) => ws.connect())

let i = 0
export const WSTransport = (
  shardID: ShardID,
  method: RPCETHMethod | RPCHarmonyMethod,
  params: any[]
) => {
  const ws = pool[i]
  i = i >= poolSize - 1 ? 0 : i + 1
  return ws.call(method, params)
}
