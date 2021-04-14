import express, {Router} from 'express'
import {config} from 'src/config'
import http, {Server} from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'
import {logger} from 'src/logger'
import {blockRouter} from 'src/api/server/routes/block'
import {transport} from 'src/api/server/transport'

export const api = async () => {
  const l = logger(module)
  const api = express()
  api.use(cors())
  api.use(bodyParser.json())
  api.disable('x-powered-by')

  const mainRouter = Router({mergeParams: true})
  mainRouter.use('/block', blockRouter)
  // @ts-ignore
  api.use('/shard/:shardID', mainRouter, transport)

  let server: Server

  const close = () => server.close()

  return new Promise((resolve, reject) => {
    l.info('API starting...')
    try {
      server = http.createServer(api).listen(config.api.port, () => {
        l.info(`API is listening http://localhost:${config.api.port}`)
        resolve()
      })
    } catch (error) {
      l.error('Error when starting up API', {error})
      reject(error)
    }

    return close
  })
}
