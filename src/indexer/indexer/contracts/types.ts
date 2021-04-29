import {Contract, Log} from 'src/types'

export interface ContractTracker {
  name: string
  trackEvents: (logs: Log[]) => Promise<any>
  addContract: (contract: Contract) => Promise<any>
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
