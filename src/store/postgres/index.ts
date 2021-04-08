import {Pool} from 'pg'
import {config} from 'src/indexer/config'
import {logger} from 'src/logger'
import {scheme} from './scheme'
import {IStorage} from 'src/store/interface'
import {Block, BlockHash, BlockNumber, Log, ShardID} from 'src/types/blockchain'
import {store} from 'src/store'
import {logTime} from 'src/utils/logTime'

const l = logger(module)
const defaultRetries = 3

export class PostgresStorage implements IStorage {
  db: Pool

  constructor() {
    const c = config.store.postgres

    this.db = new Pool({
      user: c.user,
      host: c.host,
      database: c.database,
      password: c.password,
      port: c.port,
      max: 90,
    })
  }

  addBlocks = async (shardID: ShardID, blocks: Block[]) => {
    return Promise.all(blocks.map((b) => store.addBlock(shardID, b)))
  }

  addBlock = async (shardID: ShardID, block: Block) => {
    return await this.query(
      `insert into blocks${shardID}
       (number,hash,timestamp,raw) values
       ($1,$2,$3,$4);`,
      [block.number, block.block.hash, block.timestamp, JSON.stringify(block.block)]
    )
  }

  // todo dedicated status table instead of max()?
  getLatestBlockNumber = async (shardId: ShardID): Promise<number | null> => {
    const res = await this.query(`select max(number) from blocks${shardId};`, [])

    return +res[0].max as number
  }

  getBlockByNumber = async (shardId: ShardID, num: BlockNumber): Promise<Block | null> => {
    const res = await this.query(`select * from blocks${shardId} where number=$1;`, [num])

    return res[0] as Block
  }

  getBlockByHash = async (shardId: ShardID, hash: BlockHash): Promise<Block | null> => {
    const res = await this.query(`select * from blocks${shardId} where hash=$1;`, [hash])

    return res[0] as Block
  }

  addLog = async (shardId: ShardID, block: Log): Promise<any> => {}

  getLogsByTransactionHash = async (
    shardId: ShardID,
    TransactionHash: string
  ): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs${shardId} where transactionHash=$1;`, [
      TransactionHash,
    ])

    return res as Log[]
  }
  getLogsByBlockNumber = async (shardId: ShardID, num: BlockNumber): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs${shardId} where blockNumber=$1;`, [num])

    return res as Log[]
  }
  getLogsByBlockHash = async (shardId: ShardID, hash: BlockHash): Promise<Log[] | null> => {
    const res = await this.query(`select * from logs${shardId} where blockHash=$1;`, [hash])

    return res as Log[]
  }

  async start() {
    l.info('Starting...')
    await this.migrate()

    l.info('Done')
  }

  async migrate() {
    await this.db.query(scheme)
  }

  async query(
    sql: string,
    params: any[] = [],
    retries = defaultRetries,
    force = false
  ): Promise<any> {
    try {
      return this.queryWithoutRetry(sql, params)
    } catch (e) {
      const retriesLeft = retries - 1
      if (retriesLeft > 0) {
        return this.query(sql, params, retriesLeft)
      }
      l.warn(`Query failed in ${defaultRetries} attempts`, {sql, params})
      throw new Error(e)
    }
  }

  private async queryWithoutRetry(sql: string, params: any[] = []) {
    const time = logTime()

    try {
      const {rows} = await this.db.query(sql, params)
      const timePassed = time()
      l.debug(`Query completed in ${timePassed} ${sql}`, params)

      if (timePassed.val > 5000) {
        l.warn(`Query took ${timePassed}`, {sql, params})
      }

      return rows
    } catch (e) {
      l.error(e.message || e)
      throw new Error(e)
    }
  }

  async stop() {
    await this.db.end()
  }
}
