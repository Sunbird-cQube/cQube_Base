/* Emission sql*/

CREATE SEQUENCE user_id_seq START WITH 10000;

create table users(user_id int primary key not null DEFAULT nextval('user_id_seq'),fname varchar(30),mname varchar(30),
lname varchar(30),email varchar(100),password varchar(250),status varchar(1),created_on timestamp default now(),
expiration_date timestamp without time zone default now() - INTERVAL '90 DAY');