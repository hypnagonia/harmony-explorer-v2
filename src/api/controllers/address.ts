import {
  Filter,
  ShardID,
  Address,
  ContractQueryField,
  ContractQueryValue,
  TransactionQueryValue,
  AddressTransactionType,
  InternalTransaction,
} from 'src/types'
import {validator} from 'src/utils/validators/validators'
import {
  is64CharHexHash,
  isAddress,
  isBlockNumber,
  isFilters,
  isLimit,
  isOffset,
  isOneOf,
  isOrderBy,
  isOrderDirection,
  isShard,
} from 'src/utils/validators'
import {stores} from 'src/store'
import {withCache} from 'src/api/controllers/cache'

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

export async function getRelatedTransactionsByType(
  shardID: ShardID,
  address: Address,
  type: AddressTransactionType,
  filter?: Filter
) {
  validator({
    shardID: isShard(shardID),
    address: isAddress(address),
    type: isOneOf(type, [
      'transaction',
      'staking_transaction',
      'internal_transaction',
      'erc20',
      'erc721',
    ]),
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

  return await stores[shardID].address.getRelatedTransactionsByType(filter, type)
}

export async function getContractsByField(
  shardID: ShardID,
  field: ContractQueryField,
  value: ContractQueryValue
): Promise<InternalTransaction[] | null> {
  validator({
    field: isOneOf(field, ['address', 'creator_address']),
  })
  validator({
    value: isAddress(value),
  })

  const res = await withCache(['getContractByField', arguments], () =>
    stores[shardID].contract.getContractByField(field, value)
  )

  if (field === 'address') {
    return res[0]
  }

  return res
}
