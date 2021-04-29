import {IABI} from 'src/indexer/indexer/contracts/types'
import {ByteCode, Address} from 'src/types'

import Web3 from 'web3'
import * as RPCClient from 'src/indexer/rpc/client'

const web3 = new Web3()

export const ABIManager = (abi: IABI) => {
  const entries = abi
    .filter(({type}) => ['function', 'event'].includes(type))
    .map((e) => {
      let signature = ''
      if (e.type === 'function') {
        signature = web3.eth.abi.encodeFunctionSignature(e)
      } else if (e.type === 'event') {
        signature = web3.eth.abi.encodeEventSignature(e)
      }

      if (e.type === 'function' && (!e.outputs || !e.outputs.length)) {
        throw new Error(`outputs definition expected for function "${e.name}"`)
      }

      return {
        name: e.name,
        type: e.type,
        signature,
        signatureWithout0x: signature.slice(2),
        outputs: e.outputs ? e.outputs.map((e) => e.type) : [],
      }
    })

  const hasAllSignatures = (names: string[], hexData: ByteCode) =>
    names.reduce((acc, name) => {
      const entry = entries.find((e) => e.name === name)
      if (!entry || !entry.signatureWithout0x) {
        return false
      }

      return hexData.indexOf(entry.signatureWithout0x) !== -1 && acc
    }, true)

  const callAll = (address: Address, methods: string[]) => {
    return Promise.all(
      methods.map(async (method) => {
        const entry = entries.find((e) => e.name === method)
        if (!entry || entry.type !== 'function') {
          throw new Error(`${method} not found`)
        }

        const response = await RPCClient.call(0, {
          to: address,
          data: entry.signature,
        })

        const result = web3.eth.abi.decodeParameters(entry!.outputs, response)['0']
        return {[entry.name]: result}
      })
    ).then((r) => r.reduce((a, b) => ({...a, ...b}), {}))
  }

  return {
    entries,
    hasAllSignatures,
    callAll,
  }
}
