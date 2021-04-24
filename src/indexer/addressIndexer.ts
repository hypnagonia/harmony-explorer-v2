import {
  Address2Transaction,
  Address,
  BlockHash,
  Block,
  TransactionHash,
  TransactionHarmonyHash,
} from 'src/types'

export const AddressIndexer = () => {
  const sets: Record<BlockHash, Set<Address>> = {}

  const add = (
    block: Block,
    transactionHash: TransactionHash | TransactionHarmonyHash,
    ...addresses: Address[]
  ) => {
    const key = `${block.number}:${transactionHash}`
    if (!sets[key]) {
      sets[key] = new Set()
    }
    const set = sets[key]

    addresses.filter((a) => a).map((address) => set.add(address))
  }

  const get = () => {
    return Object.keys(sets).reduce((a, key: BlockHash) => {
      const [blockNumber, transactionHash] = key.split(':')
      sets[key].forEach((address) => {
        a.push({blockNumber: +blockNumber, transactionHash, address})
      })

      return a
    }, [] as Address2Transaction[])
  }

  return {
    add,
    get,
  }
}
