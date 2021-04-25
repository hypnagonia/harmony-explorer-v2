import {FilterType, Filter} from 'src/types'

const mapFilterTypeToSQL: Record<FilterType, string> = {
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  eq: '=',
}

export const buildSQLQuery = (query: Filter) => {
  const safeSQL = (value: any) => {
    // todo safe trim value
    return (value + '').split(' ').join('')
  }

  const whereQuery = query.filters
    .map((f) => {
      return `${f.property} ${mapFilterTypeToSQL[f.type]} ${safeSQL(f.value)}`
    })
    .join(' and ')

  const where = whereQuery ? `where ${whereQuery}` : ''
  const offset = query.offset ? `offset ${query.offset || 0}` : ''
  const limit = `limit ${query.limit || 10}`
  const order = `order by ${query.orderBy || 'number'} ${query.orderDirection || 'desc'}`
  return `${where} ${order} ${offset} ${limit}`
}
