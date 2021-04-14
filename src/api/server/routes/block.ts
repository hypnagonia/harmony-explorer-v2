import {Response, Request, Router, NextFunction} from 'express'
import {stores} from 'src/store'
import {validate, isShard, isBlockNumber} from 'src/api/server/validators'
import {ShardID} from 'src/types/blockchain'
import {catchAsync} from 'src/api/server/utils'

export const blockRouter = Router({mergeParams: true})

const v = validate([isBlockNumber, isShard])

blockRouter.get('/number/:blockNumber', v, catchAsync(getBlockByNumber))

export async function getBlockByNumber(req: Request, res: Response, next: NextFunction) {
  const {blockNumber, shardID} = req.params
  const block = await stores[0].block.getBlockByNumber(+shardID as ShardID, +blockNumber)
  next(block)
}
