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
- [ ] Index Transactions
- [ ] Index Staking Transactions
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
