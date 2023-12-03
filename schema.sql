CREATE TABLE user
(
    id int primary key,
    username varchar(100) unique not null,
    email varchar(100) unique ,
    password varchar(100) not null
);


