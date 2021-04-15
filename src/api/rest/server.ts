import express, {Router} from 'express'
import {config} from 'src/config'
import http, {Server} from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import {logger} from 'src/logger'
import {blockRouter} from 'src/api/rest/routes/block'
import {transport} from 'src/api/rest/transport'

export const RESTServer = async () => {
  const l = logger(module)
  const api = express()
  api.use(cors())
  api.use(bodyParser.json())
  api.disable('x-powered-by')

  const mainRouter = Router({mergeParams: true})
  mainRouter.use('/block', blockRouter)
  api.use('/shard/:shardID', mainRouter, transport)

  let server: Server

  const close = () => server.close()

  l.info('REST API starting...')
  try {
    server = http.createServer(api).listen(config.api.port, () => {
      l.info(`REST API listening at http://localhost:${config.api.port}`)
    })
  } catch (error) {
    l.error('Error when starting up API', {error})
  }

  return close
}
