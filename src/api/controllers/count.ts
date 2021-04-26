import {stores} from 'src/store'
import {ShardID, Transaction, CountEntities} from 'src/types'
import {validator} from 'src/api/controllers/validators/validators'
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
  Void,
} from 'src/api/controllers/validators'
import {Filter, TransactionQueryField, TransactionQueryValue} from 'src/types/api'

export async function getCount(shardID: ShardID, entity: CountEntities): Promise<{count: string}> {
  validator({
    entity: isOneOf(entity, [
      'transactions',
      'blocks',
      'Logs',
      'stakingTransactions',
      'internalTransactions',
    ]),
  })

  return await stores[shardID].getCount(entity)
}
