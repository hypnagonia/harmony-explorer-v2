import {config} from 'src/indexer/config'
const contractStartBlock = config.indexer.initialLogsSyncingHeight

// todo indexes
// todo inherit & constraints

export const scheme = `
    create schema IF NOT EXISTS public;

    create table IF NOT EXISTS block_interface (
      number bigint primary key unique not null,
      hash varchar(66) unique not null,
      timestamp timestamp not null,
      raw text not null
    );
    
    create table IF NOT EXISTS blocks0 ()
     INHERITS (block_interface);
    create table IF NOT EXISTS blocks1 ()
     INHERITS (block_interface);
    create table IF NOT EXISTS blocks2 ()
     INHERITS (block_interface);
    create table IF NOT EXISTS blocks3 ()
     INHERITS (block_interface);
    
    create index if not exists iBlocks0Hash on blocks0 using hash(hash);
    create index if not exists iBlocks1Hash on blocks1 using hash(hash);
    create index if not exists iBlocks2Hash on blocks2 using hash(hash);
    create index if not exists iBlocks3Hash on blocks3 using hash(hash);
    
    create index if not exists iBlocks0Number on blocks0(number);
    create index if not exists iBlocks1Number on blocks1(number);
    create index if not exists iBlocks2Number on blocks2(number);
    create index if not exists iBlocks3Number on blocks3(number);
    
    create table IF NOT EXISTS logs_interface (
      address varchar(42) not null,
      topics text,
      data text,
      blockNumber bigint not null,
      transactionHash varchar(66) not null,
      transactionIndex varchar(8),
      blockHash varchar(66) not null,
      logIndex varchar(8),
      removed boolean not null
    );
    
    create table IF NOT EXISTS logs0 ()
    INHERITS (logs_interface);
              
    create index if not exists iLogs0TransactionHash on logs0 using hash(transactionHash);
    create index if not exists iLogs0BlockHash on logs0 using hash(blockHash);
    create index if not exists iLogs0BlockNumber on logs0(blockNumber);
    
    create table IF NOT EXISTS indexer_state (
      lastLogs0IndexedBlockNumber bigint default(0),
      lastBlocks0IndexedBlockNumber bigint default(0),
      lastBlocks1IndexedBlockNumber bigint default(0),
      lastBlocks2IndexedBlockNumber bigint default(0),
      lastBlocks3IndexedBlockNumber bigint default(0),
      id smallint default(0),
      unique(id)
    );
    
    insert into indexer_state (lastLogs0IndexedBlockNumber) 
      values (${contractStartBlock}) on conflict(id) do nothing;
`
