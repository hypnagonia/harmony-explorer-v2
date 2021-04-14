import {logger} from 'src/logger'
import {IStorageTransaction} from 'src/store/interface'
import {Block, BlockHash, BlockNumber, ShardID} from 'src/types/blockchain'

import {Query} from 'src/store/postgres/types'

export class PostgresStorageTransaction implements IStorageTransaction {
  query: Query
  constructor(query: Query) {
    this.query = query
  }
}
