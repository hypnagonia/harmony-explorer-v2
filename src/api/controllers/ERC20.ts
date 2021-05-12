import {stores} from 'src/store'
import {InternalTransaction, ShardID, IERC20} from 'src/types/blockchain'
import {withCache} from 'src/api/controllers/cache'

export async function getAllERC20(): Promise<IERC20[] | null> {
  return await withCache(
    ['getAllERC20', arguments],
    () => stores[0].erc20.getAllERC20(),
    1000 * 60 * 5
  )
}
