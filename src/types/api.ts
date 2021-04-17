export type FilterType = 'gt' | 'gte' | 'lt' | 'lte'
export type FilterProperty = 'number' | 'timestamp'

export type FilterEntry = {
  type: FilterType
  property: FilterProperty
  value: number | string
}

export type FilterOrderBy = 'timestamp' | 'number'

export type FilterOrderDirection = 'asc' | 'desc'
export type Filter = {
  offset?: number
  limit?: number
  orderDirection: FilterOrderDirection
  orderBy: FilterOrderBy
  filters: FilterEntry[]
}
