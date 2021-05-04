import {PostgresStorage} from 'src/store/postgres'
import {ABI} from 'src/indexer/indexer/contracts/erc20/ABI'
import {logger} from 'src/logger'
import {Filter} from 'src/types'

const l = logger(module, 'erc20:balance')
const {call} = ABI

const filter: Filter = {
  limit: 100,
  offset: 0,
  filters: [
    {
      property: 'needUpdate',
      type: 'eq',
      value: 'true',
    },
  ],
}
// update balances
export const onFinish = async (store: PostgresStorage) => {
  l.info(`Updating balances`)
  let count = 0

  // since we update entries, iterator doesnt work
  while (true) {
    const balancesNeedUpdate = await store.erc20.getBalances(filter)
    if (!balancesNeedUpdate.length) {
      break
    }

    const promises = balancesNeedUpdate.map(({ownerAddress, tokenAddress}) =>
      call('balanceOf', [ownerAddress], tokenAddress).then((balance) =>
        store.erc20.updateBalance(ownerAddress, tokenAddress, balance)
      )
    )
    await Promise.all(promises)
    count += balancesNeedUpdate.length
  }
  l.info(`Updated ${count} balances`)
  // todo update holders and total supply
}
