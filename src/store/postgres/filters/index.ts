// filter lists
// offset limit //
// order number | timestamp
// order direction asc | desc
// from number | timestamp

// block
// txs
// logs

// gt >
// gte >=
// not
// lt <
// lte <
// e - default

// todo safe trim
/*
[
 {
    type: 'gt',
    property: 'number',
    value: '45'
 }
]

*/

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
