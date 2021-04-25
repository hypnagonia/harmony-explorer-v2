import {logger} from 'src/logger'
import {IStorageAddress} from 'src/store/interface'
import {Address2Transaction, Block, Filter, Address} from 'src/types'
import {normalizeAddress} from 'src/utils/normalizeAddress'
import {Query} from 'src/store/postgres/types'
import {fromSnakeToCamelResponse, generateQuery} from 'src/store/postgres/queryMapper'
import {buildSQLQuery} from 'src/store/postgres/filters'

export class PostgresStorageAddress implements IStorageAddress {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  addAddress2Transaction = async (entry: Address2Transaction) => {
    const {query, params} = generateQuery(entry)
    return await this.query(
      `insert into address2transaction ${query} on conflict (address, transaction_hash) do nothing;`,
      params
    )
  }

  getRelatedTransactions = async (filter: Filter): Promise<Block[]> => {
    const q = buildSQLQuery(filter)
    const res = await this.query(`select * from address2transaction ${q}`, [])

    return res.map(fromSnakeToCamelResponse)
  }
}
