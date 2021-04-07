import {logger} from './logger'
import * as blockIndexer from './indexer/blockIndexer'

const l = logger(module)

l.info('Indexer starting...')

blockIndexer.loop()
