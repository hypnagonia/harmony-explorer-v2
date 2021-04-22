import * as RPCClient from 'src/indexer/rpc/client'
import {urls, RPCUrls} from 'src/indexer/rpc/RPCUrls'
import {ShardID, Block, BlockNumber} from 'src/types/blockchain'

import {logger} from 'src/logger'
import LoggerModule from 'zerg/dist/LoggerModule'
import {stores} from 'src/store'
import {logTime} from 'src/utils/logTime'
import {PostgresStorage} from 'src/store/postgres'

const approximateBlockMintingTime = 2000
const maxBatchCount = 10000

const blockRange = 10

const range = (num: number) => Array(num).fill(0)

export class BlockIndexer {
  readonly shardID: ShardID
  readonly initialStartBlock: number
  private l: LoggerModule
  private batchCount: number
  readonly store: PostgresStorage

  constructor(shardID: ShardID, batchCount: number = maxBatchCount, initialStartBlock: number = 0) {
    this.l = logger(module, `shard${shardID}`)
    this.shardID = shardID
    this.initialStartBlock = initialStartBlock
    this.batchCount = batchCount
    this.l.info('Created')
    this.store = stores[shardID]
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
      const store = this.store
      const batchTime = logTime()
      const failedCountBefore = RPCUrls.getFailedCount(shardID)
      const latestSyncedBlock = await store.indexer.getLastIndexedBlockNumber()

      const startBlock =
        latestSyncedBlock && latestSyncedBlock > 0 ? latestSyncedBlock + 1 : this.initialStartBlock

      const latestBlockchainBlock = (await RPCClient.getBlockByNumber(shardID, 'latest', false))
        .number

      const getBlocks = (from: BlockNumber, to: BlockNumber) => {
        return RPCClient.getBlocks(shardID, from, to)
      }

      const addBlocks = (blocks: Block[]) => {
        return Promise.all(
          blocks.map(async (block) => {
            await store.block.addBlock(block)
            return block
          })
        )
      }

      const addTransactions = (blocks: Block[]) => {
        return Promise.all(
          blocks.map(async (block) => {
            await store.transaction.addTransactions(block.transactions)
            return block
          })
        )
      }

      const addStakingTransactions = (blocks: Block[]) => {
        return Promise.all(
          blocks.map(async (block) => {
            await store.staking.addStakingTransactions(block.stakingTransactions)
            return block
          })
        )
      }

      const res = await Promise.all(
        range(this.batchCount).map(async (_, i) => {
          const from = startBlock + i * blockRange
          const to = Math.min(from + blockRange - 1, latestBlockchainBlock)

          if (from > latestBlockchainBlock) {
            return Promise.resolve([] as Block[])
          }

          return await getBlocks(from, to)
            .then(addBlocks)
            .then(addTransactions)
            .then(addStakingTransactions)
        })
      )

      const blocks = res.flatMap((b) => b).filter((b) => b)
      const lastFetchedBlockNumber = blocks.reduce((a, b) => (a < b.number ? b.number : a), 0)
      const transactionsCount = blocks.reduce((a, b) => a + b.transactions.length, 0)
      const stakingTransactionsCount = blocks.reduce((a, b) => a + b.stakingTransactions.length, 0)

      const failedCount = RPCUrls.getFailedCount(shardID) - failedCountBefore

      if (lastFetchedBlockNumber > 0) {
        await store.indexer.setLastIndexedBlockNumber(lastFetchedBlockNumber)
      }

      const syncedToBlock = Math.min(
        lastFetchedBlockNumber,
        startBlock + blockRange * this.batchCount
      )

      this.l.info(
        `Processed [${startBlock}, ${syncedToBlock}] ${
          blocks.length
        } blocks. ${transactionsCount} txs. ${stakingTransactionsCount} staking txs. Done in ${batchTime()}. Failed requests ${failedCount}`
      )

      const u = urls[shardID]
      this.l.debug('RPC queries', {
        queries: u.map((s) => s.totalQueries),
        failed: u.map((s) => s.failedRequests),
      })
      u.forEach((a) => {
        a.totalQueries = 0
      })

      if (blocks.length >= syncedToBlock - startBlock + 1 && blocks.length >= blockRange) {
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
