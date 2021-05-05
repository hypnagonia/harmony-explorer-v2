import {
  Address2Transaction,
  Contract,
  IERC20,
  IERC20Balance,
  InternalTransaction,
  Log,
} from 'src/types'
import {listByBlockNumber, EntityQueryCallback, listByOffset, withEqual} from './executors'
import {stores} from 'src/store'

export type ContractIndexerTaskEntities = 'erc20'
export type EntityIteratorEntities =
  | 'contracts'
  | 'internalTransactions'
  | 'logs'
  | 'logsAll'
  | 'address2Transactions'
  | 'erc20BalancesNeedUpdate'
  | ContractIndexerTaskEntities

// only shard #0
const store = stores[0]

export const entityQueries: Record<EntityIteratorEntities, EntityQueryCallback> = {
  logs: listByBlockNumber<Log>(store.log.getLogs, [withEqual('address')]),
  logsAll: listByBlockNumber<Log>(store.log.getLogs),
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
