const mapNaming: Record<string, string> = {
  extra_data: 'extraData',
  gas_limit: 'gasLimit',
  gas_used: 'gasUsed',
  logs_bloom: 'logsBloom',
  mix_hash: 'mixHash',
  parent_hash: 'parentHash',
  receipts_root: 'receiptsRoot',
  sha3_uncles: 'sha3Uncles',
  state_root: 'stateRoot',
  staking_transactions: 'stakingTransactions',
  transactions_root: 'transactionsRoot',
  view_id: 'viewID',
  to_shard_id: 'toShardID',
  transaction_index: 'transactionIndex',
  block_number: 'blockNumber',
  block_hash: 'blockHash',
  transaction_hash: 'transactionHash',
  log_index: 'logIndex',
  shard: 'shardID',
}

const mapNamingReverse: Record<string, string> = Object.keys(mapNaming).reduce((a, k) => {
  a[mapNaming[k]] = k
  return a
}, {} as Record<string, string>)

const fromHexToNumber = (s: string | number) =>
  s ? (typeof s === 'number' ? s : parseInt(s, 16)) : s
const fromStringToNumber = (s: string | number) => +s

const toStoreMappers: Record<string, (val: any) => any> = {
  gasLimit: fromHexToNumber,
  gasUsed: fromHexToNumber,
  epoch: fromHexToNumber,
  difficulty: fromHexToNumber,
  nonce: fromHexToNumber,
  size: fromHexToNumber,
  logIndex: fromHexToNumber,
  transactionIndex: fromHexToNumber,
  timestamp: (t) => new Date(parseInt(t, 16)),
}

export const generateQuery = (o: Record<any, any>) => {
  const fields = Object.keys(o)
    .map((k) => mapNamingReverse[k] || k)
    .join(',')
  const placeholders = Object.keys(o)
    .map((_, i) => `$${i + 1}`)
    .join(',')

  const query = `(${fields}) values(${placeholders})`
  const params = Object.keys(o).map((k) => {
    if (toStoreMappers[k]) {
      return toStoreMappers[k](o[k])
    }
    return o[k]
  })

  return {
    query,
    params,
  }
}
