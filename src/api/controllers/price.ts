import {validator} from 'src/utils/validators/validators'
import {isOneOf} from 'src/utils/validators'
import {withCache} from 'src/api/controllers/cache'
import nodeFetch from 'node-fetch'

const timeout = () =>
  new Promise((resolve, reject) => setTimeout(() => reject(new Error('Connection timeout')), 20000))
const call = (url: string) => nodeFetch(url).then((r) => r.json())

const pairs = ['ONEUSDT']

export async function getBinancePairPrice(pair: string): Promise<any | null> {
  validator({
    field: isOneOf(pair, pairs),
  })
  const url = `https://api.binance.com/api/v1/ticker/24hr?symbol=${pair}`
  return await withCache(
    ['getBinancePairPrice', arguments],
    () => Promise.race([call(url), timeout()]),
    1000 * 60
  )
}

export async function getBinancePairHistoricalPrice(pair: string): Promise<any | null> {
  validator({
    field: isOneOf(pair, pairs),
  })
  const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d`

  return await withCache(
    ['getBinancePairHistoricalPrice', arguments],
    () => Promise.race([call(url), timeout()]),
    1000 * 60 * 60 * 24
  )
}
