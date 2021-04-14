import {Response, Request, Router} from 'express'
import {stores} from 'src/store'

export const blockRouter = Router({mergeParams: true})

blockRouter.get('/number/:number', getBlockByNumber)

export async function getBlockByNumber(req: Request, res: Response) {
  try {
    const {number, shardID} = req.params

    if (!number) {
      res.status(500)
      return
    }

    const block = await stores[0].block.getBlockByNumber(0, +number)
    res.json(block)
  } catch (err) {
    res.status(500).json({status: 'ERROR'})
  }
}
