import {isHexString, isLength, isUint, isShardAvailable, CurryParamValidator} from './validators'

export const isShard: CurryParamValidator = (value: number) => () => [
  isUint(value, {min: 0, max: 3}),
  isShardAvailable(value),
]
export const isBlockNumber: CurryParamValidator = (value: number) => () => isUint(value, {min: 0})

export const isBlockHash: CurryParamValidator = (value: string) => () => [
  isHexString(value),
  isLength(value, {min: 66, max: 66}),
]

export const isTransactionHash: CurryParamValidator = (value: string) => () => [
  isHexString(value),
  isLength(value, {min: 66, max: 66}),
]

export const isAddress: CurryParamValidator = (value: string) => () => [
  isHexString(value),
  isLength(value, {min: 42, max: 42}),
]

export const isOffset: CurryParamValidator = (value: number) => () => isUint(value, {min: 0})
export const isLimit: CurryParamValidator = (value: number) => () => isUint(value, {min: 0})
