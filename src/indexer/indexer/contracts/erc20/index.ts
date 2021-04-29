import {ContractTracker} from 'src/indexer/indexer/contracts/types'

import {addContract} from './addContract'
import {trackEvents} from './trackEvents'

const ERC20Indexer: ContractTracker = {
  name: 'erc20',
  addContract,
  trackEvents,
}
