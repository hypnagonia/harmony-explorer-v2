import {Response, Request, Router, NextFunction} from 'express'
import * as controllers from 'src/api/controllers'
import {catchAsync} from 'src/api/rest/utils'

export const erc1155Router = Router({mergeParams: true})

erc1155Router.get('/', catchAsync(getAllERC1155))

export async function getAllERC1155(req: Request, res: Response, next: NextFunction) {
  const data = await controllers.getAllERC1155()
  next(data)
}

/*
erc721Router.get('/address/:address/balances', catchAsync(getUserERC721Assets))

export async function getUserERC721Assets(req: Request, res: Response, next: NextFunction) {
  const {address} = req.params
  const data = await controllers.getUserERC721Assets(address)
  next(data)
}
*/

erc1155Router.get('/token/:address/balances', catchAsync(getTokenERC1155Assets))

export async function getTokenERC1155Assets(req: Request, res: Response, next: NextFunction) {
  const {address} = req.params
  const data = await controllers.getTokenERC1155Assets(address)
  next(data)
}
