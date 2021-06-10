import {storesAPI as stores} from 'src/store'
import {InternalTransaction, ShardID, IERC1155, IERC20Balance, Address} from 'src/types/blockchain'
import {withCache} from 'src/api/controllers/cache'
import {validator} from 'src/utils/validators/validators'
import {isAddress, isShard} from 'src/utils/validators'

export async function getAllERC1155(): Promise<IERC1155[] | null> {
  return await withCache(
    ['getAllERC1155', arguments],
    () => stores[0].erc1155.getAllERC1155(),
    1000 * 60 * 15
  )
}

/*
export async function getUserERC721Assets(address: Address): Promise<IERC20Balance[] | null> {
  validator({
    address: isAddress(address),
  })

  return await withCache(
    ['getUserERC721Assets', arguments],
    () => stores[0].erc721.getUserAssets(address),
    1000 * 60 * 5
  )
}

export async function getTokenERC721Assets(address: Address): Promise<IERC20Balance[] | null> {
  validator({
    address: isAddress(address),
  })

  return await withCache(
    ['getTokenERC721Assets', arguments],
    () => stores[0].erc721.getTokenAssets(address),
    1000 * 60 * 5
  )
}*/