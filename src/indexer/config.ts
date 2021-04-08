import * as dotenv from 'dotenv'
import assert from 'assert'
import {TLogLevel} from 'zerg/dist/types'

dotenv.config()

const toBool = (value: string) => !!+value

const required: Record<string, string> = {
  INDEXER_BATCHED_COUNT: 'number',
}

if (toBool(process.env.INDEXER_IS_ENABLED || '0')) {
  Object.keys(required).map((k) => {
    assert(process.env[k], `Env variable "${k}" is required`)
    assert(
      required[k] === 'number' ? !isNaN(+process.env[k]!) : true,
      `Env variable "${k}" should be ${required[k]}`
    )
  })
}

export const config = {
  indexer: {
    isEnabled: toBool(process.env.INDEXER_IS_ENABLED || '0'),
    initialBlockSyncingHeight: +(process.env.INDEXER_INITIAL_BLOCK_SYNCING_HEIGHT || 0),
    batchCount: +(process.env.INDEXER_BATCHED_COUNT || 1),
    rpcUrls: [
      // shard #0 goes first
      ['https://a.api.s0.t.hmny.io', 'https://api.s0.t.hmny.io', 'https://api0.s0.t.hmny.io'],
      ['https://api.s1.t.hmny.io'],
      ['https://api.s1.t.hmny.io'],
      ['https://api.s1.t.hmny.io'],
    ],
  },
  store: {
    postgres: {},
  },
  logger: {
    levels: {
      console: ['error', 'info', 'warn'] as TLogLevel[],
      sentry: ['error', 'warn'] as TLogLevel[],
    },
  },
}
