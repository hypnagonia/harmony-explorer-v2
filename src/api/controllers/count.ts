import {stores} from 'src/store'
import {ShardID, CountableEntities} from 'src/types'
import {validator} from 'src/api/controllers/validators/validators'
import {isOneOf} from 'src/api/controllers/validators'

export async function getCount(
  shardID: ShardID,
  entity: CountableEntities
): Promise<{count: string}> {
  validator({
    entity: isOneOf(entity, [
      'transactions',
      'blocks',
      'logs',
      'stakingTransactions',
      'internalTransactions',
    ]),
  })

  return await stores[shardID].getCount(entity)
}
