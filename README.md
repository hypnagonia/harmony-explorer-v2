# harmony-explorer-v2

## Run

Copy `mainnet.env.example` to `.env` and define vars

```
yarn
yarn start
```

## GRPC transport

using [GRPC CLI](https://github.com/grpc/grpc/blob/master/doc/command_line_tool.md)

#### Install

```
brew install grpc
```

#### Query

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

- [ ] GRPC API

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
