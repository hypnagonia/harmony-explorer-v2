import {Filter, ShardID, Address} from 'src/types'
import {validator} from 'src/api/controllers/validators/validators'
import {
  isAddress,
  isFilters,
  isLimit,
  isOffset,
  isOrderBy,
  isOrderDirection,
  isShard,
} from 'src/api/controllers/validators'
import {stores} from 'src/store'

export async function getRelatedTransactions(shardID: ShardID, address: Address, filter?: Filter) {
  validator({
    shardID: isShard(shardID),
    address: isAddress(address),
  })

  if (filter) {
    validator({
      offset: isOffset(filter.offset),
      limit: isLimit(filter.limit),
      orderBy: isOrderBy(filter.orderBy, ['block_number']),
      orderDirection: isOrderDirection(filter.orderDirection),
      filter: isFilters(filter.filters, ['block_number']),
    })
  } else {
    filter = {
      offset: 0,
      limit: 10,
      orderBy: 'block_number',
      orderDirection: 'desc',
      filters: [],
    }
  }

  filter.filters.push({
    value: `'${address}'`,
    type: 'eq',
    property: 'address',
  })

  return await stores[shardID].address.getRelatedTransactions(filter)
}
