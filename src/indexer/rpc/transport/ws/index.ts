import {WebSocketRPC} from './WebSocketRPC'
import {RPCETHMethod, RPCHarmonyMethod, ShardID} from 'src/types/blockchain'
import {config} from 'src/indexer/config'

const connections =
  config.indexer.rpc.transport === 'ws'
    ? config.indexer.rpc.urls.map((list, shardID) =>
        list.map((url) => new WebSocketRPC(shardID as ShardID, url))
      )
    : []

connections.forEach((pool) => pool.forEach((c) => c.connect()))

export const WSTransport = (
  shardID: ShardID,
  method: RPCETHMethod | RPCHarmonyMethod,
  params: any[]
) => {
  // todo robin round pool of ws connections, lazy init
  const ws = connections[shardID][0]
  return ws.call(method, params)
}
