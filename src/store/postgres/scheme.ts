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
    
    create index on blocks0 using hash(hash);
    create index on blocks1 using hash(hash);
    create index on blocks2 using hash(hash);
    create index on blocks3 using hash(hash);
    
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
`
