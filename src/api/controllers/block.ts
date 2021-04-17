import {stores} from 'src/store'
import {ShardID} from 'src/types/blockchain'
import {validator} from 'src/api/controllers/validators/validators'
import {
  isBlockHash,
  isBlockNumber,
  isOrderDirection,
  isOrderBy,
  isShard,
  isOffset,
  isLimit,
  isOneOf,
  isFilters,
  Void,
} from 'src/api/controllers/validators'
import {Filter} from 'src/types/api'

export async function getBlockByNumber(shardID: ShardID, blockNumber: number) {
  validator({
    shardID: isShard(shardID),
    blockNumber: isBlockNumber(blockNumber),
  })
  return await stores[shardID].block.getBlockByNumber(shardID, blockNumber)
}

export async function getBlockByHash(shardID: ShardID, blockHash: string) {
  validator({
    shardID: isShard(shardID),
    blockHash: isBlockHash(blockHash),
  })
  return await stores[shardID].block.getBlockByHash(shardID, blockHash)
}

export async function getBlocks(shardID: ShardID, filter?: Filter) {
  validator({
    shardID: isShard(shardID),
  })
  if (filter) {
    validator({
      shardID: isShard(shardID),
      offset: isOffset(filter.offset),
      limit: isLimit(filter.limit),
      orderBy: isOrderBy(filter.orderBy),
      orderDirection: isOrderDirection(filter.orderDirection),
      filters: isFilters(filter.filters),
    })
  }
  return await stores[shardID].block.getBlocks(shardID, filter)
}
