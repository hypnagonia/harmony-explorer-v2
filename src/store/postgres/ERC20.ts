import {logger} from 'src/logger'
import {IStorageERC20} from 'src/store/interface'
import {Contract, Filter, IERC20} from 'src/types'
import {Query} from 'src/store/postgres/types'
import {fromSnakeToCamelResponse, generateQuery} from 'src/store/postgres/queryMapper'
import {buildSQLQuery} from 'src/store/postgres/filters'

export class PostgresStorageERC20 implements IStorageERC20 {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  addERC20 = async (erc20: IERC20) => {
    const {query, params} = generateQuery(erc20)

    return await this.query(`insert into erc20 ${query} on conflict (address) do nothing;`, params)
  }

  getERC20 = async (filter: Filter): Promise<IERC20[]> => {
    const q = buildSQLQuery(filter)
    const res = await this.query(`select * from erc20 ${q}`, [])

    return res.map(fromSnakeToCamelResponse)
  }
}
