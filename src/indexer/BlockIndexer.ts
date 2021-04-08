import {config} from 'src/indexer/config'
import * as RPCClient from 'src/indexer/rpc/client'
import {urls, RPCUrls} from 'src/indexer/rpc/RPCUrls'
import {ShardID, Block} from 'src/types/blockchain'

import {logger} from 'src/logger'
import LoggerModule from 'zerg/dist/LoggerModule'
import {store} from 'src/store'

const approximateBlockMintingTime = 2000

const range = (num: number) => Array(num).fill(0)

export class BlockIndexer {
  readonly shardID: ShardID
  private currentHeight: number
  private l: LoggerModule
  private batchCount = config.indexer.batchCount

  constructor(shardID: ShardID) {
    this.l = logger(module, `shard${shardID}`)
    this.shardID = shardID
    // todo
    this.currentHeight = config.indexer.initialBlockSyncingHeight
    this.l.info('Created')
  }

  increaseBatchCount = () => {
    this.batchCount = Math.ceil(this.batchCount * 1.1)

    if (this.batchCount > config.indexer.batchCount * 10) {
      this.batchCount = config.indexer.batchCount
    } else {
      this.l.info(`Batch increased to ${this.batchCount}`)
    }
  }

  decreaseBatchCount = () => {
    this.batchCount = ~~(this.batchCount * 0.9)
    if (this.batchCount < 1) {
      this.batchCount = 1
    } else {
      this.l.info(`Batch decreased to ${this.batchCount}`)
    }
  }

  loop = async () => {
    try {
      const now = Date.now()
      const failedCountBefore = RPCUrls.getFailedCount(this.shardID)
      const latestSyncedBlock = await store.getLatestBlockNumber(this.shardID)

      if (latestSyncedBlock) {
        this.currentHeight = latestSyncedBlock
      }

      const latestBlockchainBlock = (
        await RPCClient.getBlockByNumber(this.shardID, 'latest', false)
      ).number

      const res = await Promise.all(
        range(this.batchCount).map((_, i) => {
          const height = this.currentHeight + i
          if (height <= latestBlockchainBlock) {
            return RPCClient.getBlockByNumber(this.shardID, height)
          }

          return Promise.resolve(null)
        })
      )

      const blocks = res.filter((b) => b).sort((a, b) => a!.number - b!.number) as Block[]

      const failedCount = RPCUrls.getFailedCount(this.shardID) - failedCountBefore

      this.l.info(
        `Fetched [${this.currentHeight}, ${this.currentHeight + blocks.length}] ${
          blocks.length
        } blocks. Done in ${Date.now() - now}ms. Failed requests ${failedCount}`
      )
      this.currentHeight += blocks.length

      const u = urls[this.shardID]
      console.log({
        stats: u.map((s) => s.totalQueries),
        fails: u.map((s) => s.failedRequests),
      })
      u.forEach((a) => {
        a.totalQueries = 0
      })

      const now2 = Date.now()
      await store.addBlocks(this.shardID, blocks)
      this.l.info(`Saved to store. Done in ${Date.now() - now2}ms`)

      if (blocks.length === this.batchCount) {
        if (failedCount > 0) {
          this.decreaseBatchCount()
        } else {
          this.increaseBatchCount()
        }

        process.nextTick(this.loop)
      } else {
        this.decreaseBatchCount()
        setTimeout(this.loop, approximateBlockMintingTime)
      }
    } catch (e) {
      this.decreaseBatchCount()
      setTimeout(this.loop, approximateBlockMintingTime)
    }
  }
}
