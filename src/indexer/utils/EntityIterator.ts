import {EntityIteratorEntities, Filter, Contract} from 'src/types'
import {stores} from 'src/store'

// only shard #0
const store = stores[0]
/*
 const c = EntityIterator('contracts', 0, 1)

  for await (let value of c) {
    console.log('chunk')
    console.log(value.map(({blockNumber, address}) => ({blockNumber, address})))
  }
*/

type EntityQueryReturn = {
  value: any[] | Contract[]
  nextIndex: number
}

type EntityQueryCallback = (o: EntityQueryCallbackParams) => Promise<EntityQueryReturn>
export type EntityQueryCallbackParams = {
  index: number
  batchSize: number
}

const contracts = async ({index = 0, batchSize = 100}) => {
  const filter: Filter = {
    limit: batchSize,
    offset: 0,
    orderDirection: 'asc',
    orderBy: 'block_number',
    filters: [
      {
        type: 'gt',
        property: 'block_number',
        value: index,
      },
    ],
  }
  const value = await store.contract.getContracts(filter)
  const nextIndex = value.length ? +value[value.length - 1].blockNumber : -1
  return {
    value,
    nextIndex,
  }
}

const entityQueries: Record<EntityIteratorEntities, EntityQueryCallback> = {
  logs: async (o) => ({value: [], nextIndex: 0}),
  internalTransactions: async (o) => ({value: [], nextIndex: 0}),
  contracts,
}

export async function* EntityIterator(
  entity: EntityIteratorEntities,
  {index: initialIndex, batchSize}: EntityQueryCallbackParams
) {
  let index = initialIndex

  const cb = entityQueries[entity]

  while (true) {
    const {nextIndex, value} = await cb({index, batchSize})
    index = nextIndex

    if (batchSize > value.length) {
      return value
    }

    yield value
  }
}
