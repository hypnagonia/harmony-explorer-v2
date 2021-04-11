export type RPCETHMethod = 'eth_getBlockByNumber' | 'eth_getTransactionByHash' | 'eth_getLogs'
export type RPCHarmonyMethod = 'hmy_getBlockByNumber' | 'hmy_getTransactionByHash'
export type ShardID = 0 | 1 | 2 | 3

export type BlockHexNumber = string
export type BlockHash = string
export type BlockNumber = number

export type RPCBlock = {
  difficulty: string
  extraData: string
  gasLimit: string
  gasUsed: string
  hash: BlockHash
  logsBloom: LogsBloom
  miner: string
  mixHash: string
  nonce: string
  number: BlockHexNumber
  parentHash: string
  receiptsRoot: string
  sha3Uncles: string
  size: string
  stateRoot: string
  timestamp: string
  transactions: RPCTransaction[]
  transactionsRoot: string
  uncles: string[]
}

export type LogsBloom = string

export type RPCBlockHarmony = {
  difficulty: string
  extraData: string
  gasLimit: string
  gasUsed: string
  hash: BlockHash
  logsBloom: LogsBloom
  miner: string
  mixHash: string
  nonce: string
  number: BlockHexNumber
  parentHash: string
  receiptsRoot: string
  sha3Uncles: string
  size: string
  stateRoot: string
  timestamp: string
  transactions: RPCTransactionHarmony[]
  stakingTransactions: string[] // todo
  transactionsRoot: string
  uncles: string[]
  epoch: string
  viewID: string
}

type Modify<T, R> = Omit<T, keyof R> & R

export type Block = Modify<
  RPCBlock,
  {
    number: BlockNumber
    epoch: number
    difficulty: number
    gasLimit: number
    gasUsed: number
    nonce: number
    size: number
  }
>

export type Address = string
export type AddressHarmony = string

export type TransactionHash = string
export type TransactionHarmony = string

export type RPCTransaction = {
  blockHash: BlockHash
  blockNumber: BlockHexNumber
  from: Address
  to: Address
  gas: string
  gasPrice: string
  hash: TransactionHash
  input: ByteCode
  nonce: string
  r: string
  s: string
  timestamp: string
  transactionIndex: string
  v: string
  value: string
}

export type RPCTransactionHarmony = {
  blockHash: BlockHash
  blockNumber: BlockHexNumber
  from: AddressHarmony
  to: AddressHarmony
  gas: string
  gasPrice: string
  hash: TransactionHarmony
  input: ByteCode
  nonce: string
  r: string
  s: string
  shardID: ShardID
  timestamp: string
  toShardID: ShardID
  transactionIndex: string
  v: string
  value: string
}

export type Topic = string
export type ByteCode = string

export type Log = {
  address: Address
  topics: Topic[]
  data: ByteCode
  blockNumber: BlockHexNumber
  transactionHash: TransactionHash
  transactionIndex: string
  blockHash: BlockHash
  logIndex: string
  removed: boolean
}

export type TraceCallTypes = 'CALL' | 'STATICCALL' | 'CREATE' | 'CREATE2' | 'DELEGATECALL'

// how to extract see explorer-dashboard
export type TraceCallErrorToRevert = string

export type TraceCall = {
  error?: TraceCallErrorToRevert
  from: Address
  to: Address
  gas: string
  gasUsed: string
  input: ByteCode
  output: ByteCode
  time: string
  type: TraceCallTypes
  value: string
  calls: TraceCall[]
}

export type Transaction = {
  harmony: RPCTransactionHarmony
  eth: RPCTransaction
}
