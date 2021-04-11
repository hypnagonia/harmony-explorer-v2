create schema if not exists public;

create table if not exists block_base
(
    number               bigint unique primary key not null,
    hash                 char(66) unique           not null,
    miner                char(42),
    extra_data           text,
    gas_limit            bigint,
    gas_used             bigint,
    timestamp            timestamp,
    difficulty           bigint,
    logs_bloom           text,
    mix_hash             char(66),
    nonce                smallint,
    parent_hash          char(66),
    receipts_root        char(66),
    sha3_uncles          char(66),
    size                 bigint                    not null,
    state_root           char(66),
    transactions         char(66)[],
    staking_transactions char(66)[],
    transactions_root    char(66),
    uncles               char(66)[],
    epoch                bigint,
    view_id              text
);

create table if not exists blocks0
(
)
    inherits (block_base);
create table if not exists blocks1
(
)
    inherits (block_base);
create table if not exists blocks2
(
)
    inherits (block_base);
create table if not exists blocks3
(
)
    inherits (block_base);

create index if not exists iBlocks0Hash on blocks0 using hash (hash);
create index if not exists iBlocks1Hash on blocks1 using hash (hash);
create index if not exists iBlocks2Hash on blocks2 using hash (hash);
create index if not exists iBlocks3Hash on blocks3 using hash (hash);

create index if not exists iBlocks0Number on blocks0 (number);
create index if not exists iBlocks1Number on blocks1 (number);
create index if not exists iBlocks2Number on blocks2 (number);
create index if not exists iBlocks3Number on blocks3 (number);

create table if not exists logs_base
(
    address           char(42) not null,
    topics            char(66)[],
    data              text,
    block_number      bigint   not null primary key,
    transaction_hash  char(66) not null,
    transaction_index smallint,
    block_hash        char(66) not null,
    log_index         smallint,
    removed           boolean
);

create table if not exists logs0
(
)
    inherits (logs_base);

create index if not exists iLogs0TransactionHash on logs0 using hash (transaction_hash);
create index if not exists iLogs0BlockHash on logs0 using hash (block_hash);
create index if not exists iLogs0BlockNumber on logs0 (block_number);

create table if not exists transactions
(
    shard             smallint                    not null,
    hash              char(66) unique primary key not null,
    hash_harmony      char(66) unique             not null,
    value             numeric,
    block_hash        char(66)                    not null,
    block_number      bigint                      not null,
    timestamp         timestamp,
    "from"            char(42),
    "to"              char(42),
    gas               bigint,
    gas_price         bigint,
    input             text,
    nonce             smallint,
    r                 text,
    s                 text,
    to_shard_id       smallint,
    transaction_index smallint,
    v                 text
);
create index if not exists iTransactionsTransactionHash on transactions using hash (hash);
create index if not exists iTransactionsBlockHash on transactions using hash (block_hash);
create index if not exists iTransactionsBlockNumber on transactions (block_number);

create type transaction_type as enum (
    'transaction',
    'internal_transaction');
/*addresses mentioned in transaction*/
create table if not exists address2transaction
(
    address          char(42) not null,
    block_number     char(66) not null,
    transaction_hash char(66) references transactions (hash),
    transaction_type transaction_type
);

create index if not exists iAddress2transactionAddress on address2transaction using hash (address);
create index if not exists iAddress2transactionBlockNumber on transactions (block_number);
create table if not exists transaction_traces
(
    block_number bigint not null,
    hash         char(66) references transactions (hash),
    error        text default (null),
    json         jsonb
);
create index if not exists iTransactionTracesTransactionHash on transaction_traces using hash (hash);

create table if not exists indexer_state
(
    lastLogs0IndexedBlockNumber   bigint   default (0),
    lastBlocks0IndexedBlockNumber bigint   default (0),
    lastBlocks1IndexedBlockNumber bigint   default (0),
    lastBlocks2IndexedBlockNumber bigint   default (0),
    lastBlocks3IndexedBlockNumber bigint   default (0),
    id                            smallint default (0),
    unique (id)
);

/*tracking create/create2 */
create table if not exists contracts
(
    address          char(42) not null,
    creator_address  char(42) not null,
    block_hash       char(66) not null,
    transaction_hash char(66) references transactions (hash),
    transaction_type transaction_type,
    ipfs_hash        char(64),
    meta             jsonb
);
create index if not exists iAddress2transactionAddress on contracts using hash (address);
create index if not exists iAddress2transactionIPFSHash on contracts using hash (ipfs_hash);

create table if not exists erc20
(
    address                  char(42) not null,
    decimals                 smallint not null,
    symbol                   text     not null,
    name                     text     not null,
    total_supply             numeric default (0),
    holders                  numeric default (0),
    transaction_count        bigint  default (0),
    last_update_block_number bigint
);

create index if not exists iERC20Address on erc20 using hash (address);

create table if not exists erc20_balance
(
    address                  char(42) not null,
    erc20_address            char(42) not null,
    balance                  numeric,
    last_update_block_number bigint
);
create index if not exists iERC20BalanceAddress on erc20_balance using hash (address);
create index if not exists iERC20BalanceTokenAddress on erc20_balance using hash (erc20_address);


create table if not exists erc721
(
    address                  char(42) not null,
    symbol                   text     not null,
    name                     text     not null,
    total_supply             numeric default (0),
    holders                  numeric default (0),
    transaction_count        bigint  default (0),
    last_update_block_number bigint
);

create index if not exists iERC721Address on erc721 using hash (address);

/* todo*/
create table if not exists erc721_token
(
    owner_address            char(42) not null,
    erc721_address           char(42) not null,
    token_id                 text,
    meta                     jsonb,
    last_update_block_number bigint
);