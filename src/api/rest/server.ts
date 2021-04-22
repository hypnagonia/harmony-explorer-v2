import express, {Router} from 'express'
import {config} from 'src/config'
import http, {Server} from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import {logger} from 'src/logger'
import {blockRouter} from 'src/api/rest/routes/block'
import {transactionRouter} from 'src/api/rest/routes/transaction'
import {stakingTransactionRouter} from 'src/api/rest/routes/stakingTransaction'
import {transport} from 'src/api/rest/transport'
const l = logger(module)

export const RESTServer = async () => {
  if (!config.api.rest.isEnabled) {
    l.debug(`RPC API disabled`)
    return
  }

  const api = express()
  api.use(cors())
  api.use(bodyParser.json())
  api.disable('x-powered-by')

  const mainRouter0 = Router({mergeParams: true})
  mainRouter0.use('/block', blockRouter)
  mainRouter0.use('/transaction', transactionRouter)
  mainRouter0.use('/stakingTransaction', stakingTransactionRouter)

  const routerWithShards0 = Router({mergeParams: true})
  routerWithShards0.use('/shard/:shardID', mainRouter0, transport)
  api.use('/v0', routerWithShards0)
  let server: Server

  const close = () => server.close()

  l.info('REST API starting...')
  try {
    server = http.createServer(api).listen(config.api.rest.port, () => {
      l.info(`REST API listening at http://localhost:${config.api.rest.port}`)
    })
  } catch (error) {
    l.error('Error when starting up API', {error})
  }

  return close
}
