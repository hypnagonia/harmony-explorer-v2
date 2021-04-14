import {Response, Request, Router, NextFunction} from 'express'
import {stores} from 'src/store'
import {validate, isShard, isBlockNumber} from 'src/api/server/validators'
import {ShardID} from 'src/types/blockchain'

export const blockRouter = Router({mergeParams: true})

const v = validate([isBlockNumber, isShard])
blockRouter.get('/number/:blockNumber', v, getBlockByNumber)

export async function getBlockByNumber(req: Request, res: Response, next: NextFunction) {
  try {
    const {blockNumber, shardID} = req.params
    const block = await stores[0].block.getBlockByNumber(+shardID as ShardID, +blockNumber)
    next(block)
  } catch (err) {
    next(err)
  }
}
