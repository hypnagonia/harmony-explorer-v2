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

[Postgres scheme](https://github.com/hypnagonia/harmony-explorer-v2/tree/dev/src/store/postgres/sql)
![image info](https://github.com/hypnagonia/harmony-explorer-v2/blob/dev/doc/scheme.png)

# API
## REST API
#### Block
list (with filters)
`http://localhost:3000/v0/shard/0/block`

By hash
`http://localhost:3000/v0/shard/0/block/hash/0x5824370c68e1b55008e5f25d0bf1e88e4f35b3b31791ae6d7d83544f620f9a19`

By number
`http://localhost:3000/v0/shard/0/block/number/0`

#### Transaction
list (with filters)
`http://localhost:3000/v0/shard/0/transaction/`

by eth hash or harmony hash
`http://localhost:3000/v0/shard/0/transaction/hash/0xb242fc9b3644e7445c32d199d729be8339f58ac7c0114a3ef4ab343813caa73a`

by block number
`http://localhost:3000/v0/shard/0/transaction/block/number/11600000`

by block hash
`http://localhost:3000/v0/shard/0/transaction/block/hash/0x7bd91ded8704e55d9345f21e26b002e4676b776386e7abe734536aca91924922`

#### Staking
list (with filters)
`http://localhost:3000/v0/shard/0/stakingTransaction/`

by ETH hash or Harmony hash
`http://localhost:3000/v0/shard/0/stakingTransaction/hash/:txHash`

by block number
`http://localhost:3000/v0/shard/0/stakingTransaction/block/number/:blockNumber`

by block hash
`http://localhost:3000/v0/shard/0/stakingTransaction/block/hash/:blockHash`

#### Filters
as GET params
`orderBy`: `number` for blocks | `block_number` for txs
`orderDirection`: `asc` | `desc` 
`offset`: number
`limit`: number (max 100)
Composite filters (at the moment only single condition supported)
`type`: 'gt' | 'gte' | 'lt' | 'lte'
`property`: 'number' | 'block_number' (will be more in the future)
`value`: value

## Websocket [Socket.IO](https://socket.io/)
Hit http://localhost:3001 for dev web page


## GRPC transport

[Proto files](https://github.com/hypnagonia/harmony-explorer-v2/tree/dev/src/api/grpc/proto)

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
- [ ] Detect Contracts
- [ ] Track HRC20
- [ ] Track HRC721

### API

- [ ] Composite filters

#### REST

- [ ] Blocks
- [ ] Transactions
- [ ] Staking Transactions
- [ ] Internal Transactions
- [ ] Addresses
- [ ] Metrics
- [ ] Documentation
- [ ] ERC20 tokens
- [ ] ERC721 tokens

### Misc

- [ ] Docker image
