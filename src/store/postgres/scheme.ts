import {config} from 'src/indexer/config'
import fs from 'fs'
const contractStartBlock = config.indexer.initialLogsSyncingHeight

const sql = fs.readFileSync('./scheme.sql')

export const scheme = `
    ${sql}
    
    insert into indexer_state (lastLogs0IndexedBlockNumber) 
      values (${contractStartBlock}) on conflict(id) do nothing;      
`
