import {Response, Request, Router, NextFunction} from 'express'
import {stores} from 'src/store'
import {validate, isShard, isBlockNumber} from 'src/api/server/validators'
import {ShardID} from 'src/types/blockchain'
import {catchAsync} from 'src/api/server/utils'

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
