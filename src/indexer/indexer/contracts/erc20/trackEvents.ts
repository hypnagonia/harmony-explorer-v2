import {Log} from 'src/types'
import {PostgresStorage} from 'src/store/postgres'
import {ABI} from './ABI'

const {hasAllSignatures, getEntryByName} = ABI

export const trackEvents = async (store: PostgresStorage, logs: Log[]) => {}

// if transfer from 0 supply +
// it transfer address balance -- address balance ++
// if transfer to 0 supply --
