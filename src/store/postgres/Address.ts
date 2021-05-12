import {IStorageAddress} from 'src/store/interface'
import {Address2Transaction, Block, Filter, Address} from 'src/types'
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

  /*
  getRelatedTransactions = async (filter: Filter): Promise<Address2Transaction[]> => {
    const q = buildSQLQuery(filter)
    const res = await this.query(`select * from address2transaction ${q}`, [])

    return res.map(fromSnakeToCamelResponse)
  }
  */

  getRelatedTransactions = async (filter: Filter): Promise<Address2Transaction[]> => {
    // todo hack
    const q = buildSQLQuery(filter)
      .replace('address', 'address2transaction.address')
      .split('block_number')
      .join(' address2transaction.block_number')

    const res = await this.query(
      `
    select * from address2transaction 
    left join transactions on address2transaction.transaction_hash = transactions.hash and address2transaction.transaction_type<>'staking_transaction' 
    left join staking_transactions on address2transaction.transaction_hash = staking_transactions.hash and address2transaction.transaction_type='staking_transaction'   
    ${q}`,
      []
    )

    return res.map(fromSnakeToCamelResponse)
  }
}
