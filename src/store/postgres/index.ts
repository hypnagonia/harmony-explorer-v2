import {Pool} from 'pg'
import {logger} from 'src/logger'
import {scheme} from './scheme'
import {IStorage} from 'src/store/interface'
import {logTime} from 'src/utils/logTime'
import {Query, PostgresStorageOptions} from './types'
import {PostgresStorageBlock} from './Block'
import {PostgresStorageLog} from './Log'
import {PostgresStorageStakingTransaction} from './StakingTransaction'
import {PostgresStorageTransaction} from './Transaction'
import {PostgresStorageIndexer} from 'src/store/postgres/Indexer'
import {PostgresStorageInternalTransaction} from 'src/store/postgres/InternalTransaction'
import {PostgresStorageAddress} from 'src/store/postgres/Address'
import {PostgresStorageContract} from 'src/store/postgres/Contract'
import LoggerModule from 'zerg/dist/LoggerModule'
import {ShardID, CountableEntities} from 'src/types'
import {mapNamingReverse} from 'src/store/postgres/queryMapper'

const defaultRetries = 3

const sleep = () => new Promise((r) => setTimeout(r, 1000))

export class PostgresStorage implements IStorage {
  db: Pool
  block: PostgresStorageBlock
  log: PostgresStorageLog
  transaction: PostgresStorageTransaction
  internalTransaction: PostgresStorageInternalTransaction
  indexer: PostgresStorageIndexer
  staking: PostgresStorageStakingTransaction
  address: PostgresStorageAddress
  contract: PostgresStorageContract
  isStarted = false
  isStarting = false
  l: LoggerModule
  options: PostgresStorageOptions
  shardID: ShardID

  constructor(options: PostgresStorageOptions) {
    this.shardID = options.shardID
    this.block = new PostgresStorageBlock(this.query)
    this.log = new PostgresStorageLog(this.query)
    this.transaction = new PostgresStorageTransaction(this.query)
    this.internalTransaction = new PostgresStorageInternalTransaction(this.query)
    this.staking = new PostgresStorageStakingTransaction(this.query, this.shardID)
    this.indexer = new PostgresStorageIndexer(this.query)
    this.address = new PostgresStorageAddress(this.query)
    this.contract = new PostgresStorageContract(this.query)

    this.l = logger(module, `shard${options.shardID}`)
    this.options = options

    this.db = new Pool({
      user: options.user,
      host: options.host,
      database: options.database,
      password: options.password,
      port: options.port,
      max: options.poolSize,
    })
  }

  async start() {
    const p = this.options
    this.l.info(`postgres://${p.user}@${p.host}:${p.port}/${p.database} starting...`)

    this.isStarting = true
    await this.migrate()
    this.isStarted = true
    this.isStarting = false
    this.l.info('Done')
  }

  async migrate() {
    await this.db.query(scheme)
  }

  query: Query = async (sql: string, params: any[] = [], retries = defaultRetries) => {
    // lazy start
    if (!this.isStarted && !this.isStarting) {
      return this.start().then(() => this.query(sql, params, retries))
    }

    if (this.isStarting) {
      return sleep().then(() => this.query(sql, params, retries))
    }

    try {
      return this.queryWithoutRetry(sql, params)
    } catch (e) {
      const retriesLeft = retries - 1
      if (retriesLeft > 0) {
        await new Promise((r) => setTimeout(r, 1000))
        return this.query(sql, params, retriesLeft)
      }
      this.l.warn(`Query failed in ${defaultRetries} attempts`, {sql, params})
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
      this.l.debug(e.message || e, {sql, params})
      throw new Error(e)
    }
  }

  // approximate count
  getCount = async (table: CountableEntities) => {
    const [
      {reltuples: count},
    ] = await this.query(`select reltuples::bigint from pg_catalog.pg_class where relname = $1`, [
      mapNamingReverse[table] || table,
    ])

    return {count}
  }

  async stop() {
    await this.db.end()
  }
}
