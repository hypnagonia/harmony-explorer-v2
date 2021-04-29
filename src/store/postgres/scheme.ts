import {config} from 'src/config'
import fs from 'fs'
import path from 'path'
const contractStartBlock = config.indexer.initialLogsSyncingHeight
const chainID = config.indexer.chainID

// todo filename
const sql = fs.readFileSync(path.join(__dirname, 'sql', './scheme.sql'))

export const scheme = `
    ${sql}
    
    insert into indexer_state (indexer_name, last_synced_block_number, chain_id) 
      values ('blocks',0, ${chainID}) on conflict(indexer_name) do nothing;

    insert into indexer_state (indexer_name, last_synced_block_number, chain_id) 
      values ('logs',${contractStartBlock}, ${chainID}) on conflict(indexer_name) do nothing;            
`
