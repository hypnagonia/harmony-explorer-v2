import {logger} from './logger'
import * as RPCClient from './indexer/rpc/client'

const l = logger(module)
l.info('hey')

const run = async () => {
  const res = await RPCClient.getBlockByNumber(4000000)
  console.log({res})
}

run()
