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
import {Filter, TransactionQueryField, TransactionQueryValue} from 'src/types/api'

export async function getTransactionByField(
  shardID: ShardID,
  field: TransactionQueryField,
  value: TransactionQueryValue
) {
  validator({
    field: isOneOf(field, ['block_number', 'block_hash', 'hash', 'harmony_hash']),
  })
  if (field === 'block_number') {
    validator({
      value: isBlockNumber(value),
    })
  } else {
    validator({
      value: isBlockHash(value),
    })
  }

  const txs = await stores[shardID].transaction.getTransactionsByField(shardID, field, value)
  if (!txs!.length) {
    return null
  }

  if (['hash', 'harmony_hash'].includes(field)) {
    return txs![0]
  }

  return txs
}

export async function getTransactions(shardID: ShardID, filter?: Filter) {
  validator({
    shardID: isShard(shardID),
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
  return await stores[shardID].transaction.getTransactions(shardID, filter)
}
