import {WebSocketRPC} from './WebSocketRPC'
import {RPCETHMethod, RPCHarmonyMethod, ShardID} from 'src/types/blockchain'
import {config} from 'src/config'

const lazyConnection = (shardID: ShardID, url: string) => {
  let connection: WebSocketRPC | null = null
  return {
    getConnection: () => connection,
    connect: () => (connection = new WebSocketRPC(shardID as ShardID, url)),
  }
}

const connections =
  config.indexer.rpc.transport === 'ws'
    ? config.indexer.rpc.urls.map((list, shardID) =>
        list.map((url) => lazyConnection(shardID as ShardID, url))
      )
    : []

const connectionIndexes: ShardID[] = config.indexer.rpc.urls.map((_, shardID) => 0)
const getConnectionIndex = (shardID: ShardID) => {
  const res = connectionIndexes[shardID]
  connectionIndexes[shardID]++
  if (connectionIndexes[shardID] === connections[shardID].length) {
    connectionIndexes[shardID] = 0
  }
  return res
}

export const WSTransport = (
  shardID: ShardID,
  method: RPCETHMethod | RPCHarmonyMethod,
  params: any[]
) => {
  const c = connections[shardID][getConnectionIndex(shardID)]

  if (c.getConnection() === null) {
    c.connect()
  }

  return c.getConnection()!.call(method, params)
}
