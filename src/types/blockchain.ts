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

export type Block = {
  block: RPCBlock
  number: BlockNumber
  timestamp: Date
}

/* {
  'blockHash': '0xd45b854a0e77b709dcb9b9f0001dc262d10fb373c1bbd235e342eb32df65307d',
  'blockNumber': '0x6c25ae',
  'from': 'one1437j7lqq54v9ng7qqs0x7cf42tqkcz4thckwua',
  'gas': '0x66916c',
  'gasPrice': '0x3b9aca00',
  'hash': '0x3a0a89691adecb2b4891b3daabdc17f1a906d007497cd6325433f9a7d1b75559',
  'input': '0xd788fa88000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000003616674000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036166740000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e516d574e4d544132384c74374669653352353747557750324668376345634b6a366556414462737a4b7062316d6b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001568747470733a2f2f697066732e696f2f697066732f0000000000000000000000',
  'nonce': '0xa61',
  'r': '0x7355cf0688d19a9516541ede0c66b2dfb888f8315dec16d0d836f190d4670a8f',
  's': '0x6d4c574d4e112572032451cc716a4c867e7ac63772fe40ce078de8f1b3c1ec5f',
  'shardID': 0,
  'timestamp': '0x604f6359',
  'to': 'one1m8qlcmxdjwe7rk8w3llsr8ykq2j6kgcfsgs05g',
  'toShardID': 0,
  'transactionIndex': '0x0',
  'v': '0x27',
  'value': '0x0'
}*/

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

export type TraceCallTypes = 'CALL' | 'STATICCALL' | 'CREATE' | 'CREATE2'

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
