import {Contract} from 'src/types'
import {ERC20ABI} from 'src/indexer/indexer/contracts/erc20/ABI'
import {ContractTracker} from 'src/indexer/indexer/contracts/types'
import {ABISignatures} from 'src/indexer/indexer/contracts/utils/ABISignatures'

const {signatures, hasAllSignatures} = ABISignatures(ERC20ABI)

// specs https://eips.ethereum.org/EIPS/eip-20
export const addContract = async (contract: Contract) => {}

/*

 signatures: [
    'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '70a08231',
    '18160ddd'
  ]

 signatures: [
    'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
    '06fdde03',
    '95d89b41',
    '313ce567',
    '18160ddd',
    '70a08231',
    'a9059cbb'
  ]


* */
