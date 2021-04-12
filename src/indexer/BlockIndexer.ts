import * as RPCClient from 'src/indexer/rpc/client'
import {urls, RPCUrls} from 'src/indexer/rpc/RPCUrls'
import {ShardID, Block, BlockNumber} from 'src/types/blockchain'

import {logger} from 'src/logger'
import LoggerModule from 'zerg/dist/LoggerModule'
import {store} from 'src/store'
import {logTime} from 'src/utils/logTime'

const approximateBlockMintingTime = 2000
const maxBatchCount = 5000

const range = (num: number) => Array(num).fill(0)

export class BlockIndexer {
  readonly shardID: ShardID
  private currentHeight: number
  private l: LoggerModule
  private batchCount: number

  constructor(shardID: ShardID, batchCount: number = maxBatchCount, startHeight: number) {
    this.l = logger(module, `shard${shardID}`)
    this.shardID = shardID
    this.currentHeight = startHeight
    this.batchCount = batchCount
    this.l.info('Created')
  }

  increaseBatchCount = () => {
    this.batchCount = Math.min(Math.ceil(this.batchCount * 1.1), maxBatchCount)
    this.l.debug(`Batch increased to ${this.batchCount}`)
  }

  decreaseBatchCount = () => {
    this.batchCount = Math.max(~~(this.batchCount * 0.9), 1)
    this.l.debug(`Batch decreased to ${this.batchCount}`)
  }

  loop = async () => {
    try {
      const shardID = this.shardID
      const batchTime = logTime()
      const failedCountBefore = RPCUrls.getFailedCount(shardID)
      const latestSyncedBlock = await store.indexer.getLastIndexedBlockNumber(shardID)

      if (latestSyncedBlock) {
        this.currentHeight = latestSyncedBlock + 1
      }

      const latestBlockchainBlock = (await RPCClient.getBlockByNumber(shardID, 'latest', false))
        .number

      const getBlock = (num: BlockNumber) => {
        return RPCClient.getBlockByNumber(shardID, num)
      }

      const addBlock = async (block: Block) => {
        await store.block.addBlock(shardID, block)
        return block
      }

      const res = await Promise.all(
        range(this.batchCount).map((_, i) => {
          const num = this.currentHeight + i
          if (num <= latestBlockchainBlock) {
            return getBlock(num).then(addBlock)
          }

          return Promise.resolve(null)
        })
      )

      const blocks = res.filter((b) => b) as Block[]
      const lastFetchedBlockNumber = blocks.reduce((a, b) => (a < b.number ? b.number : a), 0)

      const failedCount = RPCUrls.getFailedCount(shardID) - failedCountBefore

      await store.indexer.setLastIndexedBlockNumber(shardID, lastFetchedBlockNumber)

      this.l.info(
        `Processed [${this.currentHeight}, ${lastFetchedBlockNumber}] ${
          blocks.length
        } blocks. Done in ${batchTime()}. Failed requests ${failedCount}`
      )

      const u = urls[shardID]
      this.l.debug('RPC queries', {
        queries: u.map((s) => s.totalQueries),
        failed: u.map((s) => s.failedRequests),
      })
      u.forEach((a) => {
        a.totalQueries = 0
      })

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
    } catch (err) {
      this.l.warn(`Batch failed. Retrying in ${approximateBlockMintingTime}ms`, err)
      this.decreaseBatchCount()
      setTimeout(this.loop, approximateBlockMintingTime)
    }
  }
}
