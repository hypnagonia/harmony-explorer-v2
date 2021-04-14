import {HTTPTransport} from './http/fetch'
import {WSTransport} from './ws'
import {config} from 'src/config'
import {logger} from 'src/logger'

const l = logger(module)

const isHTTP = config.indexer.rpc.transport === 'http'
l.info(`RPC transport: ${isHTTP ? 'HTTP' : 'Websocket'}`)
export const transport = isHTTP ? HTTPTransport : WSTransport
