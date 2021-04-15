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
grpc_cli --protofiles=src/api/grpc/proto/api.proto call 127.0.0.1:5051 GetBlockByNumber "blockNumber: '1'"
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
