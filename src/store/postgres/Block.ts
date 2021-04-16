import {logger} from 'src/logger'
import {IStorageBlock} from 'src/store/interface'
import {Block, BlockHash, BlockNumber, ShardID} from 'src/types/blockchain'
import {generateQuery, fromSnakeToCamelResponse} from './queryMapper'

import {Query} from 'src/store/postgres/types'

export class PostgresStorageBlock implements IStorageBlock {
  query: Query
  constructor(query: Query) {
    this.query = query
  }

  addBlocks = async (shardID: ShardID, blocks: Block[]) => {
    return Promise.all(blocks.map((b) => this.addBlock(shardID, b)))
  }

  addBlock = async (shardID: ShardID, block: Block) => {
    // todo
    // @ts-ignore
    block.stakingTransactions = []
    block.transactions = []
    const {query, params} = generateQuery(block)

    return await this.query(`insert into blocks ${query} on conflict (number) do nothing;`, params)
  }

  getBlockByNumber = async (shardID: ShardID, num: BlockNumber): Promise<Block | null> => {
    const res = await this.query(`select * from blocks where number=$1;`, [num])

    return fromSnakeToCamelResponse(res[0]) as Block
  }

  getBlockByHash = async (shardID: ShardID, hash: BlockHash): Promise<Block | null> => {
    const res = await this.query(`select * from blocks where hash=$1;`, [hash])

    return fromSnakeToCamelResponse(res[0]) as Block
  }

  getBlocks = async (
    shardID: ShardID,
    offset = 0,
    limit = 0,
    orderDirection?: 'asc' | 'desc',
    orderBy?: 'number' | 'timestamp',
    fromProperty?: 'number' | 'timestamp',
    fromValue?: any
  ) => {}
}
