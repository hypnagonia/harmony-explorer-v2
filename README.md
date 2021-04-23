# Harmony Blockchain Data Indexer

Indexer scrapes blocks, transactions (staking, call traces, logs), tracks contracts, ERC20 (aka HRC20) and ERC721 (aka HRC721) operations and balances
from Harmony blockchain and writes to postgres db.

API serves REST/JSON and websocket. Also, here is initial draft for GRPC. Will be implemented fully on community demand.

Possible to switch off API and keep active only Indexer and vice-versa.

# Run

## Define env variables

Copy `./mainnet.env.example` to `./.env` and define environment variables

## Development mode

```
yarn
yarn start
```

## Production mode

todo

# Indexer

[Postgres scheme](https://github.com/hypnagonia/harmony-explorer-v2/tree/master/src/store/postgres/sql)
![image info](https://github.com/hypnagonia/harmony-explorer-v2/blob/master/doc/scheme.png)

# API

## REST API

#### Block

list (with filters)
`/v0/shard/0/block`

By hash
`/v0/shard/0/block/hash/:hash`

By number
`/v0/shard/0/block/number/:number`

#### Transaction

list (with filters)
`/v0/shard/0/transaction`

by ETH hash or Harmony hash
`/v0/shard/0/transaction/hash/:hash`

by block number
`/v0/shard/0/transaction/block/number/:number`

by block hash
`/v0/shard/0/transaction/block/hash/:blockHash`

#### Staking Transaction

list (with filters)
`/v0/shard/0/stakingTransaction`

by Harmony hash
`/v0/shard/0/stakingTransaction/hash/:txHash`

by block number
`/v0/shard/0/stakingTransaction/block/number/:blockNumber`

by block hash
`/v0/shard/0/stakingTransaction/block/hash/:blockHash`

#### Filters

as GET params

`orderBy`: `number` for blocks | `block_number` for txs

`orderDirection`: `asc` | `desc`

`offset`: number

`limit`: number (max `100`)

Composite filters (at the moment only single condition supported)

`type`: `gt` | `gte` | `lt` | `lte`

`property`: `number` | `block_number` (will be more in the future)

`value`: value

Example
`/v0/shard/0/block?limit=2&offset=0&orderBy=number&orderDirection=asc&type=gt&property=number&value=40`

## Websocket [Socket.IO](https://socket.io/)

Hit http://localhost:3001 for dev web page

## GRPC

[Proto files](https://github.com/hypnagonia/harmony-explorer-v2/tree/master/src/api/grpc/proto)

#### Query

Using [GRPC CLI](https://github.com/grpc/grpc/blob/master/doc/command_line_tool.md)

Install

```
brew install grpc
```

Query

```
grpc_cli --protofiles=src/api/grpc/proto/api.proto call 127.0.0.1:5051 GetBlockByNumber "blockNumber: 1, shardID: 0"
grpc_cli --protofiles=src/api/grpc/proto/api.proto call 127.0.0.1:5051 GetBlockByHash "shardID:0, blockHash:'0xb4d158b82ac8a653c42b78697ab1cd0c6a0d9a15ab3bc34130f0b719fb174d2a'"
```

## TODO

### Indexer

- [x] Index Blocks
- [x] Index Transactions
- [x] Index Staking Transactions
- [x] Index Events
- [ ] Track transactions for Address
- [ ] Index Transactions Trace Calls
- [ ] Index Internal Transactions
- [ ] Track Balances
- [ ] Detect Contracts
- [ ] Track HRC20
- [ ] Track HRC721

### API

- [ ] Composite filters

#### REST

- [x] Blocks
- [x] Transactions
- [x] Staking Transactions
- [ ] Internal Transactions
- [ ] Addresses
- [ ] Metrics
- [ ] Documentation
- [ ] ERC20 tokens
- [ ] ERC721 tokens

### Misc

- [ ] Docker image
