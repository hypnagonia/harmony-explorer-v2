type OrderDirection = 'asc' | 'desc'

export type FilterType = 'gt' | 'gte' | 'lt' | 'lte'
export type FilterProperty = string // 'number' | 'timestamp'

export type FilterEntry = {
  type: FilterType
  property: FilterProperty
  value: number | string
}

export type Filter = {
  offset?: number
  limit?: number
  orderDirection: OrderDirection
  orderBy: 'timestamp' | 'number'
  filter: FilterEntry
}
