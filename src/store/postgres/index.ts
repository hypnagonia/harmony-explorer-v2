import {Pool} from 'pg'
import {config} from 'src/indexer/config'
import {logger} from 'src/logger'
import {scheme} from './scheme'
import {IStorage} from 'src/store/interface'
import {Block, BlockHash, BlockNumber, Log, ShardID} from 'src/types/blockchain'
import {logTime} from 'src/utils/logTime'
import {Query} from './types'
import {PostgresStorageBlock} from './Block'
import {PostgresStorageLog} from './Log'

const l = logger(module)
const defaultRetries = 3

export class PostgresStorage implements IStorage {
  db: Pool
  block: PostgresStorageBlock
  log: PostgresStorageLog

  constructor() {
    this.block = new PostgresStorageBlock(this.query)
    this.log = new PostgresStorageLog(this.query)

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

  async start() {
    l.info('Starting...')
    await this.migrate()

    l.info('Done')
  }

  async migrate() {
    await this.db.query(scheme)
  }

  query: Query = async (sql: string, params: any[] = [], retries = defaultRetries) => {
    try {
      return this.queryWithoutRetry(sql, params)
    } catch (e) {
      const retriesLeft = retries - 1
      if (retriesLeft > 0) {
        await new Promise((r) => setTimeout(r, 1000))
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
      // l.debug(`Query completed in ${timePassed} ${sql}`, params)

      /*
      if (timePassed.val > 10000) {
        l.debug(`Query took ${timePassed}`, { sql, params })
      }
      */

      return rows
    } catch (e) {
      l.debug(e.message || e, {sql, params})
      throw new Error(e)
    }
  }

  async stop() {
    await this.db.end()
  }
}
