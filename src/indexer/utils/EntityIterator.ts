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

const entityQueries: Record<
  EntityIteratorEntities,
  (index: number, limit: number) => Promise<EntityQueryReturn>
> = {
  logs: async (index, limit) => ({value: [], nextIndex: 0}),
  internalTransactions: async (index, limit) => ({value: [], nextIndex: 0}),
  contracts: async (fromBlock = 0, limit = 100) => {
    const filter: Filter = {
      limit,
      offset: 0,
      orderDirection: 'asc',
      orderBy: 'block_number',
      filters: [
        {
          type: 'gt',
          property: 'block_number',
          value: fromBlock,
        },
      ],
    }
    const value = await store.contract.getContracts(filter)
    const nextIndex = value.length ? +value[value.length - 1].blockNumber : -1
    return {
      value,
      nextIndex,
    }
  },
}

export async function* EntityIterator(
  entity: EntityIteratorEntities,
  initialIndex = 0,
  batchSize = 100
) {
  let index = initialIndex

  const cb = entityQueries[entity]

  while (true) {
    const {nextIndex, value} = await cb(index, batchSize)
    index = nextIndex

    if (batchSize > value.length) {
      return value
    }

    yield value
  }
}
