import {Client} from 'rpc-websockets'
import {logger} from 'src/logger'
import LoggerModule from 'zerg/dist/LoggerModule'
import {RPCUrls} from '../../RPCUrls'
import {ShardID} from 'src/types/blockchain'

const callTimeout = 20000
const defaultRetries = 3
const timeoutPromise = () =>
  new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(new Error(`Websocket did not respond ${defaultRetries} times in ${callTimeout}ms`)),
      callTimeout
    )
  )
const sleep = () => new Promise((r) => setTimeout(r, 1000))

export class WebSocketRPC {
  readonly url: string
  ws: Client
  l: LoggerModule
  open = false
  shardID: ShardID

  constructor(shardID: ShardID, url: string) {
    this.shardID = shardID
    this.url = url
    this.l = logger(module, url)
    this.ws = new Client(this.url, {max_reconnects: 0})
    this.ws.on('error', this.onError)
    this.ws.on('close', this.onClose)
    this.ws.on('open', this.onOpen)
  }

  call = (method: string, params: any[], retries = defaultRetries): Promise<any> => {
    const retryPromise = () =>
      sleep().then(() => {
        return this.call(method, params, retries)
      })

    if (!this.open) {
      return retryPromise()
    }

    const catchPromise = (err: any) => {
      // console.log(err, params)
      // this.l.debug('Call error', { err })
      retries--
      if (retries === 0) {
        throw new Error(JSON.stringify(err))
      }

      RPCUrls.getURL(this.shardID).submitStatistic(0, true)
      return retryPromise()
    }

    return Promise.race([this.ws.call(method, params), timeoutPromise()]).catch(catchPromise)
  }

  private onError = (err: any) => {
    this.open = false
    RPCUrls.getURL(this.shardID).submitStatistic(0, true)
    this.l.debug(`Error ${err.message || JSON.stringify(err)}`)
  }

  private onClose = () => {
    this.l.warn('Closed')
    this.open = false
  }

  private onOpen = () => {
    this.open = true
    this.l.info(`Open`)
  }
}
