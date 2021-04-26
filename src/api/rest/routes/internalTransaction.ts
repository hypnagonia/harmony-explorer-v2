import {Response, Request, Router, NextFunction} from 'express'
import * as controllers from 'src/api/controllers'
import {ShardID} from 'src/types/blockchain'
import {catchAsync} from 'src/api/rest/utils'
import {FilterEntry, Filter, FilterType, FilterOrderDirection, FilterOrderBy} from 'src/types'

export const internalTransactionRouter = Router({mergeParams: true})

internalTransactionRouter.get('/block/number/:blockNumber', catchAsync(getTransactionBlockNumber))

export async function getTransactionBlockNumber(req: Request, res: Response, next: NextFunction) {
  const {blockNumber, shardID} = req.params
  const s = +shardID as ShardID
  const txs = await controllers.getTransactionByField(s, 'block_number', +blockNumber)
  next(txs)
}

internalTransactionRouter.get(
  '/block/hash/:blockHash',
  catchAsync(getInternalTransactionsByBlockHash)
)

export async function getInternalTransactionsByBlockHash(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {blockHash, shardID} = req.params
  const s = +shardID as ShardID
  const txs = await controllers.getInternalTransactionByField(s, 'block_hash', blockHash)
  next(txs)
}

internalTransactionRouter.get(
  '/transaction/hash/:txHash',
  catchAsync(getInternalTransactionsByTransactionHash)
)

export async function getInternalTransactionsByTransactionHash(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {txHash, shardID} = req.params
  const s = +shardID as ShardID
  const txs = await controllers.getInternalTransactionByField(s, 'transaction_hash', txHash)
  next(txs)
}
