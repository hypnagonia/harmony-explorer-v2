import {PostgresStorage} from 'src/store/postgres'
import {ABI} from 'src/indexer/indexer/contracts/erc721/ABI'
import {logger} from 'src/logger'
import {Address, Filter} from 'src/types'

const l = logger(module, 'erc721:balance')
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
  console.log('erc721 onFinish')
  // todo
  /*
l.info(`Updating balances`)
  let count = 0
  const tokensForUpdate = new Set<Address>()

  // since we update entries, iterator doesnt work
  while (true) {
    const balancesNeedUpdate = await store.erc20.getBalances(filter)
    if (!balancesNeedUpdate.length) {
      break
    }

    const promises = balancesNeedUpdate.map(({ownerAddress, tokenAddress}) => {
      tokensForUpdate.add(tokenAddress)

      return call('balanceOf', [ownerAddress], tokenAddress).then((balance) =>
        store.erc20.updateBalance(ownerAddress, tokenAddress, balance)
      )
    })
    await Promise.all(promises)
    count += balancesNeedUpdate.length
  }

  const promises = [...tokensForUpdate.values()].map(async (token) => {
    const holders = await store.erc20.getHoldersCount(token)
    const totalSupply = await call('totalSupply', [], token)
    // todo tx count ?

    const erc20 = {
      holders: +holders || 0,
      totalSupply: totalSupply,
      transactionCount: 0,
      address: token,
    }

    // @ts-ignore
    return store.erc20.updateERC20(erc20)
  })

  await Promise.all(promises)

  l.info(`Updated ${count} balances`)
  */
}
