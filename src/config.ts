import * as dotenv from 'dotenv'
import assert from 'assert'
import {TLogLevel} from 'zerg/dist/types'
import {ShardID} from 'src/types'
import {getGitCommitHash} from 'src/utils/getGitCommitHash'
const packageJSON = require('../package.json')

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

const getChainID = (v: any): number => {
  if (v === 'mainnet') {
    return 1666600000
  }
  return +v
}

export const config = {
  info: {
    gitCommitHash: getGitCommitHash(),
    version: packageJSON.version,
  },
  api: {
    shards: getCommaSeparatedList(process.env.API_SHARDS).map((s) => +s) as ShardID[],
    isEnabled: toBool(process.env.API_IS_ENABLED || '0'),
    isCacheEnabled: toBool(process.env.API_IS_CACHE_ENABLED || '0'),
    ws: {
      isEnabled: toBool(process.env.API_WS_IS_ENABLED || '0'),
      port: 3001,
      isDemoHTMLPageEnabled: true,
    },
    rest: {
      isEnabled: toBool(process.env.API_REST_IS_ENABLED || '0'),
      port: +(process.env.API_REST_PORT || 3000),
    },
    grpc: {
      isEnabled: toBool(process.env.API_GRPC_IS_ENABLED || '0'),
      port: 5051,
    },
  },
  indexer: {
    chainID: getChainID(process.env.CHAIN_ID || 'mainnet'),
    shards: getCommaSeparatedList(process.env.INDEXER_SHARDS).map((s) => +s) as ShardID[],
    isEnabled: toBool(process.env.INDEXER_IS_ENABLED || '0'),
    isSyncingBlocksEnabled: toBool(process.env.INDEXER_BLOCKS_IS_ENABLED || '0'),
    isSyncingLogsEnabled: toBool(process.env.INDEXER_LOGS_IS_ENABLED || '0'),
    isSyncingContractsEnabled: toBool(process.env.INDEXER_CONTRACTS_IS_ENABLED || '0'),
    trackContractTypes: getCommaSeparatedList(process.env.INDEXER_CONTRACTS_TYPES),
    initialBlockSyncingHeight: +(process.env.INDEXER_INITIAL_BLOCK_SYNCING_HEIGHT || 0),
    // set to the height where smart contracts were introduced on the chain
    initialLogsSyncingHeight: +(process.env.INDEXER_LOG_INITIAL_BLOCK_SYNCING_HEIGHT || 3500000),
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
    infoWebServer: {
      isEnabled: true,
      port: 3002,
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
        poolSize: +(process.env.SHARD0_POSTGRES_POOL_SIZE || 20),
      },
      {
        user: process.env.SHARD1_POSTGRES_USER,
        host: process.env.SHARD1_POSTGRES_HOST,
        database: process.env.SHARD1_POSTGRES_DB,
        password: process.env.SHARD1_POSTGRES_PASSWORD,
        port: +(process.env.SHARD1_POSTGRES_PORT || 5432),
        poolSize: +(process.env.SHARD1_POSTGRES_POOL_SIZE || 20),
      },
      {
        user: process.env.SHARD2_POSTGRES_USER,
        host: process.env.SHARD2_POSTGRES_HOST,
        database: process.env.SHARD2_POSTGRES_DB,
        password: process.env.SHARD2_POSTGRES_PASSWORD,
        port: +(process.env.SHARD2_POSTGRES_PORT || 5432),
        poolSize: +(process.env.SHARD2_POSTGRES_POOL_SIZE || 20),
      },
      {
        user: process.env.SHARD3_POSTGRES_USER,
        host: process.env.SHARD3_POSTGRES_HOST,
        database: process.env.SHARD3_POSTGRES_DB,
        password: process.env.SHARD3_POSTGRES_PASSWORD,
        port: +(process.env.SHARD3_POSTGRES_PORT || 5432),
        poolSize: +(process.env.SHARD3_POSTGRES_POOL_SIZE || 20),
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
