import {ContractTracker} from 'src/indexer/indexer/contracts/types'
import {ERC20Indexer} from 'src/indexer/indexer/contracts/erc20'
import {ERC721Indexer} from 'src/indexer/indexer/contracts/erc721'

import {config} from 'src/config'
export const tasks: ContractTracker<any>[] = [ERC20Indexer, ERC721Indexer].filter(({name}) =>
  config.indexer.trackContractTypes.includes(name)
)
