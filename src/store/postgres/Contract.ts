import {logger} from 'src/logger'
import {IStorageContract} from 'src/store/interface'
import {Contract, Filter, Transaction} from 'src/types'
import {Query} from 'src/store/postgres/types'
import {fromSnakeToCamelResponse, generateQuery} from 'src/store/postgres/queryMapper'
import {buildSQLQuery} from 'src/store/postgres/filters'

export class PostgresStorageContract implements IStorageContract {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  addContract = async (contract: Contract) => {
    const {query, params} = generateQuery(contract)
    return await this.query(
      `insert into contracts ${query} on conflict (address) do nothing;`,
      params
    )
  }

  getContracts = async (filter: Filter): Promise<Contract[]> => {
    const q = buildSQLQuery(filter)
    const res = await this.query(`select * from contracts ${q}`, [])

    return res.map(fromSnakeToCamelResponse)
  }
}
