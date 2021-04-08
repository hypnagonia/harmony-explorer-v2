export type RPCETHMethod = 'eth_getBlockByNumber' | 'eth_getTransactionByHash'
export type RPCHarmonyMethod = 'hmy_getBlockByNumber' | 'hmy_getTransactionByHash'
export type ShardID = 0 | 1 | 2 | 3

/*
      difficulty: '0x0',
      extraData: '0x',
      gasLimit: '0x4c4b400',
      gasUsed: '0x0',
      hash: '0x748f4ca121f5eb6dbd716baed959d6b2592cf6f60e5b0976971277ae58e1cfb3',
      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      miner: '0x261fa45c6a09cd3faa277d829e91d9473973357c',
      mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      nonce: '0x0000000000000000',
      number: '0x3d0900',
      parentHash: '0x014e2b2a488b2a2c437d26c271f05f15b3ac9de6d44cc776ec7a23d709a33e48',
      receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
      size: '0x2a8',
      stateRoot: '0x7c9c67435d7a7999bdc43dc1cc54e5bd4393729a96a1d082b1cc41c5bef1a50e',
      timestamp: '0x5feb90b3',
      transactions: [],
      transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      uncles: []
 */

export type BlockID = string

export type RPCBlock = {
  difficulty: string
  extraData: string
  gasLimit: string
  gasUsed: string
  hash: BlockID
  logsBloom: string
  miner: string
  mixHash: string
  nonce: string
  number: string
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

export type RPCBlockHarmony = {
  difficulty: string
  extraData: string
  gasLimit: string
  gasUsed: string
  hash: BlockID
  logsBloom: string
  miner: string
  mixHash: string
  nonce: string
  number: string
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
  number: number
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

export type txHash = string
export type txHashHarmony = string

export type RPCTransaction = {
  blockHash: BlockID
  blockNumber: number
  from: Address
  gas: string
  gasPrice: string
  hash: txHash
  input: string
  nonce: string
  r: string
  s: string
  timestamp: string
  to: Address
  transactionIndex: string
  v: string
  value: string
}

export type RPCTransactionHarmony = {
  blockHash: BlockID
  blockNumber: number
  from: AddressHarmony
  gas: string
  gasPrice: string
  hash: txHashHarmony
  input: string
  nonce: string
  r: string
  s: string
  shardID: ShardID
  timestamp: string
  to: AddressHarmony
  toShardID: ShardID
  transactionIndex: string
  v: string
  value: string
}

export type Transaction = {
  harmony: RPCTransactionHarmony
  eth: RPCTransaction
}

// todo staking

eth = {
  jsonrpc: '2.0',
  id: 1,
  result: {
    hash: '0x4d997d37e68534502d488104840080a82eaf26bb2c05d1728cd3f04c4477245c',
    number: '0xaf2abb',
    stateRoot: '0xc0bba63cba4ee730f850d5e8560f06b691e2c5490d0b334467f80e89f4c72d67',
    timestamp: '0x606efb17',
    transactions: [
      {
        hash: '0x2a5ea44dc8d9e9fde37876818646c6781327076fbbffb0a84fa075b8112a531a',
        blockHash: '0x4d997d37e68534502d488104840080a82eaf26bb2c05d1728cd3f04c4477245c',
        blockNumber: '0xaf2abb',
        from: '0x7252c42d6c9abae1b4b79c08626e820566373d15',
        to: '0x5d82c86f72331bf75ce1838212118624c882270a',
      },
    ],
  },
}
hmy = {
  jsonrpc: '2.0',
  id: 1,
  result: {
    hash: '0x4d997d37e68534502d488104840080a82eaf26bb2c05d1728cd3f04c4477245c',
    number: '0xaf2abb',
    timestamp: '0x606efb17',
    transactions: [
      {
        blockHash: '0x4d997d37e68534502d488104840080a82eaf26bb2c05d1728cd3f04c4477245c',
        blockNumber: '0xaf2abb',
        hash: '0xc4cb6824a04cc9b363deac7d19f09d5fe6ec7d8966462316c75708f8132f4a77',
        from: 'one1wx6p8kjucu5llqz79h9pmn0qf55772m2d2xt26',
        to: 'one1tkpvsmmjxvdlwh8pswppyyvxynygyfc2cj457u',
      },
    ],
  },
}
