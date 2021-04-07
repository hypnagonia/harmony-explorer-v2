import {config} from 'src/indexer/config'

export class RPCStatistic {
  responseTime = 0.1
  fails = 0
  url = ''

  constructor(url: string) {
    this.url = url
  }

  submitStatistic = (responseTime: number, isFailed = false) => {
    this.responseTime = (this.responseTime + responseTime) / 2

    if (isFailed) {
      this.fails++
    }
  }

  static getBest = () => {
    if (stats.length === 1) {
      return stats[0]
    }

    const withoutWorst = stats
      .sort((a, b) => a.fails - b.fails)
      .filter((s, i) => i < stats.length - 1 || s.fails === 0)

    return withoutWorst.sort((a, b) => a.responseTime - b.responseTime)[0]
  }
}

const urls = config.indexer.rpcUrls[0]
const stats = urls.map((url) => new RPCStatistic(url))
