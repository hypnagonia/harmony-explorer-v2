import {stores} from 'src/store'
import {ShardID} from 'src/types/blockchain'
import {validator} from 'src/utils/validators/validators'
import {
  is64CharHexHash,
  isBlockNumber,
  isOrderDirection,
  isOrderBy,
  isShard,
  isOffset,
  isLimit,
  isOneOf,
  isFilters,
} from 'src/utils/validators'
import {Filter} from 'src/types/api'
import {cache} from './cache'

export async function getBlockByNumber(shardID: ShardID, blockNumber: number) {
  validator({
    shardID: isShard(shardID),
    blockNumber: isBlockNumber(blockNumber),
  })
  return await stores[shardID].block.getBlockByNumber(blockNumber)
}

export async function getBlockByHash(shardID: ShardID, blockHash: string) {
  validator({
    shardID: isShard(shardID),
    blockHash: is64CharHexHash(blockHash),
  })
  return await stores[shardID].block.getBlockByHash(blockHash)
}

export async function getBlocks(shardID: ShardID, filter?: Filter) {
  validator({
    shardID: isShard(shardID),
  })

  if (filter) {
    validator({
      offset: isOffset(filter.offset),
      limit: isLimit(filter.limit),
      orderBy: isOrderBy(filter.orderBy, ['number']),
      orderDirection: isOrderDirection(filter.orderDirection),
      filter: isFilters(filter.filters, ['number']),
    })
  } else {
    filter = {
      offset: 0,
      limit: 10,
      orderBy: 'number',
      orderDirection: 'desc',
      filters: [],
    }
  }

  const key = JSON.stringify(['getBlocks', arguments])
  const cachedRes = cache.get(key)
  if (cachedRes) {
    return cachedRes
  }

  const res = await stores[shardID].block.getBlocks(filter)
  cache.set(key, res, 2000)

  return res
}
