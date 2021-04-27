import {config} from 'src/config'
import fs from 'fs'
import path from 'path'
const contractStartBlock = config.indexer.initialLogsSyncingHeight
const chainID = config.indexer.chainID

// todo filename
const sql = fs.readFileSync(path.join(__dirname, 'sql', './scheme.sql'))

export const scheme = `
    ${sql}
    
    insert into indexer_state (logs_last_synced_block_number, chain_id) 
      values (${contractStartBlock}, ${chainID}) on conflict(id) do nothing;      
`
