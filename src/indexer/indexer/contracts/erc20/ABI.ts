import {IABISignatures} from 'src/indexer/indexer/contracts/types'

// add variations of a sig
export const ERC20ABI: IABISignatures = {
  events: ['Transfer(address,address,uint256)', 'Approval(address,address,uint256)'],
  methods: [
    'name()',
    'symbol()',
    'decimals()',
    'totalSupply()',
    'balanceOf(address)',
    'transfer(address,uint256)',
  ],
}
