import http from 'http'
import express from 'express'
import {config} from 'src/config'
import {logger} from 'src/logger'
import {stores} from 'src/store'

const l = logger(module)

export const indexerServer = async () => {
  if (!config.indexer.infoWebServer.isEnabled) {
    l.debug(`Indexer info web server disabled`)
    return
  }

  const api = express()
  const server = http.createServer(api)

  api.get('/', async (req, res) => {
    const shards = config.indexer.shards

    const lastSyncedBlocks = await Promise.all(
      shards.map(async (shardID) => {
        const blockNumber = await stores[shardID].indexer.getLastIndexedBlockNumber()

        return {shardID, blockNumber}
      })
    )
    const state = {lastSyncedBlocks}

    // be sure to remove passwords etc
    const json = {config: {...config, store: {}}, state}
    res.json(json)
  })

  const close = () => server.close()

  server.listen(config.indexer.infoWebServer.port, () => {
    l.info(
      `Indexer info web server listening at http://localhost:${config.indexer.infoWebServer.port}`
    )
  })

  return close
}
