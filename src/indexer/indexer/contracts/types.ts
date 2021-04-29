import {Contract, Log} from 'src/types'

export interface ContractTracker {
  name: string
  trackEvents: (logs: Log[]) => Promise<any>
  addContract: (contract: Contract) => Promise<any>
}
