export const scheme = `
    create schema IF NOT EXISTS public;

    create table IF NOT EXISTS block_interface (
      id serial,
      number bigint primary key unique,
      hash varchar(66) unique,
      timestamp timestamp not null,
      raw text
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
    `
