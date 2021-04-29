import {Contract, Log} from 'src/types'
import {PostgresStorage} from 'src/store/postgres'

export interface ContractTracker {
  name: string
  trackEvents: (store: PostgresStorage, logs: Log[]) => Promise<any>
  addContract: (store: PostgresStorage, contract: Contract) => Promise<any>
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
