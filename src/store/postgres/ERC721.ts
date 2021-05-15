import {IStorageERC721} from 'src/store/interface'
import {Address, BlockNumber, Contract, Filter, IERC721} from 'src/types'
import {Query} from 'src/store/postgres/types'
import {fromSnakeToCamelResponse, generateQuery} from 'src/store/postgres/queryMapper'
import {buildSQLQuery} from 'src/store/postgres/filters'

export class PostgresStorageERC721 implements IStorageERC721 {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  addERC721 = async (erc721: IERC721) => {
    const {query, params} = generateQuery(erc721)

    return await this.query(`insert into erc721 ${query} on conflict (address) do nothing;`, params)
  }

  getERC721 = async (filter: Filter): Promise<IERC721[]> => {
    const q = buildSQLQuery(filter)
    const res = await this.query(`select * from erc721 ${q}`, [])

    return res.map(fromSnakeToCamelResponse)
  }

  getAllERC721 = async (): Promise<IERC721[]> => {
    const res = await this.query(`select * from erc721`, [])

    return res.map(fromSnakeToCamelResponse)
  }

  updateERC721 = async (erc721: IERC721) => {
    return this.query(
      `update erc721 set total_supply=$1, holders=$2, transaction_count=$3 where address=$4;`,
      [erc721.totalSupply, erc721.holders, erc721.transactionCount, erc721.address]
    )
  }

  getERC721LastSyncedBlock = async (address: Address): Promise<number> => {
    const res = await this.query(`select last_update_block_number from erc721 where address=$1;`, [
      address,
    ])

    const lastIndexedBlock = +res[0][`last_update_block_number`]
    return lastIndexedBlock || 0
  }

  setERC721LastSyncedBlock = async (address: Address, blockNumber: BlockNumber) => {
    return this.query(`update erc721 set last_update_block_number=$1 where address=$2;`, [
      blockNumber,
      address,
    ])
  }

  /* getERC20Balance = async (owner: Address, token: Address): Promise<string | null> => {
    const res = await this.query(
      `select balance from erc20_balance where owner_address=$1 and token_address=$2`,
      [owner, token]
    )

    return res[0] || null
  }

  setNeedUpdateBalance = async (owner: Address, token: Address) => {
    return this.query(
      `
            insert into erc20_balance(owner_address, token_address, need_update) values($1, $2, true)
                on conflict(owner_address, token_address)
                do update set need_update = true;
          `,
      [owner, token]
    )
  }

  updateBalance = async (owner: Address, token: Address, balance: string) => {
    return this.query(
      `
          update erc20_balance set balance=$1, need_update=false where owner_address=$2 and token_address=$3;
          `,
      [balance, owner, token]
    )
  }

  getBalances = async (filter: Filter): Promise<IERC20Balance[]> => {
    const q = buildSQLQuery(filter)

    const res = await this.query(`select * from erc20_balance ${q}`, [])

    return res.map(fromSnakeToCamelResponse)
  }

  getUserBalances = async (address: Address): Promise<IERC20Balance[]> => {
    const res = await this.query(`select * from erc20_balance where owner_address=$1 and balance > 0`, [address])

    return res.map(fromSnakeToCamelResponse)
  }

  getHoldersCount = async (token: Address): Promise<string> => {
    const res = await this.query(
      `select count(*) from erc20_balance where token_address=$1 and balance > 0`,
      [token]
    )

    return res[0].count
  }*/
}
