import {ContractTracker} from 'src/indexer/indexer/contracts/types'
import {IERC20} from 'src/types'

import {addContract} from './addContract'
import {trackEvents} from './trackEvents'

export const ERC20Indexer: ContractTracker<IERC20> = {
  name: 'erc20',
  config: {
    contractBatchSize: 10,
    eventBatchSize: 10000,
  },
  addContract,
  trackEvents,
  onTaskEnd: async (p) => {},
}
