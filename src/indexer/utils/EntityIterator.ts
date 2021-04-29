import {Filter, FilterEntry} from 'src/types'
import {stores} from 'src/store'

export type EntityIteratorEntities =
  | 'contracts'
  | 'internalTransactions'
  | 'logs'
  | 'address2Transactions'

// only shard #0
const store = stores[0]
/*
 const c = EntityIterator('contracts', 0, 1)

  for await (let value of c) {
    console.log('chunk')
    console.log(value.map(({blockNumber, address}) => ({blockNumber, address})))
  }
*/

// todo add generics
type EntityQueryReturn = {
  value: any[]
  nextIndex: number
}

type EntityQueryCallback = (o: EntityQueryCallbackParams) => Promise<EntityQueryReturn>
export type EntityQueryCallbackParams = {
  index: number
  batchSize: number
  address?: string
}

const filteredQueries = (
  f: (f: Filter) => Promise<any[]>,
  extraFilters?: (params: EntityQueryCallbackParams) => FilterEntry[]
) => async (params: EntityQueryCallbackParams) => {
  const filters = extraFilters ? extraFilters(params) : []
  const filter: Filter = {
    limit: params.batchSize,
    offset: 0,
    orderDirection: 'asc',
    orderBy: 'block_number',
    filters: [
      {
        type: 'gt',
        property: 'block_number',
        value: params.index,
      },
      ...filters,
    ],
  }
  const value = await f(filter)
  const nextIndex = value.length ? +value[value.length - 1].blockNumber : -1
  return {
    value,
    nextIndex,
  }
}

type EqualFields = 'address'
const withEqual = (property: EqualFields) => (params: EntityQueryCallbackParams) => {
  const value = params[property]
  if (!value) {
    throw new Error(`${value} field must be defined`)
  }

  return [
    {
      value: `'${value}'`,
      type: 'eq',
      property,
    },
  ] as FilterEntry[]
}

const entityQueries: Record<EntityIteratorEntities, EntityQueryCallback> = {
  logs: filteredQueries(store.log.getLogs, withEqual('address')),
  internalTransactions: filteredQueries(store.internalTransaction.getInternalTransactions),
  contracts: filteredQueries(store.contract.getContracts),
  address2Transactions: filteredQueries(store.contract.getContracts, withEqual('address')),
}

export async function* EntityIterator(
  entity: EntityIteratorEntities,
  {index: initialIndex, batchSize}: EntityQueryCallbackParams
) {
  let index = initialIndex

  const f = entityQueries[entity]

  while (true) {
    const {nextIndex, value} = await f({index, batchSize})
    index = nextIndex

    if (batchSize > value.length || nextIndex === -1) {
      return value
    }

    yield value
  }
}
