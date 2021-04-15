import {Socket} from 'socket.io'
import http from 'http'
import express from 'express'
import {config} from 'src/config'
import {logger} from 'src/logger'
import * as controllers from 'src/api/controllers'
import {getMethods} from './utils'

const l = logger(module)

const runMethod: (
  method: string,
  params: any[]
) => Promise<{event: string; response: any}> = async (method: string, params: any[]) => {
  try {
    // @ts-ignore
    const f = controllers[method]
    if (!f) {
      throw new Error('Method unknown')
    }

    const response = await f(...params)
    return {event: 'Response', response}
  } catch (error) {
    return {event: 'Error', response: error.message || error}
  }
}

export const webSocketServer = async () => {
  if (!config.api.ws.isEnabled) {
    l.debug(`WebSocket API disabled`)
    return
  }

  const methods = getMethods()

  const api = express()
  const server = http.createServer(api)
  const io = require('socket.io')(server)

  io.on('connection', (socket: Socket) => {
    if (config.api.ws.isDemoHTMLPageEnabled) {
      socket.emit('MethodList', JSON.stringify(methods))
    }

    socket.onAny(async (event, params) => {
      const res = await runMethod(event, params)
      socket.emit(res.event, JSON.stringify(res.response))
    })
  })

  if (config.api.ws.isDemoHTMLPageEnabled) {
    l.info(
      `Demo WebSocket client is available at http://localhost:${config.api.ws.port}/index.html`
    )
    api.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html')
    })
  }

  server.listen(config.api.ws.port, () => {
    l.info(`WebSocket API listening at ws://localhost:${config.api.ws.port}`)
  })
}
