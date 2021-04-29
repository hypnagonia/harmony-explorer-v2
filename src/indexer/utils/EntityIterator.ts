import {Filter, FilterEntry} from 'src/types'
import {stores} from 'src/store'

export type EntityIteratorEntities =
  | 'contracts'
  | 'internalTransactions'
  | 'logs'
  | 'address2Transactions'
  | 'erc20'

// only shard #0
const store = stores[0]

// todo add generics
type EntityQueryReturn = {
  value: any[]
  nextIndex: number
}

type EntityQueryCallback = (o: EntityQueryCallbackParams) => Promise<EntityQueryReturn>
export type EntityQueryCallbackParams = {
  index?: number
  batchSize?: number
  address?: string
  topic?: string
}

const listByBlockNumber = (
  f: (f: Filter) => Promise<any[]>,
  extraFilters?: ((params: EntityQueryCallbackParams) => FilterEntry)[]
) => async (params: EntityQueryCallbackParams) => {
  const filters = extraFilters ? extraFilters.map((f) => f(params)) : []
  const filter: Filter = {
    limit: params.batchSize,
    offset: 0,
    orderDirection: 'asc',
    orderBy: 'block_number',
    filters: [
      {
        type: 'gt',
        property: 'block_number',
        value: params.index || 0,
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

const listByOffset = (
  f: (f: Filter) => Promise<any[]>,
  extraFilters?: ((params: EntityQueryCallbackParams) => FilterEntry)[]
) => async (params: EntityQueryCallbackParams) => {
  const filters = extraFilters ? extraFilters.map((f) => f(params)) : []
  const filter: Filter = {
    limit: params.batchSize,
    offset: params.index,
    filters: [],
  }
  const value = await f(filter)
  // @ts-ignore
  const nextIndex = params.index + params.batchSize
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

  return {
    value: `'${value}'`,
    type: 'eq',
    property,
  } as FilterEntry
}

const entityQueries: Record<EntityIteratorEntities, EntityQueryCallback> = {
  // logs by address
  logs: listByBlockNumber(store.log.getLogs, [withEqual('address')]),
  internalTransactions: listByBlockNumber(store.internalTransaction.getInternalTransactions),
  contracts: listByBlockNumber(store.contract.getContracts),
  address2Transactions: listByBlockNumber(store.address.getRelatedTransactions, [
    withEqual('address'),
  ]),
  erc20: listByOffset(store.erc20.getERC20),
}

export async function* EntityIterator(
  entity: EntityIteratorEntities,
  {index: initialIndex = 0, batchSize = 100, ...rest}: EntityQueryCallbackParams
) {
  let index = initialIndex

  const f = entityQueries[entity]

  while (true) {
    const {nextIndex, value} = await f({index, batchSize, ...rest})
    index = nextIndex
    yield value

    if (batchSize > value.length || nextIndex === -1) {
      return
    }
  }
}
