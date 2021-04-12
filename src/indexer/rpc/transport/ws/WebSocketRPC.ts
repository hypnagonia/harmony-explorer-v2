import {Client} from 'rpc-websockets'
import {logger} from 'src/logger'
import LoggerModule from 'zerg/dist/LoggerModule'
import {RPCUrls} from '../../RPCUrls'

const callTimeout = 10000
const timeoutPromise = () => new Promise((_, reject) => setTimeout(reject, callTimeout))
const sleep = () => new Promise((r) => setTimeout(r, 1000))

export class WebSocketRPC {
  readonly url: string
  ws: Client | undefined
  l: LoggerModule
  open = false

  constructor(url: string) {
    this.url = url
    this.l = logger(module, url)
    this.ws = new Client(this.url, {max_reconnects: 0})
    this.ws.on('error', this.onError)
    this.ws.on('close', this.onClose)
    this.ws.on('open', this.onOpen)
    // this.connect()
  }

  connect = () => {
    this.open = false
  }

  call = (method: string, params: any[]): Promise<any> => {
    const retryPromise = () =>
      sleep().then(() => {
        return this.call(method, params)
      })

    if (!this.open) {
      return retryPromise()
    }

    const catchPromise = (err: any) => {
      // this.l.debug('Call error', { err })
      // todo
      RPCUrls.getURL(0).submitStatistic(0, true)
      return retryPromise()
    }

    return Promise.race([this.ws!.call(method, params), timeoutPromise()]).catch(catchPromise)
  }

  private onError = (err: any) => {
    this.open = false
    RPCUrls.getURL(0).submitStatistic(0, true)
    this.l.debug(`Error ${err.message || JSON.stringify(err)}`)
    // this.ws!.close()
    // return sleep().then(this.connect)
  }

  private onClose = () => {
    this.l.debug('Closed')
    this.open = false
    // return this.connect()
  }

  private onOpen = () => {
    this.open = true
    this.l.debug(`Open`)
  }
}
