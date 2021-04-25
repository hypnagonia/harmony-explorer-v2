import {Response, Request, Router, NextFunction} from 'express'
import {stores} from 'src/store'
import * as controllers from 'src/api/controllers'
import {ShardID} from 'src/types/blockchain'
import {catchAsync} from 'src/api/rest/utils'
import {FilterEntry, Filter, FilterType, FilterOrderDirection, FilterOrderBy} from 'src/types'

export const addressRouter = Router({mergeParams: true})

addressRouter.get('/:address/transactions', catchAsync(getRelatedTransactions))

export async function getRelatedTransactions(req: Request, res: Response, next: NextFunction) {
  const {shardID, address} = req.params
  const {offset, limit, orderBy, orderDirection, type, property, value} = req.query

  const filterEntries: FilterEntry[] = []

  if (type && value && property) {
    filterEntries.push({type, property, value} as FilterEntry)
  }

  const filter: Filter = {
    offset: (+offset! as number) || 0,
    limit: (+limit! as number) || 0,
    orderBy: (orderBy as FilterOrderBy) || 'block_number',
    orderDirection: (orderDirection as FilterOrderDirection) || 'desc',
    filters: filterEntries,
  }

  const s = +shardID as ShardID
  const block = await controllers.getRelatedTransactions(s, address, filter)
  next(block)
}
