import {body, validationResult, buildCheckFunction, ValidationChain} from 'express-validator'
import {Request, Response, NextFunction} from 'express'

export const checkQuery = buildCheckFunction(['params'])

// https://github.com/validatorjs/validator.js#validators
// isHexadecimal
export const isHexStringValidator = (f: any) => {
  // @ts-ignore
  return f.custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('should be hex string starting with 0x')
    }
    return true
  })
}

// todo
export const isInt = (f: any) => f.isInt({allow_leading_zeroes: false})
export const isLength64 = (f: any) => f.isLength({min: 64, max: 64})
export const isLength42 = (f: any) => f.isLength({min: 42, max: 42})

export const isShard = checkQuery('shardID').isInt({min: 0, max: 3})
export const isBlockNumber = checkQuery('blockNumber').isInt({min: 0})

const isError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  next()
}
export const validate = (args: ValidationChain[]) => [...args, isError]
