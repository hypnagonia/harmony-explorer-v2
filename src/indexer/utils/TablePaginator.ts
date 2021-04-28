import {TablePaginatorTableNames} from 'src/types'
import {stores} from 'src/store'

// only shard #0
const store = stores[0]

const tablesQueries: Record<TablePaginatorTableNames, any> = {
  contracts: (
    table: TablePaginatorTableNames,
    fromBlock: number,
    toBlock: number,
    batchSize: number
  ) => store.getTablePage(table, fromBlock, toBlock, batchSize),
  logs: () => {},
  internal_transactions: () => {},
}

export const TablePaginator = (table: TablePaginatorTableNames, toBlock = 0, batchSize = 100) => {
  let value: any[] = []
  let hasNext = true
  let fromBlock: number | 'latest' = 'latest'
  const cb = tablesQueries[table]

  const next = async () => {
    if (!hasNext) {
      return response()
    }

    value = await cb(table, fromBlock, toBlock, batchSize)
    if (value.length) {
      fromBlock = value[value.length - 1].blockNumber + 1
    }

    if (batchSize > value.length) {
      hasNext = false
    }

    return response()
  }

  const response = () => ({
    value,
    next,
    hasNext: () => hasNext,
  })

  return response()
}
