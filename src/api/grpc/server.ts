import grpc from 'grpc'
import path from 'path'
import {loadSync} from '@grpc/proto-loader'
import * as controllers from 'src/api/controllers'

const protoFile = path.join(__dirname, 'proto', './api.proto')
import {logger} from 'src/logger'

const l = logger(module)
/*
cli
grpc_cli --protofiles=src/api/grpc/proto/api.proto call 127.0.0.1:5051 GetBlockByNumber "blockNumber: '1'"

You can then generate the types like so:
./node_modules/.bin/proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=proto/ proto/*.proto
*/

export const RPCServer = async () => {
  const packageDefinition = loadSync(protoFile, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
  })

  const proto = grpc.loadPackageDefinition(packageDefinition)

  const server = new grpc.Server()

  // @ts-ignore
  server.addService(proto.APIService.service, {
    GetBlockByNumber: async (
      call: grpc.ServerUnaryCall<any>,
      callback: grpc.sendUnaryData<any>
    ) => {
      const blockNumber = +call.request.blockNumber

      try {
        const block = await controllers.getBlockByNumber(0, blockNumber)
        callback(null, block)
      } catch (e) {
        callback(
          {
            name: 'Error',
            code: grpc.status.NOT_FOUND,
            message: e.message,
          },
          null
        )
      }
    },
  })

  server.bind('127.0.0.1:5051', grpc.ServerCredentials.createInsecure())
  l.info('RPC API listening at localhost:5051')
  await server.start()
}
