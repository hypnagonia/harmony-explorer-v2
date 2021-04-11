create schema IF NOT EXISTS public;

create table IF NOT EXISTS block_base
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

create table IF NOT EXISTS blocks0
(
)
    INHERITS (block_base);
create table IF NOT EXISTS blocks1
(
)
    INHERITS (block_base);
create table IF NOT EXISTS blocks2
(
)
    INHERITS (block_base);
create table IF NOT EXISTS blocks3
(
)
    INHERITS (block_base);

create index if not exists iBlocks0Hash on blocks0 using hash (hash);
create index if not exists iBlocks1Hash on blocks1 using hash (hash);
create index if not exists iBlocks2Hash on blocks2 using hash (hash);
create index if not exists iBlocks3Hash on blocks3 using hash (hash);

create index if not exists iBlocks0Number on blocks0 (number);
create index if not exists iBlocks1Number on blocks1 (number);
create index if not exists iBlocks2Number on blocks2 (number);
create index if not exists iBlocks3Number on blocks3 (number);

create table IF NOT EXISTS logs_base
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

create table IF NOT EXISTS logs0
(
)
    INHERITS (logs_base);

create index if not exists iLogs0TransactionHash on logs0 using hash (transaction_hash);
create index if not exists iLogs0BlockHash on logs0 using hash (block_hash);
create index if not exists iLogs0BlockNumber on logs0 (block_number);

create table IF NOT EXISTS transactions
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
create index if not exists iTransactionsBlockHash on transactions using hash (hash);
create index if not exists iTransactionsBlockNumber on transactions using hash (block_hash);
create index if not exists iTransactionsBlockNumber on transactions (block_number);

create type transaction_type as enum (
    'transaction',
    'internal_transaction');
/*addresses mentioned in transaction*/
create table IF NOT EXISTS address2transaction
(
    address          char(42) not null,
    block_hash       char(66) not null,
    transaction_hash char(66) references transactions (hash),
    transaction_type transaction_type
);

create index if not exists iAddress2transactionAddress on address2transaction using hash (address);
create index if not exists iAddress2transactionAddress on address2transaction using hash (block_hash);

create table IF NOT EXISTS transaction_traces
(
    block_number bigint not null,
    hash         char(66) references transactions (hash),
    error        text default (null),
    json         jsonb
);
create index if not exists iTransactionTracesTransactionHash on transaction_traces using hash (hash);

create table IF NOT EXISTS indexer_state
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
create table IF NOT EXISTS contracts
(
    address          char(42) not null,
    creator_address  char(42) not null,
    block_hash       char(66) not null,
    transaction_hash char(66) references transactions (hash),
    transaction_type transaction_type,
    ipfs_hash char(64),
    meta jsonb
);

create index if not exists iAddress2transactionAddress on contracts using hash (address);
create index if not exists iAddress2transactionAddress on contracts using hash (ipfs_hash);


/*
todo
erc20 table
erc20 balances

erc721 table
erc721 token info table, owner
*/