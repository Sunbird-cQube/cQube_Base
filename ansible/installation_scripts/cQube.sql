/* tablefunc */

CREATE EXTENSION IF NOT EXISTS tablefunc;

/* nifi metadata table */

CREATE TABLE IF NOT EXISTS zip_files_processing ( 
 zip_file_name varchar(255), 
 ff_uuid varchar(255), 
 ingestion_date timestamp DEFAULT current_timestamp, 
 storage_date timestamp, 
 number_files integer, 
 number_files_OK integer, 
 number_files_KO integer, 
 status varchar(15) 
);

CREATE TABLE IF NOT EXISTS files_ingestion ( 
 zip_file_name varchar(255), 
 file_name varchar(255), 
 ff_uuid varchar(255), 
 storage_date timestamp, 
 storage_name varchar(255), 
 status varchar(15) 
);

/* role and user based auth tables */

CREATE TABLE IF NOT EXISTS role_master
(
role_id  smallint primary key,
role_name  varchar(100),
role_validity_start_date  date, /* now() */
role_validity_end_date  date,  /* date_trunc('day', NOW() + interval '2 year') for 2 years validity */
role_status smallint,
created_on  date,       /* now()*/
created_by  int,
updated_on  date,       /* now()*/ 
updated_by  int
);

CREATE TABLE IF NOT EXISTS users_authentication
(
user_id  int primary key,
first_name    varchar(30),
middle_name  varchar(30),
last_name  varchar(30),
user_email  varchar(100),
gender  text,
user_designation  varchar(100),
user_status  smallint,
role_id  int,
password  varchar(256),
user_validity_start_date  date,   /* now()*/
user_validity_end_date  date,     /* date_trunc('day', NOW() + interval '6 month') for 6 months validity */
created_on  date,                 /* now()*/
created_by  int,
updated_on  date,                 /* now()*/
updated_by  int,
foreign key (role_id) references role_master(role_id)
);

/* Data from date  function*/

CREATE OR REPLACE FUNCTION data_upto_date(year integer,month integer) returns varchar(10) as $$
declare data varchar;
begin
SELECT left(to_char((date_trunc('MONTH', ( concat(year,0,month) ||'01')::date) + INTERVAL '1 MONTH - 1 day')::DATE,'DD-MM-YYYY'),10) into data;
return data;
END; $$
LANGUAGE PLPGSQL;

/* Data upto date  function*/

CREATE OR REPLACE FUNCTION data_from_date(year integer,month integer) returns varchar(10) as $$
declare data varchar;
begin
SELECT left(to_char((date_trunc('MONTH', ( concat(year,0,month) ||'01')::date))::DATE,'DD-MM-YYYY'),10) into data;
return data;
END; $$
LANGUAGE PLPGSQL;

/* Day wise logic*/

create table student_attendance_meta
(
day_1 boolean,day_2 boolean,day_3 boolean,day_4 boolean,day_5 boolean,day_6 boolean,day_7 boolean,day_8 boolean,day_9 boolean,day_10 boolean,
day_11 boolean,day_12 boolean,day_13 boolean,day_14 boolean,day_15 boolean,day_16 boolean,day_17 boolean,day_18 boolean,day_19 boolean,day_20 boolean,
day_21 boolean,day_22 boolean,day_23 boolean,day_24 boolean,day_25 boolean,day_26 boolean,day_27 boolean,day_28 boolean,day_29 boolean,day_30 boolean,
day_31 boolean,month int,year int
);

create table student_attendance_meta_hist as select * from student_attendance_meta;

-- Need to handled in pre-sql
insert into student_attendance_meta_hist (select * from student_attendance_meta except select * from student_attendance_meta_hist);

-- Need to handled in pre-sql
truncate table student_attendance_meta; -- only one record need to be maitained at any point of time which controls the insertion process

/*Values in student_attendance_meta specifies which day_s of the month's & which month of the year to be inserted or updated */
-- Need to handled in pre-sql
insert into student_attendance_meta values (True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,True,9,2019);

