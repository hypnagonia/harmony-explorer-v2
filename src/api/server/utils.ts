import {Response, Request, Router, NextFunction} from 'express'

export const catchAsync = (f: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await f(req, res, next)
    } catch (err) {
      console.log('grgd')
      next(err)
    }
  }
}
