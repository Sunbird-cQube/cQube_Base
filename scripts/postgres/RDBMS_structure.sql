create database cqubedev;
\c cqubedev;
create schema edu;
set search_path to edu;

create table mst_state
(state_id int primary key not null,
state_name varchar(50));

create index mst_state_id on mst_state(state_id);

create table mst_district
(district_id int primary key not null,
district_name varchar(50),
state_id int,
state_name varchar(50),
foreign key (state_id) references mst_state(state_id));

create index mst_district_id on mst_district(district_id);


create table mst_block
(block_id int primary key not null,
block_name varchar(50),
district_id int,
district_name varchar(50),
state_id int,
state_name varchar(50),
foreign key (district_id) references mst_district(district_id));

create index mst_block_id on mst_block(block_id);

create table mst_cluster
(clusterId int primary key not null,
cluster_name varchar(50),
block_id int not null,
block_name varchar(50),
district_id int,
district_name varchar(50),
state_id int,
state_name varchar(50),
foreign key (block_id) references mst_block(block_id));

create index mst_cluster_id on mst_cluster(clusterId);

create table mst_village
(village_id int primary key not null,
village_name varchar(50),
clusterId int,
cluster_name varchar(50),
block_id int,
block_name varchar(50),
district_id int,
district_name varchar(50),
state_id int,
state_name varchar(50),
foreign key (clusterId) references mst_cluster(clusterId));

create index mst_village_id on mst_village(village_id);

create table mst_school
(school_id int primary key not null,
school_name varchar(50),
village_id int,
village_name varchar(50),
clusterId int,
cluster_name varchar(50),
block_id int,
block_name varchar(50),
district_id int,
district_name varchar(50),
state_id int,
state_name varchar(50),
foreign key (village_id) references mst_village(village_id));

create index mst_school_id on mst_school(school_id);

create table trf_student_attendance
(student_id int,
student_name varchar(50),
school_id varchar(50),
year int,
month int,
day date,
attendance int,
created_on TIMESTAMP with time zone default current_timestamp,
updated_on TIMESTAMP with time zone default current_timestamp
);

create table trf_teacher_attendance
(teacher_id int,
teacher_name varchar(50),
school_id varchar(50),
year int,
month int,
day date,
attendance int,
created_on TIMESTAMP with time zone default current_timestamp,
updated_on TIMESTAMP with time zone default current_timestamp
);

create table agg_column_chart(chart_name varchar(50),x_axis varchar(15),x_value varchar(15),y_axis varchar(15),y_value varchar(15),z_axis varchar(15),z_value varchar(15),attribute_1 varchar(30),attribute_2 varchar(30),attribute_3 varchar(30),attribute_4 varchar(30),attribute_5 varchar(30),attribute_6 varchar(30),created_on TIMESTAMP with time zone default current_timestamp,updated_on TIMESTAMP with time zone default current_timestamp);
