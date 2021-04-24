import {
  Address,
  Block,
  BlockHash,
  BlockNumber,
  ByteCode,
  InternalTransaction,
  RPCBlockHarmony,
  RPCInternalTransactionFromBlockTrace,
  RPCStakingTransactionHarmony,
  RPCTransactionHarmony,
  TraceCallErrorToRevert,
  TraceCallTypes,
  TransactionHash,
} from 'src/types'
import {normalizeAddress} from 'src/utils/normalizeAddress'

export const mapBlockFromResponse = (block: RPCBlockHarmony): Block => {
  // @ts-ignore
  return {
    ...block,
    number: parseInt(block.number, 16),
    miner: normalizeAddress(block.miner),
    transactions: block.transactions && block.transactions.map(mapTransaction),
    stakingTransactions:
      block.stakingTransactions && block.stakingTransactions.map(mapStakingTransaction),
  } as Block
}

const mapTransaction = (tx: RPCTransactionHarmony) => {
  return {
    ...tx,
    to: normalizeAddress(tx.to),
    from: normalizeAddress(tx.from),
  }
}

const mapStakingTransaction = (tx: RPCStakingTransactionHarmony) => {
  // convert one1 to 0x
  // https://docs.harmony.one/home/developers/api/methods/transaction-related-methods/hmy_getstakingtransactionbyblockhashandindex
  const msg = {...tx.msg}
  if (msg.validatorAddress) {
    msg.validatorAddress = normalizeAddress(msg.validatorAddress)
  }
  if (msg.delegatorAddress) {
    msg.delegatorAddress = normalizeAddress(msg.delegatorAddress)
  }

  return {
    ...tx,
    to: normalizeAddress(tx.to),
    from: normalizeAddress(tx.from),
    msg,
  }
}

export const mapInternalTransactionFromBlockTrace = (tx: RPCInternalTransactionFromBlockTrace) => {
  return {
    blockHash: tx.blockHash,
    blockNumber: tx.blockNumber,
    transactionHash: tx.transactionHash,
    from: tx.action.from,
    to: tx.action.to,
    gas: tx.action.gas || '0x0', // can be undefined
    gasUsed: tx.result ? tx.result.gasUsed : '0x0',
    input: tx.action.input,
    output: tx.result ? tx.result.output : null,
    type: tx.action.callType || tx.type,
    index: tx.traceAddress[0] || 0, // // can be empty arr
    value: tx.action.value || '0x0', // can be undefined
  } as InternalTransaction
}
