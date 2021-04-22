import * as blockchain from './blockchain'
export type FilterType = 'gt' | 'gte' | 'lt' | 'lte'
export type FilterProperty = 'number'

export type TransactionQueryField = 'block_number' | 'block_hash' | 'hash' | 'harmony_hash'
export type StakingTransactionQueryQuery = 'block_number' | 'block_hash' | 'hash'
export type TransactionQueryValue =
  | blockchain.BlockNumber
  | blockchain.BlockHash
  | blockchain.TransactionHash

export type FilterEntry = {
  type: FilterType
  property: FilterProperty
  value: number | string
}

export type FilterOrderBy = 'number' | 'block_number'

export type FilterOrderDirection = 'asc' | 'desc'
export type Filter = {
  offset?: number
  limit?: number
  orderDirection: FilterOrderDirection
  orderBy: FilterOrderBy
  filters: FilterEntry[]
}
