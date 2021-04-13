create schema if not exists public;

create table if not exists blocks
(
    number               bigint          not null,
    hash                 char(66) unique not null,
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
    size                 bigint,
    state_root           char(66),
    transactions         char(66)[],
    staking_transactions char(66)[],
    transactions_root    char(66),
    uncles               char(66)[],
    epoch                bigint,
    view_id              text,
    primary key (number)
);

create index if not exists idx_blocks_number on blocks (number);
create index if not exists idx_blocks_hash on blocks using hash (hash);

create table if not exists logs
(
    address           char(42)                          not null,
    topics            char(66)[],
    data              text,
    block_number      bigint references blocks (number) not null,
    transaction_hash  char(66)                          not null,
    transaction_index smallint,
    block_hash        char(66) references blocks (hash) not null,
    log_index         smallint,
    removed           boolean
);

create index if not exists idx_logs_transaction_hash on logs using hash (transaction_hash);
create index if not exists idx_logs_block_hash on logs using hash (block_hash);
create index if not exists idx_logs_block_number on logs (block_number);

/*todo status*/
create table if not exists transactions
(
    shard             smallint                          not null,
    hash              char(66) unique primary key       not null,
    hash_harmony      char(66) unique                   not null,
    value             numeric,
    block_hash        char(66) references blocks (hash) not null,
    block_number      bigint references blocks (number) not null,
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
create index if not exists idx_transactions_hash on transactions using hash (hash);
create index if not exists idx_transactions_block_hash on transactions using hash (block_hash);
create index if not exists idx_transactions_block_number on transactions (block_number);

do
$$
    begin
        create type transaction_type as enum (
            'transaction',
            'internal_transaction');
    exception
        when duplicate_object then null;
    end
$$;

/*addresses mentioned in transaction*/
create table if not exists address2transaction
(
    address          char(42) not null,
    block_number     char(66) not null,
    transaction_hash char(66) references transactions (hash),
    transaction_type transaction_type
);

create index if not exists idx_address2transaction_address on address2transaction using hash (address);
create index if not exists idx_address2transaction_block_number on transactions (block_number);

create table if not exists internal_transactions
(
    id               bigserial primary key,
    "from"           char(42),
    "to"             char(42),
    gas              bigint,
    gas_used         bigint,
    input            text,
    output           text,
    type             text,
    value            numeric,
    transaction_hash char(66) references transactions (hash),
    time             time,
    parent_id        bigint
);

create index if not exists idx_internal_transactions_transaction_hash on internal_transactions using hash (transaction_hash);

create table if not exists transaction_traces
(
    block_number bigint not null,
    hash         char(66) references transactions (hash),
    error        text default (null),
    raw          jsonb
);

create index if not exists idx_transaction_traces_hash on transaction_traces using hash (hash);

/*tracking create/create2 */
create table if not exists contracts
(
    address          char(42) unique not null,
    creator_address  char(42)        not null,
    block_hash       char(66)        not null,
    transaction_hash char(66) references transactions (hash),
    transaction_type transaction_type,
    ipfs_hash        char(64),
    meta             jsonb
);
create index if not exists idx_contracts_address on contracts using hash (address);

create table if not exists erc20
(
    address                  char(42) unique references contracts (address) not null,
    decimals                 smallint                                       not null,
    symbol                   text                                           not null,
    name                     text                                           not null,
    total_supply             numeric default (0),
    holders                  numeric default (0),
    transaction_count        bigint  default (0),
    last_update_block_number bigint
);

create index if not exists idx_erc20_address on erc20 using hash (address);

create table if not exists erc20_balance
(
    owner_address            char(42)                            not null,
    token_address            char(42) references erc20 (address) not null,
    balance                  numeric,
    last_update_block_number bigint
);
create index if not exists idx_erc20_balance_address on erc20_balance using hash (owner_address);
create index if not exists idx_erc20_balance_token_address on erc20_balance using hash (token_address);


create table if not exists erc721
(
    address                  char(42) unique references contracts (address) not null,
    symbol                   text                                           not null,
    name                     text                                           not null,
    total_supply             numeric default (0),
    holders                  numeric default (0),
    transaction_count        bigint  default (0),
    last_update_block_number bigint
);

create index if not exists idx_erc721_address on erc721 using hash (address);

create table if not exists erc721_asset
(
    owner_address            char(42)                             not null,
    token_address            char(42) references erc721 (address) not null,
    token_id                 text,
    meta                     jsonb,
    last_update_block_number bigint
);

create index if not exists idx_erc721_asset_owner_address on erc721_asset using hash (owner_address);
create index if not exists idx_erc721_asset_token_address on erc721_asset using hash (token_address);

create table if not exists indexer_state
(
    logs_last_synced_block_number          bigint   default (0),
    blocks_shard0_last_synced_block_number bigint   default (0),
    blocks_shard1_last_synced_block_number bigint   default (0),
    blocks_shard2_last_synced_block_number bigint   default (0),
    blocks_shard3_last_synced_block_number bigint   default (0),
    id                                     smallint default (0),
    unique (id)
);