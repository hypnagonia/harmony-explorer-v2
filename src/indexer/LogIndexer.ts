import {config} from 'src/indexer/config'
import * as RPCClient from 'src/indexer/rpc/client'
import {urls, RPCUrls} from 'src/indexer/rpc/RPCUrls'
import {ShardID, Log} from 'src/types/blockchain'

import {logger} from 'src/logger'
import LoggerModule from 'zerg/dist/LoggerModule'
import {store} from 'src/store'
import {logTime} from 'src/utils/logTime'

const approximateBlockMintingTime = 2000
const blockRange = 10

const range = (num: number) => Array(num).fill(0)

export class LogIndexer {
  readonly shardID: ShardID
  private l: LoggerModule
  // todo config
  private batchCount = 10

  constructor(shardID: ShardID) {
    this.l = logger(module, `shard${shardID}`)
    this.shardID = shardID
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
      const shardID = this.shardID
      const batchTime = logTime()
      const failedCountBefore = RPCUrls.getFailedCount(shardID)
      const latestSyncedBlock = await store.getLastIndexedLogsBlockNumber(shardID)

      const latestBlockchainBlock = (await RPCClient.getBlockByNumber(shardID, 'latest', false))
        .number

      const res = await Promise.all(
        range(this.batchCount).map(async (_, i) => {
          const from = latestSyncedBlock + i * blockRange
          const to = Math.min(from + blockRange - 1, latestBlockchainBlock)

          if (from > latestBlockchainBlock) {
            return Promise.resolve(null)
          }

          const res = await RPCClient.getLogs(shardID, from, to)
          return res
        })
      )

      const logs = res.filter((l) => l) as Log[][]
      const logsLength = logs.reduce((a, b) => a + b.length, 0)
      const failedCount = RPCUrls.getFailedCount(shardID) - failedCountBefore
      const syncedToBlock = latestSyncedBlock + blockRange * this.batchCount

      this.l.info(
        `Get logs [${latestSyncedBlock},${
          syncedToBlock - 1
        }] ${logsLength} log entries. Done in ${batchTime()}. Failed requests ${failedCount}`
      )

      const storeTime = logTime()

      await Promise.all(
        logs.map((entries) =>
          Promise.all(
            entries.map((e) => {
              return store.addLog(shardID, e)
            })
          )
        )
      )

      await store.setLastIndexedLogsBlockNumber(shardID, syncedToBlock)

      this.l.info(`Saved to store. Done in ${storeTime()}`)

      if (logs.length === this.batchCount) {
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
