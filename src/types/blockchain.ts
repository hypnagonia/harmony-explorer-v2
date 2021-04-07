export type RPCETHMethod = 'eth_getBlockByNumber'
export type RPCHarmonyMethod = 'hmy_getBlockByNumber'

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
  transactions: string[]
  transactionsRoot: string
  uncles: string[]
}

export type Block = {
  block: RPCBlock
  number: number
  timestamp: number
}

export type RPCTransaction = {}

export type Transaction = {}
