import {RESTServer} from 'src/api/rest/server'
import {GRPCServer} from 'src/api/grpc/server'
import {webSocketServer} from 'src/api/webSocket/server'

export const api = async () => {
  await RESTServer()
  await GRPCServer()
  await webSocketServer()
}
