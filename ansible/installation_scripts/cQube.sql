/* Data from date  function*/

create function data_upto_date(year integer,month integer) returns varchar(10) as $$
declare data varchar;
begin
SELECT left(to_char((date_trunc('MONTH', ( concat(year,0,month) ||'01')::date) + INTERVAL '1 MONTH - 1 day')::DATE,'DD-MM-YYYY'),10) into data;
return data;
END; $$
LANGUAGE PLPGSQL;

/* Data upto date  function*/

create function data_from_date(year integer,month integer) returns varchar(10) as $$
declare data varchar;
begin
SELECT left(to_char((date_trunc('MONTH', ( concat(year,0,month) ||'01')::date))::DATE,'DD-MM-YYYY'),10) into data;
return data;
END; $$
LANGUAGE PLPGSQL;

/*school_master*/

create table if not exists school_master
	(
school_id  bigint primary key not null,
school_name varchar(250),
school_address  varchar(250),
school_zipcode  int,
school_contact_number  bigint,
school_email_contact  varchar(50),
school_website  varchar(50),
school_lowest_class  int,
school_highest_class  int,
school_management_type_id int unique,
school_category_id  int unique,
school_medium_id  int unique,
created_on  TIMESTAMPTZ NOT NULL,
updated_on  TIMESTAMPTZ NOT NULL
);

/*school_management_master*/

create table if not exists school_management_master
	(
school_management_type_id int primary key not null,
school_management_type varchar(100),
created_on  TIMESTAMPTZ NOT NULL,
updated_on  TIMESTAMPTZ NOT NULL,
foreign key (school_management_type_id) references school_master(school_management_type_id)
);

/*school_category_master*/

create table if not exists school_category_master
	(
school_category_id int primary key not null,
school_category varchar(100),
created_on  TIMESTAMPTZ NOT NULL,
updated_on  TIMESTAMPTZ NOT NULL,
foreign key (school_category_id) references school_master(school_category_id)
);

/*school_medium_master*/

create table if not exists school_medium_master
	(
school_medium_id int primary key not null,
medium_of_school varchar(100),
created_on  TIMESTAMPTZ NOT NULL,
updated_on  TIMESTAMPTZ NOT NULL,
foreign key (school_medium_id) references school_master(school_medium_id)
);

/*school_geo_master*/

create table if not exists school_geo_master
(
school_id  bigint primary key not null,
school_latitude  double precision,
school_longitude  double precision,
district_id  bigint,
district_latitude  double precision,
district_longitude  double precision,
block_id  bigint,
block_latitude  double precision,
block_longitude  double precision,
cluster_id  bigint,
cluster_latitude  double precision,
cluster_longitude  double precision,
created_on  TIMESTAMPTZ ,
updated_on  TIMESTAMPTZ ,
-- foreign key (school_id) references school_master(school_id)
);	

/* school_hierarchy_details */

create table if not exists school_hierarchy_details
	(
		school_id bigint primary key not null,
		year int,
		school_name varchar(300),
		board_id bigint,
		board_name varchar(200),
		block_id bigint,
		block_name varchar(100),
		brc_name varchar(100),
		district_id bigint,
		district_name varchar(100),
		cluster_id bigint,
		cluster_name varchar(100),
		crc_name varchar(100),
		created_on TIMESTAMPTZ,
		updated_on TIMESTAMPTZ,
		foreign key (school_id) references school_geo_master(school_id)
		);

create index if not exists school_hierarchy_details_id on school_hierarchy_details(block_id,district_id,cluster_id);

/* student_hierarchy_details */

create table if not exists student_hierarchy_details
	(
		student_id bigint primary key not null,
		school_id bigint,
		year int,
		student_class int,
		stream_of_student varchar(50),
		created_on TIMESTAMPTZ,
		updated_on TIMESTAMPTZ,
		foreign key (school_id) references school_hierarchy_details(school_id)
		);

create index if not exists student_hierarchy_details_id on student_hierarchy_details(school_id,student_class,stream_of_student);

/* teacher_hierarchy_details */

create table if not exists teacher_hierarchy_details
	(
		teacher_id bigint primary key not null,
		school_id bigint,
		year int,
		teacher_designation varchar(100),
		nature_of_employment varchar(50),
		date_of_joining date,
		created_on TIMESTAMPTZ,
		updated_on TIMESTAMPTZ,
		foreign key (school_id) references school_hierarchy_details(school_id)
		);

create index if not exists teacher_hierarchy_details_id on teacher_hierarchy_details(school_id,nature_of_employment);

/*student_attendance_trans*/

create table if not exists student_attendance_trans
(
attendance_id  bigint primary key not null,
student_id  bigint,
school_id  bigint,
year  int,
month  int,
day_1  smallint,
day_2  smallint,
day_3  smallint,
day_4  smallint,
day_5  smallint,
day_6  smallint,
day_7  smallint,
day_8  smallint,
day_9  smallint,
day_10  smallint,
day_11  smallint,
day_12  smallint,
day_13  smallint,
day_14  smallint,
day_15  smallint,
day_16  smallint,
day_17  smallint,
day_18  smallint,
day_19  smallint,
day_20  smallint,
day_21  smallint,
day_22  smallint,
day_23  smallint,
day_24  smallint,
day_25  smallint,
day_26  smallint,
day_27  smallint,
day_28  smallint,
day_29  smallint,
day_30  smallint,
day_31  smallint,
created_on  TIMESTAMPTZ ,
updated_on  TIMESTAMPTZ,
foreign key (school_id) references school_hierarchy_details(school_id),
-- foreign key (student_id) references student_hierarchy_details(student_id)
);

