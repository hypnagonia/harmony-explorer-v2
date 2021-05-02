import {Contract, Log} from 'src/types'
import {PostgresStorage} from 'src/store/postgres'
import {ContractIndexerTaskEntities} from 'src/indexer/utils/EntityIterator'

export interface ContractTracker<T> {
  name: ContractIndexerTaskEntities
  config: {
    contractBatchSize: number
    eventBatchSize: number
  }
  trackEvents: (store: PostgresStorage, logs: Log[], params: {token: T}) => Promise<any>
  addContract: (store: PostgresStorage, contract: Contract) => Promise<any>
  // onTaskStart
  onTaskEnd: (store: PostgresStorage) => Promise<any>
}

export type ABIEventSignature = string
export type ABIMethodSignature = string

type ABIEntry = {
  name: string
  type: 'event' | 'function'
  inputs: {name: string; type: 'string'; indexed: boolean}[]
  outputs: {name: string; type: 'string'}[] | undefined
}

export type IABI = ABIEntry[]
