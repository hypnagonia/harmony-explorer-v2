import {Contract, Log} from 'src/types'

export const ERC20 = {
  name: 'ERC20',
  trackEvents: (logs: Log[]) => {
    // if event update contract and owners
    //
  },
  addContract: (contract: Contract) => {
    // if contract add record
  },
  // not needed use name
  getLastSyncedBlock: () => {},
  setLastSyncedBlock: () => {},
}
