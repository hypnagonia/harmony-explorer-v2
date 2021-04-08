import {Pool} from 'pg'
import {config} from 'src/indexer/config'
import {logger} from 'src/logger'
import {scheme} from './scheme'
import {IStorage} from 'src/store/interface'
import {Block, ShardID} from 'src/types/blockchain'
import {store} from 'src/store'

const l = logger(module, 'storage')

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

  getBlockByNumber = async (shardId: ShardID, num: number): Promise<Block | null> => {
    const res = await this.query(`select * from blocks${shardId} where number=$1;`, [num])

    return res[0] as Block
  }

  getBlockByHash = async (shardId: ShardID, hash: string): Promise<Block | null> => {
    const res = await this.query(`select * from blocks${shardId} where hash=$1;`, [hash])

    return res[0] as Block
  }

  async start() {
    l.info('Starting...')
    await this.query('select 1;')

    await this.migrate()

    l.info('Done')
  }

  async migrate() {
    await this.db.query(scheme)
  }

  async query(sql: string, params: any[] = [], retries = 3): Promise<any> {
    try {
      return this.queryWithoutRetry(sql, params)
    } catch (e) {
      const retriesLeft = retries - 1
      if (retriesLeft > 0) {
        return this.query(sql, params, retriesLeft)
      }

      throw new Error(e)
    }
  }

  async queryWithoutRetry(sql: string, params: any[] = []) {
    try {
      const res = await this.db.query(sql, params)
      return res.rows
    } catch (e) {
      l.error(e.message || e)
      throw new Error(e)
    }
  }

  async stop() {
    await this.db.end()
  }
}

/*
  async setPostProcessed (postId) {
    return await this.query('update posts set is_posted = true where id = $1', [postId])
  }

  async getPosts (fromId) {
    return await this.query('select * from posts where id>$1 and is_posted=false;', [fromId])
  }

  async getCities () {
    return await this.query('select * from cities;')
  }

  async addCity (city) {
    return await this.query(
      'insert into cities(city_id,city_title) values ($1,$2)',
      [city.city_id, city.city_title])
  }

  async getTasks () {
    return await this.query('select * from tasks;')
  }

  async addTasks (tasks) {
    return await this.query(
      'insert into tasks(query, tags) select * from unnest ($1::text[], $2::text[])',
      [tasks.map(t => t.query), tasks.map(t => t.tags)]
    )
  }

  async addPosts (posts) {
    for (const post of posts) {
      await this.query(
        `insert into posts(name,text,group_id,members_count,likes_count,reposts_count,
          comments_count,posted_at,city_id,city_title,task_id,id,image_url,post_id
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         on conflict (group_id) do nothing;`,
        [
          post.name,
          post.text,
          post.group_id,
          post.members_count,
          post.likes_count,
          post.reposts_count,
          post.comments_count,
          post.created_at,
          post.city_id,
          post.city_title,
          post.task_id,
          post.id,
          post.image_url,
          post.post_id
        ]
      )
    }
  }
 */
