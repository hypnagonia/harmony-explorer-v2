import {body, validationResult, buildCheckFunction, ValidationChain} from 'express-validator'
import {Request, Response, NextFunction} from 'express'

export const checkQuery = buildCheckFunction(['params'])

// https://github.com/validatorjs/validator.js#validators
// isHexadecimal
export const isHexStringValidator = (value: string) => {
  if (/^[xA-F0-9]+$/i.test(value)) {
    return true
  }

  throw new Error('should be hex string starting with 0x')
}

export const isStartWith0x = (value: string) => {
  if (value[0] === '0' && value[1] === 'x') {
    return true
  }

  throw new Error('should be hex string starting with 0x')
}

export const isShard = checkQuery('shardID').isInt({min: 0, max: 3})
export const isBlockNumber = checkQuery('blockNumber').isInt({min: 0})

const isError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400)
    next(errors.array())
    return
  }
  next()
}
export const validate = (args: ValidationChain[]) => [...args, isError]

export const isBlockHash = checkQuery('blockHash')
  .custom(isHexStringValidator)
  .custom(isStartWith0x)
  .isLength({min: 66, max: 66})
