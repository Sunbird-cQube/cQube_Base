create table if not exists mst_state
(state_id int primary key not null,
state_name varchar(50));

create index if not exists mst_state_id on mst_state(state_id);

create table if not exists mst_district
(district_id int primary key not null,
district_name varchar(50),
state_id int,
state_name varchar(50),
foreign key (state_id) references mst_state(state_id));

create index if not exists mst_district_id on mst_district(district_id);


create table if not exists mst_block
(block_id int primary key not null,
block_name varchar(50),
district_id int,
district_name varchar(50),
state_id int,
state_name varchar(50),
foreign key (district_id) references mst_district(district_id));

create index if not exists mst_block_id on mst_block(block_id);

create table if not exists mst_cluster
(clusterId int primary key not null,
cluster_name varchar(50),
block_id int not null,
block_name varchar(50),
district_id int,
district_name varchar(50),
state_id int,
state_name varchar(50),
foreign key (block_id) references mst_block(block_id));

create index if not exists mst_cluster_id on mst_cluster(clusterId);

create table if not exists mst_village
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

create index if not exists mst_village_id on mst_village(village_id);

create table if not exists mst_school
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

create index if not exists mst_school_id on mst_school(school_id);

create table if not exists trf_student_attendance
(student_id int,
student_name varchar(50),
school_id varchar(50),
year int,
month int,
day date,
attendance int,
created_on date,
updated_on date
);

create table if not exists trf_teacher_attendance
(teacher_id int,
teacher_name varchar(50),
school_id varchar(50),
year int,
month int,
day date,
attendance int,
created_on date,
updated_on date
);

create table if not exists trf_semester_assessment
(semester_id int,
semester_name varchar(30),
school_id int,
student_id int,
subject_id int,
subject_name varchar(50),
marks_scored int,
total_marks int);

create table if not exists trf_periodic_assessment_test
(pat_id int,
pat_name varchar(30),
school_id int,
student_id int,
subject_id int,
subject_name varchar(50),
marks_scored int,
total_marks int);

create table if not exists agg_column_chart(chart_name varchar(100),x_axis varchar(15),x_value varchar(15),y_axis varchar(15),y_value varchar(15),z_axis varchar(15),z_value varchar(15),attribute_1 varchar(15),attribute_2 varchar(15),attribute_3 varchar(15),attribute_4 varchar(15),attribute_5 varchar(15),attribute_6 varchar(15),created_on date,updated_on date);
