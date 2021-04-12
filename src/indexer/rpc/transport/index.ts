import {HTTPTransport} from './http/fetch'
import {WSTransport} from './ws'
import {config} from 'src/indexer/config'

export const transport = config.indexer.rpc.transport === 'http' ? HTTPTransport : WSTransport
