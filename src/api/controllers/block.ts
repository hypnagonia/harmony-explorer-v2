import {Response, Request, Router, NextFunction} from 'express'
import {stores} from 'src/store'
import {ShardID} from 'src/types/blockchain'
import {validator} from 'src/api/validators/validators'
import {isBlockHash, isBlockNumber, isShard} from 'src/api/validators'

export async function getBlockByNumber(shardID: ShardID, blockNumber: number) {
  validator({
    shardID: isShard(shardID),
    blockNumber: isBlockNumber(blockNumber),
  })
  return await stores[shardID].block.getBlockByNumber(shardID, blockNumber)
}

export async function getBlockByHash(shardID: ShardID, blockHash: string) {
  validator({
    shardID: isShard(shardID),
    blockNumber: isBlockHash(blockHash),
  })
  return await stores[shardID].block.getBlockByHash(shardID, blockHash)
}
