import {stores} from 'src/store'
import {InternalTransaction, ShardID, Transaction} from 'src/types/blockchain'
import {validator} from 'src/utils/validators/validators'
import {
  is64CharHexHash,
  isBlockNumber,
  isOrderDirection,
  isOrderBy,
  isShard,
  isOffset,
  isLimit,
  isOneOf,
  isFilters,
  Void,
} from 'src/utils/validators'
import {
  Filter,
  InternalTransactionQueryField,
  TransactionQueryField,
  TransactionQueryValue,
} from 'src/types/api'
import {withCache} from 'src/api/controllers/cache'
import nodeFetch from 'node-fetch'

const timeout = () =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error('Connection timeout')), 3000))
const call = (url: string) => nodeFetch(url).then((r) => r.json())

const getBinanceONEUSDPriceURL = 'https://api.binance.com/api/v1/ticker/24hr?symbol=ONEUSDT'

export async function getBinanceONEUSDPrice(): Promise<any | null> {
  return await withCache(
    ['getBinanceONEUSDPrice', arguments],
    () => Promise.race([call(getBinanceONEUSDPriceURL), timeout()]),
    1000 * 60
  )
}

export async function getBinancePairHistoricalPrice(pair: string): Promise<any | null> {
  validator({
    field: isOneOf(pair, ['ONEUSDT']),
  })
  const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d`

  return await withCache(
    ['getBinancePairHistoricalPrice', arguments],
    () => Promise.race([call(url), timeout()]),
    1000 * 60 * 60 * 24
  )
}
