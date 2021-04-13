import {PostgresStorage} from 'src/store/postgres'
import {logger} from 'src/logger'
import {config} from 'src/indexer/config'

const l = logger(module)
const p = config.store.postgres
l.info(`Store postgres://${p.user}@${p.host}:${p.port}/${p.database}`)
export const store = new PostgresStorage()
