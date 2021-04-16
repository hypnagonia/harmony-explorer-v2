import {isHexString, isLength, isUint, isShardAvailable} from './validators'

export const isShard = (value: number) => () => [
  isUint(value, {min: 0, max: 3}),
  isShardAvailable(value),
]
export const isBlockNumber = (value: number) => () => isUint(value, {min: 0})

export const isBlockHash = (value: string) => () => [
  isHexString(value),
  isLength(value, {min: 66, max: 66}),
]

export const isTransactionHash = (value: string) => () => [
  isHexString(value),
  isLength(value, {min: 66, max: 66}),
]

export const isAddress = (value: string) => () => [
  isHexString(value),
  isLength(value, {min: 42, max: 42}),
]

export const isOffset = (value: number) => () => isUint(value, {min: 0})
export const isLimit = (value: number) => () => isUint(value, {min: 0})
