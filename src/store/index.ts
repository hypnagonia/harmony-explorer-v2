import {PostgresStorage} from 'src/store/postgres'
import {logger} from 'src/logger'
import {config} from 'src/indexer/config'

const l = logger(module)

l.info(
  `Store postgres://${config.store.postgres.user}@${config.store.postgres.host}:${config.store.postgres.port}/${config.store.postgres.database}`
)
export const store = new PostgresStorage()
