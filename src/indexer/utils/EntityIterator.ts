import {
  Block,
  IERC20,
  IERC20Balance,
  Log,
  Filter,
  FilterEntry,
  InternalTransaction,
  Contract,
  Address2Transaction,
} from 'src/types'
import {stores} from 'src/store'

export type ContractIndexerTaskEntities = 'erc20'
export type EntityIteratorEntities =
  | 'contracts'
  | 'internalTransactions'
  | 'logs'
  | 'address2Transactions'
  | 'erc20BalancesNeedUpdate'
  | ContractIndexerTaskEntities

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
  needUpdate?: string
}

const listByBlockNumber = <T>(
  f: (f: Filter) => Promise<T[]>,
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
  // @ts-ignore
  const nextIndex = value.length ? +value[value.length - 1].blockNumber : -1
  return {
    value,
    nextIndex,
  }
}

const listByOffset = <T>(
  f: (f: Filter) => Promise<T[]>,
  extraFilters?: ((params: EntityQueryCallbackParams) => FilterEntry)[]
) => async (params: EntityQueryCallbackParams) => {
  const filters = extraFilters ? extraFilters.map((f) => f(params)) : []
  const filter: Filter = {
    limit: params.batchSize,
    offset: params.index,
    filters,
  }
  const value = await f(filter)
  // @ts-ignore
  const nextIndex = params.index + params.batchSize
  return {
    value,
    nextIndex,
  }
}

type EqualFields = 'address' | 'needUpdate'
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
  logs: listByBlockNumber<Log>(store.log.getLogs, [withEqual('address')]),
  internalTransactions: listByBlockNumber<InternalTransaction>(
    store.internalTransaction.getInternalTransactions
  ),
  contracts: listByBlockNumber<Contract>(store.contract.getContracts),
  address2Transactions: listByBlockNumber<Address2Transaction>(
    store.address.getRelatedTransactions,
    [withEqual('address')]
  ),
  erc20: listByOffset<IERC20>(store.erc20.getERC20),
  erc20BalancesNeedUpdate: listByOffset<IERC20Balance>(store.erc20.getBalances, [
    withEqual('needUpdate'),
  ]),
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
