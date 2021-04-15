import {RESTServer} from 'src/api/rest/server'
import {RPCServer} from 'src/api/grpc/server'

export const api = async () => {
  await RESTServer()
  await RPCServer()
}
