import {Response, Request, Router, NextFunction} from 'express'
import {stores} from 'src/store'
import * as controllers from 'src/api/controllers'
import {ShardID} from 'src/types/blockchain'
import {catchAsync} from 'src/api/rest/utils'

export const blockRouter = Router({mergeParams: true})

blockRouter.get('/number/:blockNumber', catchAsync(getBlockByNumber))
export async function getBlockByNumber(req: Request, res: Response, next: NextFunction) {
  const {blockNumber, shardID} = req.params
  const s = +shardID as ShardID
  const block = await controllers.getBlockByNumber(s, +blockNumber)
  next(block)
}

blockRouter.get('/hash/:blockHash', catchAsync(getBlockByHash))
export async function getBlockByHash(req: Request, res: Response, next: NextFunction) {
  const {blockHash, shardID} = req.params
  const s = +shardID as ShardID
  const block = await controllers.getBlockByHash(s, blockHash)
  next(block)
}

/*
todo
paginated by number
paginated by timestamp
*/
