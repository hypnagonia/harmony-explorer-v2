import {Response, Request, Router, NextFunction} from 'express'
import * as controllers from 'src/api/controllers'
import {ShardID} from 'src/types/blockchain'
import {catchAsync} from 'src/api/rest/utils'

export const signatureRouter = Router({mergeParams: true})

signatureRouter.get('/:hash', catchAsync(getLogsByBlockNumber))

export async function getLogsByBlockNumber(req: Request, res: Response, next: NextFunction) {
  const {hash} = req.params

  const signatures = await controllers.getSignaturesByHash(hash)
  console.log({signatures})
  next(signatures)
}
