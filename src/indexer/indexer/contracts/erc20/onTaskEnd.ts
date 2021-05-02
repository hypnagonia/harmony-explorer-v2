import {EntityIterator} from 'src/indexer/utils/EntityIterator'
import {PostgresStorage} from 'src/store/postgres'
import {ABI} from 'src/indexer/indexer/contracts/erc20/ABI'

const {call} = ABI

// update balances
export const onTaskEnd = async (store: PostgresStorage) => {
  const balancesNeedUpdate = EntityIterator('erc20BalancesNeedUpdate', {
    index: 0,
    batchSize: 100,
    needUpdate: 'true',
  })

  for await (const b of balancesNeedUpdate) {
    if (!b.length) {
      return
    }

    const promises = b.map(({ownerAddress, tokenAddress}) =>
      call('balanceOf', [ownerAddress], tokenAddress).then((balance) =>
        store.erc20.updateBalance(ownerAddress, tokenAddress, balance)
      )
    )
    await Promise.all(promises)
  }
}
