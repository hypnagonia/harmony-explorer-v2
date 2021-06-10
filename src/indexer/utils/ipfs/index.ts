import nodeFetch from 'node-fetch'
import {config} from 'src/config'

const IPFSGateway = config.indexer.IPFSGateway

export const getByIPFSHash = (hash: string) => {
  return nodeFetch(`${IPFSGateway}${hash}`).then((r) => r.json())
}
