import {PostgresStorage} from 'src/store/postgres'
import {ABI} from 'src/indexer/indexer/contracts/erc721/ABI'
import {logger} from 'src/logger'
import {Address, Filter, IERC20, IERC721TokenID} from 'src/types'
import nodeFetch from 'node-fetch'

const l = logger(module, 'erc721:assets')
const {call} = ABI

const filter: Filter = {
  limit: 10,
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

  l.info(`Updating assets`)
  let count = 0
  const tokensForUpdate = new Set<Address>()

  // since we update entries, iterator doesnt work
  while (true) {
    const assetsNeedUpdate = await store.erc721.getAssets(filter)
    if (!assetsNeedUpdate.length) {
      break
    }
    console.log('assetsNeedUpdate', assetsNeedUpdate.length)

    const promises = assetsNeedUpdate.map(async ({tokenAddress, tokenID}) => {
      tokensForUpdate.add(tokenAddress)

      const uri = await call('tokenURI', [tokenID], tokenAddress)

      const owner = await call('ownerOf', [tokenID], tokenAddress)
      let meta = {} as any

      try {
        meta = await nodeFetch(uri).then((r) => r.json())
      } catch (e) {
        // l.warn(`Failed to fetch meta from ${uri} for token ${tokenAddress} ${tokenID}`)
      }

      console.log('saving')
      return store.erc721.updateAsset(owner, tokenAddress, uri, meta, tokenID as IERC721TokenID)
    })
    await Promise.all(promises)
    count += assetsNeedUpdate.length
  }

  /*
  const promises = [...tokensForUpdate.values()].map(async (token) => {
    const holders = await store.erc721.getHoldersCount(token)
    const totalSupply = await call('tokenURI', [], token)
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
  */

  l.info(`Updated ${count} assets`)
}
