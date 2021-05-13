import {Response, Request, Router, NextFunction} from 'express'
import {stores} from 'src/store'
import * as controllers from 'src/api/controllers'
import {ShardID} from 'src/types/blockchain'
import {catchAsync} from 'src/api/rest/utils'
import {FilterEntry, Filter, FilterType, FilterOrderDirection, FilterOrderBy} from 'src/types'
import {transactionRouter} from 'src/api/rest/routes/transaction'

export const erc20Router = Router({mergeParams: true})

erc20Router.get('/', catchAsync(getAllERC20))

export async function getAllERC20(req: Request, res: Response, next: NextFunction) {
  const data = await controllers.getAllERC20()
  next(data)
}

erc20Router.get('/address/:address/balances', catchAsync(getUserERC20Balances))

export async function getUserERC20Balances(req: Request, res: Response, next: NextFunction) {
  const {address} = req.params
  const data = await controllers.getUserERC20Balances(address)
  next(data)
}
