import {ContractTracker} from 'src/indexer/indexer/contracts/types'
import {ERC20Indexer} from 'src/indexer/indexer/contracts/erc20'
import {IERC20} from 'src/types'
import {config} from 'src/config'
export const tasks: ContractTracker<IERC20>[] = [ERC20Indexer].filter(({name}) =>
  config.indexer.trackContractTypes.includes(name)
)
