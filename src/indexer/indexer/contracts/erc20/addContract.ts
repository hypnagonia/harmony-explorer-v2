import {Address, ByteCode, Contract} from 'src/types'
import ERC20ABI from './ERC20ABI.json'
import {ContractTracker, IABI} from 'src/indexer/indexer/contracts/types'
import {ABIManager} from 'src/indexer/indexer/contracts/utils/ABIManager'

const {hasAllSignatures, callAll} = ABIManager(ERC20ABI as IABI)

// https://eips.ethereum.org/EIPS/eip-20
const expectedMethodsAndEvents = [
  'Transfer',
  'Approval',
  'totalSupply',
  'decimals',
  'transfer',
  'balanceOf',
  'symbol',
  'name',
  'approve',
]

const callableMethods = ['symbol', 'name', 'decimals']

export const addContract = async (contract: Contract) => {
  // console.log('contract', contract.address)
  if (!hasAllSignatures(expectedMethodsAndEvents, contract.bytecode)) {
    return
  }

  try {
    const res = await callAll(contract.address, callableMethods)
    // console.log('blah', {res}, contract.address)
  } catch (e) {
    // console.log('invalid')
  }
}
