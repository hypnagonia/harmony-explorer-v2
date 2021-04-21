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
    field: isOneOf(value, ['block_number', 'block_hash', 'hash', 'harmony_hash']),
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

  return await stores[shardID].transaction.getTransactionByField(shardID, field, value)
}
