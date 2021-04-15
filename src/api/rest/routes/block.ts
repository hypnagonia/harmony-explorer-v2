import {Response, Request, Router, NextFunction} from 'express'
import {stores} from 'src/store'
import {validate, isShard, isBlockNumber, isBlockHash} from 'src/api/rest/validators'
import {ShardID} from 'src/types/blockchain'
import {catchAsync} from 'src/api/rest/utils'

export const blockRouter = Router({mergeParams: true})

blockRouter.get(
  '/number/:blockNumber',
  validate([isBlockNumber, isShard]),
  catchAsync(getBlockByNumber)
)

export async function getBlockByNumber(req: Request, res: Response, next: NextFunction) {
  const {blockNumber, shardID} = req.params
  const s = +shardID as ShardID
  const block = await stores[s].block.getBlockByNumber(s, +blockNumber)
  next(block)
}

blockRouter.get('/hash/:blockHash', validate([isBlockHash, isShard]), catchAsync(getBlockByHash))

export async function getBlockByHash(req: Request, res: Response, next: NextFunction) {
  const {blockHash, shardID} = req.params
  const s = +shardID as ShardID
  const block = await stores[s].block.getBlockByHash(s, blockHash)
  next(block)
}