create index if not exists student_attendance_trans_id on student_attendance_trans(school_id,month,student_id);

/*teacher_attendance_trans*/

create table if not exists teacher_attendance_trans
(
attendance_id  bigint primary key not null,
teacher_id  bigint,
school_id  bigint,
year  int,
month  int,
day_1  smallint,
day_2  smallint,
day_3  smallint,
day_4  smallint,
day_5  smallint,
day_6  smallint,
day_7  smallint,
day_8  smallint,
day_9  smallint,
day_10  smallint,
day_11  smallint,
day_12  smallint,
day_13  smallint,
day_14  smallint,
day_15  smallint,
day_16  smallint,
day_17  smallint,
day_18  smallint,
day_19  smallint,
day_20  smallint,
day_21  smallint,
day_22  smallint,
day_23  smallint,
day_24  smallint,
day_25  smallint,
day_26  smallint,
day_27  smallint,
day_28  smallint,
day_29  smallint,
day_30  smallint,
day_31  smallint,
created_on  TIMESTAMPTZ ,
updated_on  TIMESTAMPTZ,
foreign key (school_id) references school_hierarchy_details(school_id),
-- foreign key (teacher_id) references teacher_hierarchy_details(teacher_id)
);

create index if not exists teacher_attendance_trans_id on teacher_attendance_trans(school_id,month,teacher_id);

/* crc_inspection_trans */

create table if not exists crc_inspection_trans
(
crc_inspection_id bigint primary key not null,
crc_id bigint,
crc_name varchar(100),
school_id  bigint,
lowest_class smallint,
highest_class smallint,
visit_start_time TIMESTAMPTZ,
visit_end_time TIMESTAMPTZ,
total_class_rooms smallint,
actual_class_rooms smallint,
total_suggestion_last_month smallint,
resolved_from_that smallint,
is_inspection smallint,
reason_type smallint,
reason_desc varchar(100),
total_score smallint,
score smallint,
is_offline boolean,
created_on  TIMESTAMPTZ, /* created_on field will come from source data*/
updated_on  TIMESTAMPTZ,
foreign key (school_id) references school_hierarchy_details(school_id)
);

create index if not exists crc_inspection_trans_id on crc_inspection_trans(school_id,crc_id);



/* crc_location_trans */

create table if not exists crc_location_trans
(
crc_location_id bigint primary key not null,
crc_id bigint,
inspection_id  bigint,
school_id  bigint ,
latitude  bigint,
longitude  bigint,
in_school_location  varchar(5),
year int,
month int,
created_on  TIMESTAMPTZ, 
updated_on  TIMESTAMPTZ,
foreign key (school_id) references school_hierarchy_details(school_id),
foreign key (inspection_id) references crc_inspection_trans(crc_inspection_id)
);

create index if not exists crc_location_trans_id on crc_location_trans(school_id,crc_id);


/*Aggregated*/

/*school_student_total_attendance*/

create table if not exists school_student_total_attendance
(
id  serial,
year  int,
month  smallint,
school_id  bigint,
school_name varchar(200),
school_latitude  double precision,
school_longitude  double precision,
district_id  bigint,
district_name varchar(100),
district_latitude  double precision,
district_longitude  double precision,
block_id  bigint,
block_name varchar(100),
brc_name varchar(100),
block_latitude  double precision,
block_longitude  double precision,
cluster_id  bigint,
cluster_name varchar(100),
crc_name varchar(100),
cluster_latitude  double precision,
cluster_longitude  double precision,
total_present  int,
total_working_days  int,
students_count bigint,
created_on  TIMESTAMPTZ ,
updated_on  TIMESTAMPTZ
);

create index if not exists school_student_total_attendance_id on school_student_total_attendance(month,school_id,block_id,cluster_id);

/*school_teacher_total_attendance*/

create table if not exists school_teacher_total_attendance
(
id  serial,
year  int,
month  smallint,
school_id  bigint,
school_name varchar(200),
school_latitude  double precision,
school_longitude  double precision,
district_id  bigint,
district_name varchar(100),
district_latitude  double precision,
district_longitude  double precision,
block_id  bigint,
block_name varchar(100),
brc_name varchar(100),
block_latitude  double precision,
block_longitude  double precision,
cluster_id  bigint,
cluster_name varchar(100),
crc_name varchar(100),
cluster_latitude  double precision,
cluster_longitude  double precision,
total_present  int,
total_training int,
total_halfday int,
total_working_days  int,
teachers_count bigint,
created_on  TIMESTAMPTZ ,   
updated_on  TIMESTAMPTZ
);

create index if not exists school_teacher_total_attendance_id on school_teacher_total_attendance(month,school_id,block_id,cluster_id);

/* crc_visits_frequency */

create table if not exists crc_visits_frequency
(
school_id  bigint ,
school_name varchar(100),
district_id  bigint,
district_name varchar(100),
block_id  bigint,
block_name varchar(100),
cluster_id  bigint,
cluster_name varchar(100),
crc_name varchar(100),
visit_count int,
missed_visit_count int,
month int,
year int,
created_on  TIMESTAMPTZ,
updated_on  TIMESTAMPTZ
);

create index if not exists crc_visits_frequency_id on crc_visits_frequency(school_id,block_id,cluster_id,district_id);


