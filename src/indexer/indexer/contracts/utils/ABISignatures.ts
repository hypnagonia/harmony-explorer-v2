import {IABISignatures} from 'src/indexer/indexer/contracts/types'
import {ByteCode} from 'src/types'

import Web3 from 'web3'
const web3 = new Web3()

export const ABISignatures = (abi: IABISignatures) => {
  const eventsSignatures = abi.events.map((e) => web3.eth.abi.encodeEventSignature(e))
  const methodsSignatures = abi.methods.map((e) => web3.eth.abi.encodeFunctionSignature(e))
  const signatures = [...eventsSignatures, ...methodsSignatures].map((e) =>
    e.startsWith('0x') ? e.slice(2) : e
  )

  const hasAllSignatures = (hexData: ByteCode) =>
    signatures.reduce((acc, s) => hexData.indexOf(s) !== -1 && acc, true)

  return {
    signatures,
    eventsSignatures,
    methodsSignatures,
    hasAllSignatures,
  }
}
