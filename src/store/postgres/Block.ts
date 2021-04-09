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
    const {query, params} = generateQuery(block)

    return await this.query(`insert into blocks${shardID} ${query};`, params)
  }

  getLastIndexedBlockNumber = async (shardID: ShardID): Promise<number | null> => {
    const res = await this.query(
      `select lastBlocks${shardID}IndexedBlockNumber from indexer_state where id=0;`,
      []
    )
    const lastIndexedBlock = +res[0][`lastblocks${shardID}indexedblocknumber`]

    return lastIndexedBlock || null
  }

  setLastIndexedBlockNumber = async (shardID: ShardID, num: BlockNumber): Promise<number> => {
    return this.query(
      `update indexer_state set lastBlocks${shardID}IndexedBlockNumber=$1 where id=0;`,
      [num]
    )
  }

  getBlockByNumber = async (shardId: ShardID, num: BlockNumber): Promise<Block | null> => {
    const res = await this.query(`select * from blocks${shardId} where number=$1;`, [num])

    return res[0] as Block
  }

  getBlockByHash = async (shardId: ShardID, hash: BlockHash): Promise<Block | null> => {
    const res = await this.query(`select * from blocks${shardId} where hash=$1;`, [hash])

    return res[0] as Block
  }
}
