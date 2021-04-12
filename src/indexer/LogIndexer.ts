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
const maxBatchCount = 100

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
      const latestSyncedBlock = await store.indexer.getLastIndexedLogsBlockNumber(shardID)
      const startBlock = latestSyncedBlock > 0 ? latestSyncedBlock + 1 : 0
      const latestBlockchainBlock = (await RPCClient.getBlockByNumber(shardID, 'latest', false))
        .number

      const addLogs = (logs: Log[]) => {
        return Promise.all(
          logs.map(async (log) => {
            await store.log.addLog(shardID, log)
            return log
          })
        )
      }

      const res = await Promise.all(
        range(this.batchCount).map(async (_, i) => {
          const from = startBlock + i * blockRange
          const to = Math.min(from + blockRange - 1, latestBlockchainBlock)

          if (from > latestBlockchainBlock) {
            return Promise.resolve(null)
          }

          return await RPCClient.getLogs(shardID, from, to).then(addLogs)
        })
      )

      const logs = res.filter((l) => l) as Log[][]
      const logsLength = logs.reduce((a, b) => a + b.length, 0)
      const failedCount = RPCUrls.getFailedCount(shardID) - failedCountBefore
      const syncedToBlock = Math.min(
        latestBlockchainBlock,
        startBlock + blockRange * this.batchCount
      )

      this.l.info(
        `Processed [${startBlock},${syncedToBlock}] ${logsLength} log entries. Done in ${batchTime()}. Failed requests ${failedCount}`
      )

      await store.indexer.setLastIndexedLogsBlockNumber(shardID, syncedToBlock)

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
    } catch (err) {
      this.l.warn(`Batch failed. Retrying in ${approximateBlockMintingTime}ms`, err)
      this.decreaseBatchCount()
      setTimeout(this.loop, approximateBlockMintingTime)
    }
  }
}
