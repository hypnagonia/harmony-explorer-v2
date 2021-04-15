import {RESTServer} from 'src/api/rest/server'
import {RPCServer} from 'src/api/grpc/server'
import {webSocketServer} from 'src/api/webSocket/server'

export const api = async () => {
  // await RESTServer()
  // await RPCServer()
  await webSocketServer()
}
