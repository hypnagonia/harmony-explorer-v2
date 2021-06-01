import {IStorageAddress} from 'src/store/interface'
import {Address2Transaction, Block, Filter, AddressTransactionType} from 'src/types'
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
      `insert into address2transaction ${query} on conflict (address, transaction_hash, transaction_type) do nothing;`,
      params
    )
  }

  // todo warning depricated
  getRelatedTransactions = async (filter: Filter): Promise<Address2Transaction[]> => {
    // todo hack
    const q = buildSQLQuery(filter)
      .replace('address', 'address2transaction.address')
      .split('block_number')
      .join(' address2transaction.block_number')

    const res = await this.query(
      `
    select * from (select * from address2transaction ${q}) as a 
    left join staking_transactions on 
    (a.transaction_hash = staking_transactions.hash and a.transaction_type='staking_transaction')
    left join transactions on (a.transaction_hash = transactions.hash and a.transaction_type<>'staking_transaction')
        `,
      []
    )

    return res.map(fromSnakeToCamelResponse)
  }

  getRelatedTransactionsByType = async (
    filter: Filter,
    type: AddressTransactionType
  ): Promise<Address2Transaction[]> => {
    filter.filters.push({
      value: `'${type}'`,
      type: 'eq',
      property: 'transaction_type',
    })

    const q = buildSQLQuery(filter)

    // todo order broken
    // todo remove offset
    // hack fresh transactions recorded last, not need sort
    const q2 = q.replace('order by block_number desc', '').replace(`offset ${filter.offset}`, '')

    if (type === 'staking_transaction') {
      const isRes = await this.query(
        `
    select * from (select * from address2transaction ${q2}) as a 
    left join staking_transactions on a.transaction_hash = staking_transactions.hash
        `,
        []
      )
      if (isRes.length < filter ? filter.limit : 10) {
        return isRes.map(fromSnakeToCamelResponse)
      }

      const res = await this.query(
        `
    select * from (select * from address2transaction ${q}) as a 
    left join staking_transactions on a.transaction_hash = staking_transactions.hash
        `,
        []
      )

      return res.map(fromSnakeToCamelResponse)
    }

    let response

    const fastRes = await this.query(
      `
    select * from (select * from address2transaction ${q2}) as a 
    left join transactions on a.transaction_hash = transactions.hash
        `,
      []
    )
    if (fastRes.length < filter ? filter.limit : 10) {
      response = fastRes
    } else {
      response = await this.query(
        `
    select * from (select * from address2transaction ${q}) as a 
    left join transactions on a.transaction_hash = transactions.hash
        `,
        []
      )
    }

    if (type === 'transaction' || type === 'internal_transaction') {
      return response.map(fromSnakeToCamelResponse)
    }

    // for erc20 and erc721 we add logs to payload
    return await Promise.all(
      response.map(fromSnakeToCamelResponse).map(async (tx: any) => {
        tx.logs = await this.query('select * from logs where transaction_hash=$1', [tx.hash])
        return tx
      })
    )
  }
}
