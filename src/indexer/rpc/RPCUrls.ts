import {config} from 'src/indexer/config'

export class RPCUrls {
  responseTime = 0.1
  failedRequests = 0
  url = ''
  queriesCount = 0
  totalQueries = 0

  constructor(url: string) {
    this.url = url
  }

  submitStatistic = (responseTime: number, isFailed = false) => {
    this.queriesCount--
    this.responseTime = (this.responseTime + responseTime) / 2

    if (isFailed) {
      this.failedRequests++
    }
  }

  // naive way to elect best rpc url
  static getURL = () => {
    if (urls.length === 1) {
      return urls[0]
    }

    const best = urls.sort(
      (a, b) =>
        a.responseTime +
        a.queriesCount * 2 -
        (b.responseTime + b.queriesCount * 2) -
        (b.failedRequests - a.failedRequests) * 10
    )[0]

    best.queriesCount++
    best.totalQueries++
    return best
  }
}

// @ts-ignore
export const urls = config.indexer.rpcUrls[0].map((url) => new RPCUrls(url))
