import {logger} from 'src/logger'
import LoggerModule from 'zerg/dist/LoggerModule'
import {stores} from 'src/store'
import {EntityIterator} from 'src/indexer/utils/EntityIterator'
import {tasks} from './tasks'
import {ContractTracker} from 'src/indexer/indexer/contracts/types'
import {PostgresStorage} from 'src/store/postgres'
import {trackEvents} from 'src/indexer/indexer/contracts/erc20/trackEvents'
import {IERC20} from 'src/types'

const syncingIntervalMs = 1000 * 60 * 5
const contractBatchSize = 10
const eventBatchSize = 10

export class ContractIndexer {
  readonly l: LoggerModule
  readonly ls: Record<string, LoggerModule>
  readonly store: PostgresStorage

  constructor() {
    this.store = stores[0]
    this.l = logger(module)
    this.l.info(`Created [${tasks.map((t) => t.name).join(', ')}]`)
    this.ls = tasks
      .map((t) => t.name)
      .reduce((o, name) => {
        o[name] = logger(module, name)
        return o
      }, {} as Record<string, LoggerModule>)
  }

  // iterate all contract entries stored in db and add records for tracked contracts erc20, erc721, etc
  private addContracts = async (task: ContractTracker) => {
    const latestSyncedBlockIndexerBlock = await this.store.indexer.getLastIndexedBlockNumberByName(
      'blocks'
    )

    const latestSyncedBlock = await this.store.indexer.getLastIndexedBlockNumberByName(
      `${task.name}_contracts`
    )
    const startBlock = latestSyncedBlock && latestSyncedBlock > 0 ? latestSyncedBlock + 1 : 0

    this.l.info(`${task.name} contracts from block ${startBlock}`)
    const contractsIterator = EntityIterator('contracts', {
      batchSize: contractBatchSize,
      index: startBlock,
    })

    for await (const contracts of contractsIterator) {
      await Promise.all(contracts.map((c) => task.addContract(this.store, c)))

      if (contracts.length) {
        const syncedToBlock = +contracts[contracts.length - 1].blockNumber
        await this.store.indexer.setLastIndexedBlockNumberByName(
          `${task.name}_contracts`,
          syncedToBlock
        )
      }
    }

    await this.store.indexer.setLastIndexedBlockNumberByName(
      `${task.name}_contracts`,
      latestSyncedBlockIndexerBlock
    )
  }

  trackEvents = async (task: ContractTracker) => {
    const latestSyncedBlockIndexerBlock = await this.store.indexer.getLastIndexedBlockNumberByName(
      'blocks'
    )

    const latestSyncedBlock = await this.store.indexer.getLastIndexedBlockNumberByName(
      `${task.name}_entries`
    )
    const startBlock = latestSyncedBlock && latestSyncedBlock > 0 ? latestSyncedBlock + 1 : 0

    this.l.info(`${task.name} entries from block ${startBlock}`)

    const tokensIterator = EntityIterator('erc20', {
      batchSize: 1,
      index: startBlock,
    })

    for await (const tokens of tokensIterator) {
      if (!tokens.length) {
        break
      }

      const token: IERC20 = tokens[0]

      const logsIterator = EntityIterator('logs', {
        batchSize: eventBatchSize,
        index: startBlock,
        address: token.address,
      })

      // todo try catch a contract to let others continue

      for await (const logs of logsIterator) {
        if (!logs.length) {
          continue
        }

        await task.trackEvents(this.store, logs, {token})
      }
    }

    /*
    await this.store.indexer.setLastIndexedBlockNumberByName(
      `${task.name}_entries`,
      latestSyncedBlockIndexerBlock
    )
    */
  }

  loop = async () => {
    for (const task of tasks) {
      const l = this.ls[task.name]
      try {
        l.info('hi from there')

        await this.addContracts(task)
        await this.trackEvents(task)
      } catch (err) {
        l.warn('Batch failed', err.message || err)
      }
    }
    setTimeout(this.loop, syncingIntervalMs)
  }
}