CREATE OR REPLACE FUNCTION day__wise_attendance()
RETURNS text AS
$$
DECLARE
_col_sql text :='SELECT string_agg(column_name,'','') FROM information_schema.columns WHERE table_catalog = ''cqubedev'' 
AND table_schema= ''public'' AND table_name = ''student_attendance_meta'' 
AND (ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_1 = True) THEN 1 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_2 = True) THEN 2 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_3 = True) THEN 3 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_4 = True) THEN 4 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_5 = True) THEN 5 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_6 = True) THEN 6 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_7 = True) THEN 7 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_8 = True) THEN 8 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_9 = True) THEN 9 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_10 = True) THEN 10 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_11 = True) THEN 11 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_12 = True) THEN 12 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_13 = True) THEN 13 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_14 = True) THEN 14 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_15 = True) THEN 15 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_16 = True) THEN 16 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_17 = True) THEN 17 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_18 = True) THEN 18 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_19 = True) THEN 19 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_20 = True) THEN 20 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_21 = True) THEN 21 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_22 = True) THEN 22 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_23 = True) THEN 23 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_24 = True) THEN 24 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_25 = True) THEN 25 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_26 = True) THEN 26 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_27 = True) THEN 27 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_28 = True) THEN 28 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_29 = True) THEN 29 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_30 = True) THEN 30 END
OR ordinal_position = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_31 = True) THEN 31 END)';

_column text :='';
_sql text:='';
BEGIN
EXECUTE _col_sql into _column;
_sql :=
      'WITH s AS (select * from student_attendance_temp where student_attendance_temp.month=(select month from student_attendance_meta)
  and student_attendance_temp.year=(select year from student_attendance_meta)),
upd AS (
UPDATE scl_data
     set day_2 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_2 = True) THEN
   s.day_2
   ELSE scl_data.day_2
  END
  ,day_3 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_3 = True) THEN
   s.day_3
   ELSE scl_data.day_3
  END
  ,day_4 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_4 = True) THEN
   s.day_4
   ELSE scl_data.day_4
  END
  ,day_5 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_5 = True) THEN
   s.day_5
   ELSE scl_data.day_5
  END
  ,day_6 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_6 = True) THEN
   s.day_6
   ELSE scl_data.day_6
  END
  ,day_7 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_7 = True) THEN
   s.day_7
   ELSE scl_data.day_7
  END
  ,day_8 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_8 = True) THEN
   s.day_8
   ELSE scl_data.day_8
  END
  ,day_9 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_9 = True) THEN
   s.day_9
   ELSE scl_data.day_9
  END
  ,day_10 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_10 = True) THEN
   s.day_10
   ELSE scl_data.day_10
  END
  ,day_11 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_11 = True) THEN
   s.day_11
   ELSE scl_data.day_11
  END
  ,day_12 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_12 = True) THEN
   s.day_12
   ELSE scl_data.day_12
  END
  ,day_13 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_13 = True) THEN
   s.day_13
   ELSE scl_data.day_13
  END
  ,day_14 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_14 = True) THEN
   s.day_4
   ELSE scl_data.day_14
  END
  ,day_15 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_15 = True) THEN
   s.day_15
   ELSE scl_data.day_15
  END
  ,day_16 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_16 = True) THEN
   s.day_16
   ELSE scl_data.day_16
  END
  ,day_17 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_17 = True) THEN
   s.day_17
   ELSE scl_data.day_17
  END
  ,day_18 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_18 = True) THEN
   s.day_18
   ELSE scl_data.day_18
  END
  ,day_19 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_19 = True) THEN
   s.day_19
   ELSE scl_data.day_19
  END
  ,day_20 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_20 = True) THEN
   s.day_20
   ELSE scl_data.day_20
  END
  ,day_21 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_21 = True) THEN
   s.day_21
   ELSE scl_data.day_21
  END
  ,day_22 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_22 = True) THEN
   s.day_22
   ELSE scl_data.day_22
  END
  ,day_23 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_23 = True) THEN
   s.day_23
   ELSE scl_data.day_23
  END
  ,day_24 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_24 = True) THEN
   s.day_24
   ELSE scl_data.day_24
  END
  ,day_25 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_25 = True) THEN
   s.day_25
   ELSE scl_data.day_25
  END
  ,day_26 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_26 = True) THEN
   s.day_26
   ELSE scl_data.day_26
  END
  ,day_27 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_27 = True) THEN
   s.day_27
   ELSE scl_data.day_27
  END
  ,day_28 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_28 = True) THEN
   s.day_28
   ELSE scl_data.day_28
  END
  ,day_29 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_29 = True) THEN
   s.day_29
   ELSE scl_data.day_29
  END
  ,day_30 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_30 = True) THEN
   s.day_30
   ELSE scl_data.day_30
  END
  ,day_31 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_31 = True) THEN
   s.day_31
   ELSE scl_data.day_31
  END
     FROM   s
     WHERE  scl_data.attendance_id = s.attendance_id
        and scl_data.month=(select month from student_attendance_meta)
  and scl_data.year=(select year from student_attendance_meta)
     RETURNING scl_data.attendance_id
) INSERT INTO scl_data(attendance_id,student_id,year,month,'||_column||')
       select s.attendance_id,s.student_id,s.school_id,s.year,s.month,'||_column ||'
       from s
       where s.attendance_id not in (select attendance_id from upd)';

   IF _column <> '' THEN  
  EXECUTE _sql;
   END IF;
  RETURN 0;
