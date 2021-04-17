import {FilterType, Filter} from 'src/types'

const mapFilterTypeToSQL: Record<FilterType, string> = {
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<-',
}

export const buildSQLQuery = (query: Filter) => {
  const safeSQL = (value: any) => {
    // todo
    return (value + '').split(' ').join('')
  }

  const whereQuery = query.filters
    .map((f) => {
      return `${f.property} ${mapFilterTypeToSQL[f.type]} ${safeSQL(f.value)}`
    })
    .join(' and ')
  const where = whereQuery ? `where ${whereQuery}` : ''
  const offset = query.offset ? `offset ${query.offset || 0}` : ''
  const limit = query.limit ? `limit ${query.limit || 10}` : ''
  const order = query.orderBy ? `order by ${query.orderBy} ${query.orderDirection || 'asc'}` : ''
  return `${where} ${order} ${offset} ${limit}`
}
