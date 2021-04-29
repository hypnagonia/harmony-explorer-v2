import {Log, Address, IERC20} from 'src/types'
import {PostgresStorage} from 'src/store/postgres'
import {ABI} from './ABI'
import {logger} from 'src/logger'

const {getEntryByName, decodeLog} = ABI
import {zeroAddress} from 'src/indexer/indexer/contracts/utils/zeroAddress'

const l = logger(module)

const transferEvent = getEntryByName('Transfer')!.signature

type IParams = {
  token: IERC20
}

export const trackEvents = async (store: PostgresStorage, logs: Log[], {token}: IParams) => {
  const filteredLogs = logs.filter(({topics}) => topics.includes(transferEvent))
  if (!filteredLogs) {
    return
  }

  const initialTotalSupply = 0
  const balances = new Set<Address>()
  const totalSupply = 0

  // todo get initial balance and totalSupply
  for (const log of filteredLogs) {
    const [topic0, ...topics] = log.topics
    const {from, to, value} = decodeLog('Transfer', log.data, topics)

    if (from === zeroAddress && to === zeroAddress) {
      l.warn(`${token.address}:${token.name} transfer ${value} without "from" and "to"`)
      continue
    } else if (from !== zeroAddress && to === zeroAddress) {
      // burn event
    } else if (from === zeroAddress && to !== zeroAddress) {
      // mint to address event
    } else {
      // transfer event
    }

    console.log({from, to, value}, log.data)
    // add balances
  }

  // store
}