END;
$$  LANGUAGE plpgsql;

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
updated_on  TIMESTAMPTZ NOT NULL
-- ,foreign key (school_management_type_id) references school_master(school_management_type_id)
);

/*school_category_master*/

create table if not exists school_category_master
	(
school_category_id int primary key not null,
school_category varchar(100),
created_on  TIMESTAMPTZ NOT NULL,
updated_on  TIMESTAMPTZ NOT NULL
-- ,foreign key (school_category_id) references school_master(school_category_id)
);

/*school_medium_master*/

create table if not exists school_medium_master
	(
school_medium_id int primary key not null,
medium_of_school varchar(100),
created_on  TIMESTAMPTZ NOT NULL,
updated_on  TIMESTAMPTZ NOT NULL
-- ,foreign key (school_medium_id) references school_master(school_medium_id)
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
updated_on  TIMESTAMPTZ 
-- ,foreign key (school_id) references school_master(school_id)
);	

/* subject_master */

create table if not exists subject_master
(
subject_id  bigint primary key not null,
subject_name  double precision,
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
-- ,foreign key (school_id) references school_master(school_id)
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
		updated_on TIMESTAMPTZ
		-- ,foreign key (school_id) references school_geo_master(school_id)
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
		updated_on TIMESTAMPTZ
		-- ,foreign key (school_id) references school_hierarchy_details(school_id)
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
		updated_on TIMESTAMPTZ
		-- ,foreign key (school_id) references school_hierarchy_details(school_id)
		);

create index if not exists teacher_hierarchy_details_id on teacher_hierarchy_details(school_id,nature_of_employment);

/*student_attendance_temp*/

create table if not exists student_attendance_temp
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
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone
--foreign key (school_id) references school_hierarchy_details(school_id),
-- foreign key (student_id) references student_hierarchy_details(student_id)
);

create index if not exists student_attendance_temp_id on student_attendance_temp(school_id,month,student_id);

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
updated_on  TIMESTAMPTZ
--foreign key (school_id) references school_hierarchy_details(school_id),
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
updated_on  TIMESTAMPTZ
-- ,foreign key (school_id) references school_hierarchy_details(school_id),
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
updated_on  TIMESTAMPTZ
-- ,foreign key (school_id) references school_hierarchy_details(school_id)
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
updated_on  TIMESTAMPTZ
-- ,foreign key (school_id) references school_hierarchy_details(school_id),
-- foreign key (inspection_id) references crc_inspection_trans(crc_inspection_id)
);

create index if not exists crc_location_trans_id on crc_location_trans(school_id,crc_id);

/* student_semester_trans */

create table if not exists student_semester_trans
(
assessment_id serial,
year int,
student_uid bigint,
school_id  bigint,
semester  int ,
grade  int,
subject_1  int,
subject_2  int,
subject_3 int,
subject_4 int,
subject_5 int,
subject_6 int,
subject_7 int,
subject_8 int,
created_on  TIMESTAMP without time zone, 
updated_on  TIMESTAMP without time zone
-- ,foreign key (school_id) references school_hierarchy_details(school_id),
-- foreign key (inspection_id) references crc_inspection_trans(crc_inspection_id)
);

create index if not exists student_semester_trans_id on student_semester_trans(school_id,grade);


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

/*school_student_subject_total_marks*/

create table if not exists school_student_subject_total_marks
(
id  serial,
year  int,
semester  smallint,
school_id  bigint,
grade int,
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
subject_3_marks_scored  int,
subject_3_total_marks  int,
subject_1_marks_scored int,  
subject_1_total_marks  int,
subject_2_marks_scored  int,
subject_2_total_marks  int,
subject_7_marks_scored  int,
subject_7_total_marks  int,
subject_6_marks_scored  int,
subject_6_total_marks  int,
subject_4_marks_scored  int,
subject_4_total_marks  int,
subject_5_marks_scored  int,
subject_5_total_marks  int,
subject_8_marks_scored  int,
subject_8_total_marks  int,
students_count bigint,
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone
);

create index if not exists school_student_total_marks_id on school_student_subject_total_marks(semester,school_id,block_id,cluster_id);
