import {Contract, IERC1155} from 'src/types'
import {validator, isUint, isLength} from 'src/utils/validators/validators'
import {logger} from 'src/logger'
import {PostgresStorage} from 'src/store/postgres'
import {ABI} from './ABI'
import {getByIPFSHash} from 'src/indexer/utils/ipfs/index'

const {hasAllSignatures, callAll} = ABI
const l = logger(module, 'erc1155')

// https://eips.ethereum.org/EIPS/eip-20
const expectedMethodsAndEvents = [
  'TransferSingle',
  'TransferBatch',
  // 'totalSupply',
  'owner',
  'tokenURIPrefix',
  'balanceOfBatch',
  'contractURI',
]

const callableMethods = ['contractURI'] // ['symbol', 'name']
const maxMetaLength = 20000

export const addContract = async (store: PostgresStorage, contract: Contract) => {
  if (!hasAllSignatures(expectedMethodsAndEvents, contract.bytecode)) {
    return
  }

  let params: Record<typeof callableMethods[number], string>
  let meta = {
    name: '',
    symbol: '',
  }
  let metaJSON = ''

  try {
    params = await callAll(contract.address, callableMethods)

    validator({
      contractURI: () => isLength(params.contractURI, {min: 46, max: 46}),
    })

    meta = await getByIPFSHash(params.contractURI)
    metaJSON = JSON.stringify(meta)

    if (metaJSON.length > maxMetaLength) {
      throw new Error('Meta is too big')
    }

    validator({
      name: () => isLength(meta.name, {min: 3, max: 64}),
      symbol: () => isLength(meta.symbol, {min: 3, max: 10}),
    })
  } catch (err) {
    l.debug(`Failed to get contract ${contract.address} info`, err.message || err)
    return
  }

  const erc1155: IERC1155 = {
    address: contract.address,
    name: meta.name,
    symbol: meta.symbol,
    lastUpdateBlockNumber: contract.blockNumber,
    meta: metaJSON,
    contractURI: params.contractURI,
  }

  l.info(`Found new contract "${erc1155.name}" ${contract.blockNumber}`)

  await store.erc1155.addERC1155(erc1155)
}
