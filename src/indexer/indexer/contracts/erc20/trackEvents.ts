import {Log, Address, IERC20} from 'src/types'
import {PostgresStorage} from 'src/store/postgres'
import {ABI} from './ABI'
import {logger} from 'src/logger'

const {getEntryByName, decodeLog} = ABI
import {zeroAddress} from 'src/indexer/indexer/contracts/utils/zeroAddress'
import {normalizeAddress} from 'src/utils/normalizeAddress'
import {logTime} from 'src/utils/logTime'

const l = logger(module, 'erc20')

const transferEvent = getEntryByName('Transfer')!.signature

type IParams = {
  token: IERC20
}

// logic
// add property update_needed
// set of addresses from Transfer event update needed
//
// todo filter other topics
export const trackEvents = async (store: PostgresStorage, logs: Log[], {token}: IParams) => {
  const filteredLogs = logs.filter(({topics}) => topics.includes(transferEvent))
  if (!filteredLogs.length) {
    return
  }
  const tokenAddress = filteredLogs[0].address

  const addressesForUpdate = new Set<Address>()

  // todo ?
  const totalSupply = BigInt(token.totalSupply)
  const holders = BigInt(token.holders)
  const transactionCount = token.transactionCount || 0

  for (const log of filteredLogs) {
    const [topic0, ...topics] = log.topics
    const {from, to, value} = decodeLog('Transfer', log.data, topics)

    addressesForUpdate.add(from)
    addressesForUpdate.add(to)
  }

  // todo add address2transactions records according to transfer events

  const setUpdateNeeded = [...addressesForUpdate.values()]
    .filter((a) => ![zeroAddress].includes(a))
    .map((a) => normalizeAddress(a))
    .map((a) => store.erc20.setNeedUpdateBalance(a!, tokenAddress))

  await Promise.all(setUpdateNeeded)

  l.info(
    `${setUpdateNeeded.length} addresses marked need update balances for "${token.name}" ${token.address}`
  )
}
