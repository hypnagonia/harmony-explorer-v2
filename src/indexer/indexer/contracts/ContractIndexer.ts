import {logger} from 'src/logger'
import LoggerModule from 'zerg/dist/LoggerModule'
import {stores} from 'src/store'
import {EntityIterator} from 'src/indexer/utils/EntityIterator'
import {tasks} from './tasks'

// only shard #0
const store = stores[0]

const syncingIntervalMs = 1000 * 60 * 5

export class ContractIndexer {
  l: LoggerModule
  ls: Record<string, LoggerModule>

  constructor() {
    this.l = logger(module)
    this.l.info(`Created [${tasks.map((t) => t.name).join(', ')}]`)
    this.ls = tasks
      .map((t) => t.name)
      .reduce((o, name) => {
        o[name] = logger(module, name)
        return o
      }, {} as Record<string, LoggerModule>)
  }

  loop = async () => {
    for (const task of tasks) {
      const l = this.ls[task.name]
      try {
        l.info('hi from there')
        const latestSyncedBlock = await store.indexer.getLastIndexedBlockNumberByName(task.name)

        const contractsIterator = EntityIterator('contracts', {
          batchSize: 1000,
          index: latestSyncedBlock,
        })

        for await (const contracts of contractsIterator) {
          await Promise.all(contracts.map((c) => task.addContract(c)))
        }

        // track events

        // await store.indexer.setLastIndexedBlockNumberByName(x, task.name)
      } catch (err) {
        l.warn('Batch failed', err.message || err)
      }
    }
    setTimeout(this.loop, syncingIntervalMs)
  }
}
