import * as dotenv from 'dotenv'
import assert from 'assert'
import {TLogLevel} from 'zerg/dist/types'

dotenv.config()

const toBool = (value: string) => !!+value

const required: Record<string, string> = {
  INDEXER_BATCH_COUNT: 'number',
}

if (toBool(process.env.INDEXER_IS_ENABLED || '0')) {
  Object.keys(required).map((k) => {
    assert(process.env[k], `Env variable "${k}" must be defined`)
    assert(
      required[k] === 'number' ? !isNaN(+process.env[k]!) : true,
      `Env variable "${k}" should be "${required[k]}"`
    )
  })
}

const getCommaSeparatedList = (list: string | undefined): string[] =>
  (list || '')
    .split(' ')
    .filter((a) => a)
    .join('')
    .split(',')

export const config = {
  api: {
    isEnabled: true,
    port: 3000,
  },
  indexer: {
    isEnabled: toBool(process.env.INDEXER_IS_ENABLED || '0'),
    initialBlockSyncingHeight: +(process.env.INDEXER_INITIAL_BLOCK_SYNCING_HEIGHT || 0),
    // set to the height where smart contracts were introduced on the chain
    initialLogsSyncingHeight: 3500000,
    batchCount: +(process.env.INDEXER_BATCH_COUNT || 100),
    rpc: {
      transport: process.env.INDEXER_RPC_TRANSPORT || 'ws',
      urls: [
        getCommaSeparatedList(process.env.INDEXER_RPC_SHARD0),
        getCommaSeparatedList(process.env.INDEXER_RPC_SHARD1),
        getCommaSeparatedList(process.env.INDEXER_RPC_SHARD2),
        getCommaSeparatedList(process.env.INDEXER_RPC_SHARD3),
      ],
    },
  },
  store: {
    postgres: [
      {
        user: process.env.SHARD0_POSTGRES_USER,
        host: process.env.SHARD0_POSTGRES_HOST,
        database: process.env.SHARD0_POSTGRES_DB,
        password: process.env.SHARD0_POSTGRES_PASSWORD,
        port: +(process.env.SHARD0_POSTGRES_PORT || 5432),
        poolSize: +(process.env.SHARD0_POSTGRES_POOL_SIZE || 90),
      },
      {
        user: process.env.SHARD1_POSTGRES_USER,
        host: process.env.SHARD1_POSTGRES_HOST,
        database: process.env.SHARD1_POSTGRES_DB,
        password: process.env.SHARD1_POSTGRES_PASSWORD,
        port: +(process.env.SHARD1_POSTGRES_PORT || 5432),
        poolSize: +(process.env.SHARD1_POSTGRES_POOL_SIZE || 90),
      },
      {
        user: process.env.SHARD2_POSTGRES_USER,
        host: process.env.SHARD2_POSTGRES_HOST,
        database: process.env.SHARD2_POSTGRES_DB,
        password: process.env.SHARD2_POSTGRES_PASSWORD,
        port: +(process.env.SHARD2_POSTGRES_PORT || 5432),
        poolSize: +(process.env.SHARD2_POSTGRES_POOL_SIZE || 90),
      },
      {
        user: process.env.SHARD3_POSTGRES_USER,
        host: process.env.SHARD3_POSTGRES_HOST,
        database: process.env.SHARD3_POSTGRES_DB,
        password: process.env.SHARD3_POSTGRES_PASSWORD,
        port: +(process.env.SHARD3_POSTGRES_PORT || 5432),
        poolSize: +(process.env.SHARD3_POSTGRES_POOL_SIZE || 90),
      },
    ],
  },
  logger: {
    levels: {
      console: [
        'error',
        'info',
        'warn',
        // 'debug'
      ] as TLogLevel[],
      sentry: ['error', 'warn'] as TLogLevel[],
    },
  },
}