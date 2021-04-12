import {config} from 'src/indexer/config'
import fs from 'fs'
import path from 'path'
const contractStartBlock = config.indexer.initialLogsSyncingHeight

// todo filename
const sql = fs.readFileSync(path.join(__dirname, './scheme.sql'))

export const scheme = `
    ${sql}
    
    insert into indexer_state (logs_last_synced_block_number) 
      values (${contractStartBlock}) on conflict(id) do nothing;      
`
