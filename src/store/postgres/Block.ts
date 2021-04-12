import {logger} from 'src/logger'
import {IStorageBlock} from 'src/store/interface'
import {Block, BlockHash, BlockNumber, ShardID} from 'src/types/blockchain'
import {generateQuery} from './queryMapper'

import {Query} from 'src/store/postgres/types'

const l = logger(module)

export class PostgresStorageBlock implements IStorageBlock {
  query: Query
  constructor(query: Query) {
    this.query = query
  }

  addBlocks = async (shardID: ShardID, blocks: Block[]) => {
    return Promise.all(blocks.map((b) => this.addBlock(shardID, b)))
  }

  addBlock = async (shardID: ShardID, block: Block) => {
    const {query, params} = generateQuery({...block, shardID})

    return await this.query(`insert into blocks ${query} on conflict (number) do nothing;`, params)
  }

  getBlockByNumber = async (shardID: ShardID, num: BlockNumber): Promise<Block | null> => {
    const res = await this.query(`select * from blocks where number=$1 and shard=${shardID};`, [
      num,
      shardID,
    ])

    return res[0] as Block
  }

  getBlockByHash = async (shardID: ShardID, hash: BlockHash): Promise<Block | null> => {
    const res = await this.query(`select * from blocks where hash=$1 and shard=${shardID};`, [
      hash,
      shardID,
    ])

    return res[0] as Block
  }
}
