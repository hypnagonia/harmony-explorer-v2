import nodeFetch from 'node-fetch'
import {config} from 'src/config'

const IPFSGateway = config.indexer.IPFSGateway

export const getByIPFSHash = async (hash: string, retries = 3) => {
  try {
    return await nodeFetch(`${IPFSGateway}${hash}`).then((r) => r.json())
  } catch (e) {
    if (retries <= 0) {
      throw new Error(e)
    }

    setTimeout(() => getByIPFSHash(hash, retries - 1), 3000)
  }
}
