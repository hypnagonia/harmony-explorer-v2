import {Response, Request, Router, NextFunction} from 'express'
import {stores} from 'src/store'
import * as controllers from 'src/api/controllers'
import {ShardID} from 'src/types/blockchain'
import {catchAsync} from 'src/api/rest/utils'
import {FilterEntry, Filter, FilterType, FilterOrderDirection, FilterOrderBy} from 'src/types'

export const transactionRouter = Router({mergeParams: true})

transactionRouter.get('/block/number/:blockNumber', catchAsync(getTransactionBlockNumber))

export async function getTransactionBlockNumber(req: Request, res: Response, next: NextFunction) {
  const {blockNumber, shardID} = req.params
  const s = +shardID as ShardID
  const tx = await controllers.getTransactionByField(s, 'block_number', +blockNumber)
  next(tx)
}

transactionRouter.get('/block/hash/:blockHash', catchAsync(getTransactionByBlockHash))

export async function getTransactionByBlockHash(req: Request, res: Response, next: NextFunction) {
  const {blockHash, shardID} = req.params
  const s = +shardID as ShardID
  const tx = await controllers.getTransactionByField(s, 'block_hash', blockHash)
  next(tx)
}

transactionRouter.get('/block/hash/:blockHash', catchAsync(getTransactionByHash))

export async function getTransactionByHash(req: Request, res: Response, next: NextFunction) {
  const {blockHash, shardID} = req.params
  const s = +shardID as ShardID
  const tx = await controllers.getTransactionByField(s, 'hash', blockHash)
  next(tx)
}

/*
todo
txs by block number
tx by hash | harmony hash

paginated by address
count for address

paginated by block number
paginated by block timestamp

tx trace
tx logs
*/
