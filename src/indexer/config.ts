import * as dotenv from 'dotenv'

dotenv.config()

const toBool = (value: string) => !!+value

export const config = {
  indexer: {
    isEnabled: toBool(process.env.INDEXER_IS_ENABLED || '0'),
    initialBlockSyncingHeight: +(process.env.INDEXER_INITIAL_BLOCK_SYNCING_HEIGHT || 0),
    rpcUrls: [
      // shard #0 must go first
      ['https://a.api.s0.t.hmny.io'],
      ['https://api.s1.t.hmny.io'],
      ['https://api.s1.t.hmny.io'],
      ['https://api.s1.t.hmny.io'],
    ],
  },
  store: {
    postgres: {},
  },
}
