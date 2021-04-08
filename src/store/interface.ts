import {ShardID, Block} from 'src/types/blockchain'

export interface IStorage {
  addBlock: (shardId: ShardID, block: Block) => Promise<any>
  addBlocks: (shardId: ShardID, blocks: Block[]) => Promise<any>
  getBlockByNumber: (shardId: ShardID, number: number) => Promise<Block | null>
  getBlockByHash: (shardId: ShardID, hash: string) => Promise<Block | null>
  getLatestBlockNumber: (shardId: ShardID) => Promise<number | null>
}
