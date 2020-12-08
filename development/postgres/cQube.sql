/* tablefunc */

CREATE EXTENSION IF NOT EXISTS tablefunc;

/* manifest datasource */

create table IF NOT EXISTS manifest_datasource(
file_id int,
emission_time text,
folder_name text,
is_zip boolean,
total_files_in_zip_file int ,
relative_file_path text,
total_number_of_records_manifest int,
total_number_of_columns int,
total_number_of_records_csv int,
primary key(emission_time)
);

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
 ff_uuid text, 
 storage_date timestamp, 
 storage_name varchar(255), 
 status varchar(15),
 primary key(ff_uuid) 
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

create table IF NOT EXISTS student_attendance_meta
(
day_1 boolean,day_2 boolean,day_3 boolean,day_4 boolean,day_5 boolean,day_6 boolean,day_7 boolean,day_8 boolean,day_9 boolean,day_10 boolean,
day_11 boolean,day_12 boolean,day_13 boolean,day_14 boolean,day_15 boolean,day_16 boolean,day_17 boolean,day_18 boolean,day_19 boolean,day_20 boolean,
day_21 boolean,day_22 boolean,day_23 boolean,day_24 boolean,day_25 boolean,day_26 boolean,day_27 boolean,day_28 boolean,day_29 boolean,day_30 boolean,
day_31 boolean,month int,year int,primary key(month,year)
);

CREATE OR REPLACE FUNCTION student_attendance_refresh(year int,month int)
RETURNS text AS
$$
DECLARE
_col_sql text :='select string_agg(column_name,'','') from (select ''day_1'' as column_name from student_attendance_meta where day_1 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_2'' as column_name from student_attendance_meta where day_2 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_3'' as column_name from student_attendance_meta where day_3 = True and month= '||month||' and year = '||year||' 
UNION 
select ''day_4'' as column_name from student_attendance_meta where day_4 = True and month= '||month||' and year = '||year||' 
UNION 
select ''day_5'' as column_name from student_attendance_meta where day_5 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_6'' as column_name from student_attendance_meta where day_6 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_7'' as column_name from student_attendance_meta where day_7 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_8'' as column_name from student_attendance_meta where day_8 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_9'' as column_name from student_attendance_meta where day_9 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_10'' as column_name from student_attendance_meta where day_10 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_11'' as column_name from student_attendance_meta where day_11 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_12'' as column_name from student_attendance_meta where day_12 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_13'' as column_name from student_attendance_meta where day_13 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_14'' as column_name from student_attendance_meta where day_14 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_15'' as column_name from student_attendance_meta where day_15 = True and month= '||month||' and year = '||year||' 
UNION 
select ''day_16'' as column_name from student_attendance_meta where day_16 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_17'' as column_name from student_attendance_meta where day_17 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_18'' as column_name from student_attendance_meta where day_18 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_19'' as column_name from student_attendance_meta where day_19 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_20'' as column_name from student_attendance_meta where day_20 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_21'' as column_name from student_attendance_meta where day_21 = True and month=  '||month||' and year = '||year||'
UNION 
select ''day_22'' as column_name from student_attendance_meta where day_22 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_23'' as column_name from student_attendance_meta where day_23 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_24'' as column_name from student_attendance_meta where day_24 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_25'' as column_name from student_attendance_meta where day_25 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_26'' as column_name from student_attendance_meta where day_26 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_27'' as column_name from student_attendance_meta where day_27 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_28'' as column_name from student_attendance_meta where day_28 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_29'' as column_name from student_attendance_meta where day_29 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_30'' as column_name from student_attendance_meta where day_30 = True and month= '||month||' and year = '||year||'
UNION 
select ''day_31'' as column_name from student_attendance_meta where day_31 = True and month= '||month||' and year = '||year||') as col_tab;';

_column text :='';
_sql text:='';

_start_date text:='select (cast('||year||' as varchar)'||'||'||'''-'''||'||'||'cast('||month||' as varchar)'||'||'||'''-01'''||')::date';
start_date date;
l_query text;
r_query text;
c_query text;
d_query text;
res text;
u_query text;
m_query text;
_cols text:='select string_agg(days_to_be_processed'||'||''  ''||'''||'boolean'''||','','') from student_attendance_meta_temp where month='||month||' and year='||year;
col_name text;
d_meta text;
us_query text;
cnt_query text;
_count int;
rec_query text;
rec_exists boolean;
error_msg text;
BEGIN
cnt_query:='select count(*) from student_attendance_meta where month='||month||' and year='||year;
rec_query:='select EXISTS(select 1 from student_attendance_temp where month= '||month||' and year = '||year||')';
EXECUTE rec_query into rec_exists;
EXECUTE cnt_query into _count;
IF rec_exists=False THEN
error_msg:='student_attendance_temp table has no records for the month '||month||' and year '||year;  
RAISE log 'student_attendance_temp table has no records for the month % and year %',month,year;
return error_msg;
END IF;
IF _count = 0 THEN  
   EXECUTE 'INSERT INTO student_attendance_meta(month,year) values('||month||','||year||')';
END IF;

EXECUTE _start_date into start_date;

l_query:='select '||'days_in_a_month.day '||'as processed_date'||','||month||'as month'||','||year||'as year'||', '||'''day_'''||'||'||'date_part('||'''day'''||',days_in_a_month.day) as days_to_be_processed,True as to_run from (select (generate_series('''||start_date||'''::date,('''||start_date||'''::date+'||'''1month'''||'::interval-'||'''1day'''||'::interval)::date,'||'''1day'''||'::interval)::date) as day) as days_in_a_month';

d_query:='drop table if exists student_attendance_meta_temp';

EXECUTE d_query;

c_query:='create table if not exists student_attendance_meta_temp as '||l_query;


EXECUTE c_query;


m_query:='update student_attendance_meta_temp set to_run=False where (extract(dow from processed_date)=0 and month='||month||' and year='||year||') or  processed_date>current_date';
EXECUTE m_query;
EXECUTE _cols into col_name;
d_meta:='drop table if exists student_attendance_meta_stg';
EXECUTE d_meta;
res :='create table if not exists student_attendance_meta_stg as select * from crosstab('''||'select month,year,days_to_be_processed,to_run from student_attendance_meta_temp order by 1,2'||''','''||'select days_to_be_processed from student_attendance_meta_temp'||''') as t('||'month int,year int,'||col_name||')';

EXECUTE res;

u_query:='UPDATE student_attendance_meta sam
     set day_1 = CASE WHEN day_1 = False THEN
    False
    ELSE (select day_1 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_2 = CASE WHEN day_2 = False THEN
    False
    ELSE (select day_2 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_3 = CASE WHEN day_3 = False THEN
    False
    ELSE (select day_3 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_4 = CASE WHEN day_4 = False THEN
    False
    ELSE (select day_4 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_5 = CASE WHEN day_5 = False THEN
    False
    ELSE (select day_5 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_6 = CASE WHEN day_6 = False THEN
    False
    ELSE (select day_6 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_7 = CASE WHEN day_7 = False THEN
    False
    ELSE (select day_7 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_8 = CASE WHEN day_8 = False THEN
    False
    ELSE (select day_8 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_9 = CASE WHEN day_9 = False THEN
    False
    ELSE (select day_9 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
    ,day_10 = CASE WHEN day_10 = False THEN
    False
    ELSE (select day_10 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
    ,day_11 = CASE WHEN day_11 = False THEN
    False
    ELSE (select day_11 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_12 = CASE WHEN day_12 = False THEN
    False
    ELSE (select day_12 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_13 = CASE WHEN day_13 = False THEN
    False
    ELSE (select day_13 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_14 = CASE WHEN day_14 = False THEN
    False
    ELSE (select day_14 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_15 = CASE WHEN day_15 = False THEN
    False
    ELSE (select day_15 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_16 = CASE WHEN day_16 = False THEN
    False
    ELSE (select day_16 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_17 = CASE WHEN day_17 = False THEN
    False
    ELSE (select day_17 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_18 = CASE WHEN day_18 = False THEN
    False
    ELSE (select day_18 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_19 = CASE WHEN day_19 = False THEN
    False
    ELSE (select day_19 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
    ,day_20 = CASE WHEN day_20 = False THEN
    False
    ELSE (select day_20 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
    ,day_21 = CASE WHEN day_21 = False THEN
    False
    ELSE (select day_21 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_22 = CASE WHEN day_22 = False THEN
    False
    ELSE (select day_22 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_23 = CASE WHEN day_23 = False THEN
    False
    ELSE (select day_23 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_24 = CASE WHEN day_24 = False THEN
    False
    ELSE (select day_24 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_25 = CASE WHEN day_25 = False THEN
    False
    ELSE (select day_25 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_26 = CASE WHEN day_26 = False THEN
    False
    ELSE (select day_26 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_27 = CASE WHEN day_27 = False THEN
    False
    ELSE (select day_27 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_28 = CASE WHEN day_28 = False THEN
    False
    ELSE (select day_28 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_29 = CASE WHEN day_29 = False THEN
    False
    ELSE (select day_29 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_30 = CASE WHEN day_30 = False THEN
    False
    ELSE (select day_30 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
   ,day_31 = CASE WHEN day_31 = False THEN
    False
    ELSE (select day_31 from student_attendance_meta_stg where month='||month||' and year='||year||')
  END
  where 
   month = '||month||' and
   year = '||year;

EXECUTE u_query;
EXECUTE _col_sql into _column;

_sql :=
      'WITH s AS (select * from student_attendance_temp where student_attendance_temp.month='||month||'
 and student_attendance_temp.year='||year||'),
upd AS (
UPDATE student_attendance_trans
     set day_1 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_1 = True and month='||month||' and year='||year||') THEN
   s.day_1
   ELSE student_attendance_trans.day_1
  END
  ,day_2 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_2 = True and month='||month||' and year='||year||') THEN
   s.day_2
   ELSE student_attendance_trans.day_2
  END
  ,day_3 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_3 = True and month='||month||' and year='||year||') THEN
   s.day_3
   ELSE student_attendance_trans.day_3
  END
  ,day_4 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_4 = True and month='||month||' and year='||year||') THEN
   s.day_4
   ELSE student_attendance_trans.day_4
  END
  ,day_5 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_5 = True and month='||month||' and year='||year||') THEN
   s.day_5
   ELSE student_attendance_trans.day_5
  END
  ,day_6 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_6 = True and month='||month||' and year='||year||') THEN
   s.day_6
   ELSE student_attendance_trans.day_6
  END
  ,day_7 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_7 = True and month='||month||' and year='||year||') THEN
   s.day_7
   ELSE student_attendance_trans.day_7
  END
  ,day_8 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_8 = True and month='||month||' and year='||year||') THEN
   s.day_8
   ELSE student_attendance_trans.day_8
  END
  ,day_9 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_9 = True and month='||month||' and year='||year||') THEN
   s.day_9
   ELSE student_attendance_trans.day_9
  END
  ,day_10 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_10 = True and month='||month||' and year='||year||') THEN
   s.day_10
   ELSE student_attendance_trans.day_10
  END
  ,day_11 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_11 = True and month='||month||' and year='||year||') THEN
   s.day_11
   ELSE student_attendance_trans.day_11
  END
  ,day_12 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_12 = True and month='||month||' and year='||year||') THEN
   s.day_12
   ELSE student_attendance_trans.day_12
  END
  ,day_13 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_13 = True and month='||month||' and year='||year||') THEN
   s.day_13
   ELSE student_attendance_trans.day_13
  END
  ,day_14 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_14 = True and month='||month||' and year='||year||') THEN
   s.day_4
   ELSE student_attendance_trans.day_14
  END
  ,day_15 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_15 = True and month='||month||' and year='||year||') THEN
   s.day_15
   ELSE student_attendance_trans.day_15
  END
  ,day_16 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_16 = True and month='||month||' and year='||year||') THEN
   s.day_16
   ELSE student_attendance_trans.day_16
  END
  ,day_17 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_17 = True and month='||month||' and year='||year||') THEN
   s.day_17
   ELSE student_attendance_trans.day_17
  END
  ,day_18 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_18 = True and month='||month||' and year='||year||') THEN
   s.day_18
   ELSE student_attendance_trans.day_18
  END
  ,day_19 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_19 = True and month='||month||' and year='||year||') THEN
   s.day_19
   ELSE student_attendance_trans.day_19
  END
  ,day_20 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_20 = True and month='||month||' and year='||year||') THEN
   s.day_20
   ELSE student_attendance_trans.day_20
  END
  ,day_21 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_21 = True and month='||month||' and year='||year||') THEN
   s.day_21
   ELSE student_attendance_trans.day_21
  END
  ,day_22 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_22 = True and month='||month||' and year='||year||') THEN
   s.day_22
   ELSE student_attendance_trans.day_22
  END
  ,day_23 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_23 = True and month='||month||' and year='||year||') THEN
   s.day_23
   ELSE student_attendance_trans.day_23
  END
  ,day_24 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_24 = True and month='||month||' and year='||year||') THEN
   s.day_24
   ELSE student_attendance_trans.day_24
  END
  ,day_25 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_25 = True and month='||month||' and year='||year||') THEN
   s.day_25
   ELSE student_attendance_trans.day_25
  END
  ,day_26 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_26 = True and month='||month||' and year='||year||') THEN
   s.day_26
   ELSE student_attendance_trans.day_26
  END
  ,day_27 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_27 = True and month='||month||' and year='||year||') THEN
   s.day_27
   ELSE student_attendance_trans.day_27
  END
  ,day_28 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_28 = True and month='||month||' and year='||year||') THEN
   s.day_28
   ELSE student_attendance_trans.day_28
  END
  ,day_29 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_29 = True and month='||month||' and year='||year||') THEN
   s.day_29
   ELSE student_attendance_trans.day_29
  END
  ,day_30 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_30 = True and month='||month||' and year='||year||') THEN
   s.day_30
   ELSE student_attendance_trans.day_30
  END
  ,day_31 = CASE WHEN EXISTS (select 1 from student_attendance_meta where day_31 = True and month='||month||' and year='||year||') THEN
   s.day_31
   ELSE student_attendance_trans.day_31
  END
     FROM   s
     WHERE  student_attendance_trans.attendance_id = s.attendance_id
        and student_attendance_trans.month='||month||'
 and student_attendance_trans.year='||year||'
     RETURNING student_attendance_trans.attendance_id
) INSERT INTO student_attendance_trans(attendance_id,student_id,school_id,year,month,'||_column||',created_on,updated_on)
       select s.attendance_id,s.student_id,s.school_id,s.year,s.month,'||_column ||',created_on,updated_on
       from s
       where s.attendance_id not in (select attendance_id from upd)';

us_query := 'UPDATE student_attendance_meta sam
     set day_1 = CASE WHEN day_1 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_1 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_1
  END
   ,day_2 = CASE WHEN day_2 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_2 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_2
  END
   ,day_3 = CASE WHEN day_3 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_3 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_3
  END
   ,day_4 = CASE WHEN day_4 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_4 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_4
  END
   ,day_5 = CASE WHEN day_5 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_5 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_5
  END
   ,day_6 = CASE WHEN day_6 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_6 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_6
  END
   ,day_7 = CASE WHEN day_7 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_7 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_7
  END
   ,day_8 = CASE WHEN day_8 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_8 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_8
  END
   ,day_9 = CASE WHEN day_9 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_9 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_9
  END
    ,day_10 = CASE WHEN day_10 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_10 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_10
  END
    ,day_11 = CASE WHEN day_11 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_11 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_11
  END
   ,day_12 = CASE WHEN day_12 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_12 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_12
  END
   ,day_13 = CASE WHEN day_13 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_13 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_13
  END
   ,day_14 = CASE WHEN day_14 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_14 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_14
  END
   ,day_15 = CASE WHEN day_15 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_15 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_15
  END
   ,day_16 = CASE WHEN day_16 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_16 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_16
  END
   ,day_17 = CASE WHEN day_17 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_17 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_17
  END
   ,day_18 = CASE WHEN day_18 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_18 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_18
  END
   ,day_19 = CASE WHEN day_19 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_19 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_19
  END
    ,day_20 = CASE WHEN day_20 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_20 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_20
  END
    ,day_21 = CASE WHEN day_21 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_21 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_21
  END
   ,day_22 = CASE WHEN day_22 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_22 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_22
  END
   ,day_23 = CASE WHEN day_23 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_23 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_23
  END
   ,day_24 = CASE WHEN day_24 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_24 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_24
  END
   ,day_25 = CASE WHEN day_25 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_25 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_25
  END
   ,day_26 = CASE WHEN day_26 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_26 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_26
  END
   ,day_27 = CASE WHEN day_27 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_27 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_27
  END
   ,day_28 = CASE WHEN day_28 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_28 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_28
  END
   ,day_29 = CASE WHEN day_29 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_29 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_29
  END
   ,day_30 = CASE WHEN day_30 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_30 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_30
  END
   ,day_31 = CASE WHEN day_31 = False THEN
    False
    WHEN EXISTS (select 1 from student_attendance_trans where day_31 is not null and month='||month||' and year='||year||' limit 1) THEN
   False
   ELSE sam.day_31
  END
  where 
   month = '||month||' and
   year = '||year;

   IF _column <> '' THEN  
 EXECUTE _sql;
 EXECUTE us_query;
   END IF;


return 0;
END;
$$  LANGUAGE plpgsql;

/* temperory table */

create table if not exists cluster_tmp
  (
cluster_id  bigint primary key not null,
cluster_name varchar(250),
block_id  bigint,
district_id  bigint,
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
);

create table if not exists block_tmp
  (
block_id  bigint primary key not null,
block_name varchar(250),
district_id  bigint,
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
);

create table if not exists district_tmp
  (
district_id  bigint primary key not null,
district_name varchar(250),
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
);

create table if not exists school_tmp
  (
school_id  bigint primary key not null,
school_name varchar(250),
school_lowest_class  int,
school_highest_class  int,
school_management_type_id int ,
school_category_id  int ,
school_medium_id  int ,
state_id bigint,
district_id bigint,
block_id bigint,
cluster_id bigint,
latitude double precision,
longitude double precision,
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
);


/* mst tables */

create table if not exists cluster_mst
  (
cluster_id  bigint primary key not null,
cluster_name varchar(250),
block_id  bigint,
district_id  bigint,
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
);

create table if not exists block_mst
  (
block_id  bigint primary key not null,
block_name varchar(250),
district_id  bigint,
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
);

create table if not exists district_mst
  (
district_id  bigint primary key not null,
district_name varchar(250),
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
);

/*school_master*/

create table if not exists school_master
  (
school_id  bigint primary key not null,
school_name varchar(250),
school_lowest_class  int,
school_highest_class  int,
school_management_type_id int ,
school_category_id  int ,
school_medium_id  int ,
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
);

/*school_management_master*/

create table if not exists school_management_master
  (
school_management_type_id int primary key not null,
school_management_type varchar(100),
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
-- ,foreign key (school_management_type_id) references school_master(school_management_type_id)
);

/*school_category_master*/

create table if not exists school_category_master
  (
school_category_id int primary key not null,
school_category varchar(100),
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
-- ,foreign key (school_category_id) references school_master(school_category_id)
);

/*school_medium_master*/

create table if not exists school_medium_master
  (
school_medium_id int primary key not null,
medium_of_school varchar(100),
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
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
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone 
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
    created_on TIMESTAMP without time zone,
    updated_on TIMESTAMP without time zone
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
    created_on TIMESTAMP without time zone,
    updated_on TIMESTAMP without time zone
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
    created_on TIMESTAMP without time zone,
    updated_on TIMESTAMP without time zone
    -- ,foreign key (school_id) references school_hierarchy_details(school_id)
    );

create index if not exists teacher_hierarchy_details_id on teacher_hierarchy_details(school_id,nature_of_employment);

/*student_attendance_staging*/

create table if not exists student_attendance_staging_1
(
  ff_uuid text,
attendance_id  bigint,
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

create index if not exists student_attendance_staging1_id on student_attendance_staging_1(school_id,month,student_id);

create table if not exists student_attendance_staging_2
(
  ff_uuid text,
attendance_id  bigint,
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

create index if not exists student_attendance_staging2_id on student_attendance_staging_2(school_id,month,student_id);



/*student_attendance_temp*/

create table if not exists student_attendance_temp
(
ff_uuid text,
attendance_id  bigint,
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
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone
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
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone
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
visit_start_time TIME without time zone,
visit_end_time TIME without time zone,
total_class_rooms smallint,
actual_class_rooms smallint,
total_suggestion_last_month smallint,
resolved_from_that smallint,
is_inspection smallint,
reason_type varchar(100),
reason_desc text,
total_score double precision,
score double precision,
is_offline boolean,
created_on  TIMESTAMP without time zone, /* created_on field will come from source data*/
updated_on  TIMESTAMP without time zone
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
latitude  double precision,
longitude  double precision,
in_school_location  boolean,
year int,
month int,
created_on  TIMESTAMP without time zone, 
updated_on  TIMESTAMP without time zone
-- ,foreign key (school_id) references school_hierarchy_details(school_id),
-- foreign key (inspection_id) references crc_inspection_trans(crc_inspection_id)
);

create index if not exists crc_location_trans_id on crc_location_trans(school_id,crc_id);


/* student_semester_staging */

create table if not exists student_semester_temp
(
  ff_uuid text,
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

create table if not exists student_semester_staging
(
  ff_uuid text,
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
updated_on  TIMESTAMP without time zone,
primary key(student_uid,school_id,semester,grade)
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
created_on  TIMESTAMP without time zone ,
updated_on  TIMESTAMP without time zone,
primary key(school_id,month,year)
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
created_on  TIMESTAMP without time zone ,   
updated_on  TIMESTAMP without time zone
);

create index if not exists school_teacher_total_attendance_id on school_teacher_total_attendance(month,school_id,block_id,cluster_id);

/* crc_visits_frequency */

create table if not exists crc_visits_frequency
(
school_id  bigint,
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
created_on  TIMESTAMP without time zone,
updated_on  TIMESTAMP without time zone,
primary key(school_id,month,year)
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
updated_on  TIMESTAMP without time zone,
primary key(school_id,semester,grade)
);

create index if not exists school_student_total_marks_id on school_student_subject_total_marks(semester,school_id,block_id,cluster_id);

/* Infra tables*/

/* infrastructure_staging_init */

create table if not exists infrastructure_staging_init
(  infrastructure_name varchar(30),
   infrastructure_category varchar(20),
   status boolean,
   created_on timestamp,
   updated_on timestamp
); 

/* infrastructure_staging_score */

create table if not exists infrastructure_staging_score
(  infrastructure_name varchar(30),
   infrastructure_category varchar(20),
   score numeric DEFAULT 0 not null,
   created_on timestamp,
   updated_on timestamp
); 

/* infrastructure_hist */

create table if not exists infrastructure_hist
(
id serial,
school_id bigint,
inspection_id bigint,
infrastructure_name varchar(20), 
new_value int,
old_value int,
created_on TIMESTAMP without time zone,
operation varchar(20)
);

/* infrastructure_master */

create sequence if not exists infra_seq;
alter sequence infra_seq restart; 

create table if not exists infrastructure_master
(  infrastructure_id text CHECK (infrastructure_id ~ '^infrastructure_[0-9]+$' ) 
                                    DEFAULT 'infrastructure_'  || nextval('infra_seq'),
   infrastructure_name varchar(30),
   infrastructure_category varchar(20),
   score numeric DEFAULT 0 not null,
   status boolean,
   created_on timestamp,
   updated_on timestamp,
primary key(infrastructure_name,infrastructure_id)
); 

/* Table name:log_summary */

create table if not exists log_summary(
filename varchar(200),
ff_uuid varchar(200),
total_records bigint,
blank_lines int,
duplicate_records int,
datatype_mismatch int,
attendance_id bigint,
student_id bigint,
school_id bigint,
year bigint,
month int,
semester int,
grade int,
inspection_id bigint,
in_school_location bigint,
created_on bigint,
school_name bigint,
cluster_name bigint,
block_name bigint,
district_name bigint,
cluster_id bigint,
block_id bigint,
district_id bigint,
latitude int,
longitude int,
  content_view_date int,
  dimensions_pdata_id int,
  dimensions_pdata_pid int,
  content_name int,
  content_board int,
  content_mimetype int,
  content_medium int,
  content_gradelevel int,
  content_subject int,
  content_created_for int,
  object_id int,
  object_rollup_l1 int,
  derived_loc_state int,
  derived_loc_district int,
  user_signin_type int,
  user_login_type int,
  collection_name int,
  collection_board int,
  collection_type int,
  collection_medium int,
  collection_gradelevel int,
  collection_subject int,
  collection_created_for int,
  total_count int,
  total_time_spent int,
processed_records int,
process_start_time timestamp ,
process_end_time timestamp
);

/* Table name :    stud_att_null_col */

create table if not exists stud_att_null_col( filename    varchar(200),
 ff_uuid    varchar(200),         
 count_null_studentattid  int,
 count_null_studentid  int,
 count_null_schoolid int,
 count_null_academicyear int, 
count_null_month  int
 );

/* Table name: sem_null_col */

create table if not exists sem_null_col
(filename  varchar(200),  
 ff_uuid  varchar(200), 
 count_null_schoolid int,
 count_null_studentid int,
 count_null_sem int,
 count_null_studyingclass int);

/* Table name: crc_loc_null_col */

create table if not exists crc_loc_null_col (filename varchar(200),
     ff_uuid varchar(200),            
     count_null_schoolid  int, 
      count_null_inspectionid int,
      inschoolloc int,
       count_null_createdon int,
      count_latitude int,
       count_longitude int);

/* Table name: crc_inspec_null_col */

create table if not exists crc_inspec_null_col(filename varchar(200),
ff_uuid varchar(200),
count_null_schoolid int,
 count_null_inspectionid int,
 count_null_createdon int);

/* Table name : dist_null_col */

create table if not exists dist_null_col( filename varchar(200),
 ff_uuid varchar(200),
 count_null_districtid int,
  Count_null_district  int);

/*Table name: cluster_null_col*/

create table if not exists cluster_null_col( filename varchar(200),
 ff_uuid varchar(200),
count_null_clusterid int,
count_null_cluster int,
 count_null_districtid int,
 count_null_block int,
 count_null_blockid  int);

/*Table name: block_null_col*/

create table if not exists block_null_col( filename varchar(200),
 ff_uuid varchar(200),
count_null_districtid int,
count_null_block int,
 count_null_blockid int);

/*Table name: school_null_col*/

create table if not exists school_null_col( filename varchar(200),
 ff_uuid varchar(200),
count_null_school int,
count_null_latitude int,
count_null_longitude int);

/*Table name: infra_null_col*/

create table if not exists infra_null_col( filename varchar(200),
 ff_uuid varchar(200),
count_null_schoolid int);

/* Duplicate records tables */

create table if not exists student_attendance_dup
(
attendance_id  bigint  not null,
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
num_of_times int,
ff_uuid varchar(255),
created_on_file_process timestamp default current_timestamp
);

create table if not exists student_semester_dup
(
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
num_of_times int,
ff_uuid varchar(255),
created_on_file_process timestamp default current_timestamp
);

create table if not exists crc_location_dup
(
crc_location_id bigint  not null,
crc_id bigint,
inspection_id  bigint,
school_id  bigint ,
latitude  double precision,
longitude  double precision,
in_school_location  boolean,
num_of_times int,
ff_uuid varchar(255),
created_on  TIMESTAMP without time zone  ,
created_on_file_process  TIMESTAMP without time zone default current_timestamp
);

create table if not exists crc_inspection_dup
(
crc_inspection_id bigint  not null,
crc_id bigint,
crc_name varchar(100),
school_id  bigint,
lowest_class smallint,
highest_class smallint,
visit_start_time TIME without time zone,
visit_end_time TIME without time zone,
total_class_rooms smallint,
actual_class_rooms smallint,
total_suggestion_last_month smallint,
resolved_from_that smallint,
is_inspection smallint,
reason_type varchar(100),
reason_desc text,
total_score double precision,
score double precision,
is_offline boolean,
num_of_times int,
ff_uuid varchar(255),
created_on_file_process  TIMESTAMP without time zone default current_timestamp
);

create table if not exists district_dup
  (
district_id  bigint  not null,
district_name varchar(250),
created_on  TIMESTAMP without time zone ,
num_of_times int,
ff_uuid varchar(255),
created_on_file_process  TIMESTAMP without time zone default current_timestamp
);

create table if not exists block_dup
  (
block_id  bigint  not null,
block_name varchar(250),
district_id  bigint,
num_of_times int,
ff_uuid varchar(255),
created_on  TIMESTAMP without time zone ,
created_on_file_process  TIMESTAMP without time zone default current_timestamp

);


create table if not exists cluster_dup
  (
cluster_id  bigint  not null,
cluster_name varchar(250),
block_id  bigint,
district_id  bigint,
num_of_times int,
ff_uuid varchar(255),
created_on  TIMESTAMP without time zone ,
created_on_file_process  TIMESTAMP without time zone default current_timestamp
);


create table if not exists school_dup
  (
school_id  bigint  not null,
school_name varchar(250),
school_lowest_class  int,
school_highest_class  int,
school_management_type_id int ,
school_category_id  int ,
school_medium_id  int ,
school_latitude  double precision,
school_longitude  double precision,
district_id  bigint,
block_id bigint,
cluster_id bigint,
num_of_times int,
ff_uuid varchar(255),
created_on_file_process  TIMESTAMP without time zone default current_timestamp
);


create table if not exists school_invalid_data
  (
    ff_uuid text,
    exception_type text,
    school_id bigint ,
    school_name varchar(300),
    block_id bigint,
    district_id bigint,
    cluster_id bigint,
    school_latitude double precision,
    school_longitude double precision,
    created_on TIMESTAMP without time zone
    -- ,foreign key (school_id) references school_geo_master(school_id)
    );


/*Diksha*/
/* master table */

create table IF NOT EXISTS diksha_content_staging(
  ff_uuid text,
  content_view_date date,
  dimensions_pdata_id text,
  dimensions_pdata_pid text,
  content_name text,
  content_board text,
  content_mimetype text,
  content_medium text,
  content_gradelevel text,
  content_subject text,
  content_created_for double precision,
  object_id text,
  object_rollup_l1 text,
  derived_loc_state text,
  derived_loc_district text,
  user_signin_type text,
  user_login_type text,
  collection_name text,
  collection_board text,
  collection_type text,
  collection_medium text,
  collection_gradelevel text,
  collection_subject text,
  collection_created_for double precision,
  total_count int,
  total_time_spent double precision,
  created_on TIMESTAMP without time zone,
  updated_on TIMESTAMP without time zone 
  );

create table IF NOT EXISTS diksha_content_temp(
  ff_uuid text,
  content_view_date date,
  dimensions_pdata_id text,
  dimensions_pdata_pid text,
  content_name text,
  content_board text,
  content_mimetype text,
  content_medium text,
  content_gradelevel text,
  content_subject text,
  content_created_for double precision,
  object_id text,
  object_rollup_l1 text,
  derived_loc_state text,
  derived_loc_district text,
  user_signin_type text,
  user_login_type text,
  collection_name text,
  collection_board text,
  collection_type text,
  collection_medium text,
  collection_gradelevel text,
  collection_subject text,
  collection_created_for double precision,
  total_count int,
  total_time_spent double precision,
  created_on TIMESTAMP without time zone,
  updated_on TIMESTAMP without time zone 
  );


/* Transanction table */
/* diksha_content_trans*/

  create table IF NOT EXISTS diksha_content_trans(
  ff_uuid text,
  content_view_date date,
  dimensions_pdata_id text,
  dimensions_pdata_pid text,
  content_name text,
  content_board text,
  content_mimetype text,
  content_medium text,
  content_gradelevel text,
  content_subject text,
  content_created_for double precision,
  object_id text,
  object_rollup_l1 text,
  derived_loc_state text,
  derived_loc_district text,
  user_signin_type text,
  user_login_type text,
  collection_name text,
  collection_board text,
  collection_type text,
  collection_medium text,
  collection_gradelevel text,
  collection_subject text,
  collection_created_for double precision,
  total_count int,
  total_time_spent double precision,
  created_on TIMESTAMP without time zone,
  updated_on TIMESTAMP without time zone 
  );

/* Aggregation table*/
/* diksha_total_content*/

  create table IF NOT EXISTS diksha_total_content(
  id serial,
  district_id int,
  district_name text,
  district_latitude double precision,
  district_longitude double precision,
  content_view_date date,
  dimensions_pdata_id text,
  dimensions_pdata_pid text,
  content_name text,
  content_board text,
  content_mimetype text,
  content_medium text,
  content_gradelevel text,
  content_subject text,
  content_created_for double precision,
  object_id text,
  object_rollup_l1 text,
  derived_loc_state text,
  derived_loc_district text,
  user_signin_type text,
  user_login_type text,
  collection_name text,
  collection_board text,
  collection_type text,
  collection_medium text,
  collection_gradelevel text,
  collection_subject text,
  collection_created_for double precision,
  total_count int,
  total_time_spent double precision,
  created_on TIMESTAMP without time zone,
  updated_on TIMESTAMP without time zone 
  );

/* null check*/
/* diksha_null_col*/

  create table if not exists diksha_null_col
    (
  filename varchar(200),
  ff_uuid varchar(200),
  count_null_content_view_date int,
  count_null_dimensions_pdata_id int,
  count_null_dimensions_pdata_pid int,
  count_null_content_name int,
  count_null_content_board int,
  count_null_content_mimetype int,
  count_null_content_medium int,
  count_null_content_gradelevel int,
  count_null_content_subject int,
  count_null_content_created_for int,
  count_null_object_id int,
  count_null_object_rollup_l1 int,
  count_null_derived_loc_state int,
  count_null_derived_loc_district int,
  count_null_user_signin_type int,
  count_null_user_login_type int,
  count_null_collection_type int,
  count_null_collection_created_for int,
  count_null_total_count int,
  count_null_total_time_spent  int
  );

/* Duplicate check*/
/* diksha_dup*/

  create table if not exists diksha_dup
    (
  content_view_date date,
  dimensions_pdata_id text,
  dimensions_pdata_pid text,
  content_name text,
  content_board text,
  content_mimetype text,
  content_medium text,
  content_gradelevel text,
  content_subject text,
  content_created_for double precision,
  object_id text,
  object_rollup_l1 text,
  derived_loc_state text,
  derived_loc_district text,
  user_signin_type text,
  user_login_type text,
  collection_name text,
  collection_board text,
  collection_type text,
  collection_medium text,
  collection_gradelevel text,
  collection_subject text,
  collection_created_for double precision,
  total_count int,
  total_time_spent double precision,
  num_of_times int,
  ff_uuid varchar(255),
  created_on_file_process  TIMESTAMP without time zone default current_timestamp
  ); 

/*Telemetry*/

create table if not exists emission_files_details
    (
  filename text,
  ff_uuid text,
  s3_bucket text,
  last_modified_time TIMESTAMP without time zone,
  processed_status boolean,
  created_on TIMESTAMP without time zone default current_timestamp
  );

create table if not exists telemetry_data
    (
  pageid text,
  uid text,
  event text,
  level text,
  locationid bigint,
  locationname text,
  lat double precision,
  lng double precision,
  download int,
  created_on TIMESTAMP without time zone default current_timestamp
  );

/*Upgrade scripts*/

/*files_ingestion table*/
alter table files_ingestion alter COLUMN ff_uuid type text;
alter table files_ingestion drop constraint if exists files_ingestion_pkey;
alter table files_ingestion add primary key(ff_uuid);

/*student_attendance_meta*/
alter table student_attendance_meta drop constraint if exists student_attendance_meta_pkey;
alter table student_attendance_meta add primary key(month,year);

/*school_master*/
alter table school_master drop COLUMN if exists school_address;
alter table school_master drop COLUMN if exists school_zipcode;
alter table school_master drop COLUMN if exists school_contact_number;
alter table school_master drop COLUMN if exists school_email_contact;
alter table school_master drop COLUMN if exists school_website;

/*student_attendance_temp*/
alter table student_attendance_temp add COLUMN if not exists ff_uuid text;
alter table student_attendance_temp drop constraint if exists student_attendance_temp_pkey;
alter table student_attendance_temp add primary key(ff_uuid,attendance_id);

/*crc_inspection_trans*/
alter table crc_inspection_trans alter COLUMN total_score type double precision;

/*student_semester_trans*/
alter table student_semester_staging add COLUMN if not exists ff_uuid text;
alter table student_semester_trans drop constraint if exists student_semester_trans_pkey;
alter table student_semester_trans add primary key(student_uid, school_id, semester, grade);

/*log summary*/
alter table log_summary add COLUMN if not exists datatype_mismatch int;
alter table log_summary add COLUMN if not exists content_view_date int;
alter table log_summary add COLUMN if not exists dimensions_pdata_pid int;
alter table log_summary add COLUMN if not exists dimensions_pdata_id int;
alter table log_summary add COLUMN if not exists content_name int;
alter table log_summary add COLUMN if not exists content_board int;
alter table log_summary add COLUMN if not exists content_mimetype int;
alter table log_summary add COLUMN if not exists content_medium int;
alter table log_summary add COLUMN if not exists content_gradelevel int;
alter table log_summary add COLUMN if not exists content_subject int;
alter table log_summary add COLUMN if not exists content_created_for int;
alter table log_summary add COLUMN if not exists object_id int;
alter table log_summary add COLUMN if not exists object_rollup_l1 int;
alter table log_summary add COLUMN if not exists derived_loc_state int;
alter table log_summary add COLUMN if not exists derived_loc_district int;
alter table log_summary add COLUMN if not exists user_signin_type int;
alter table log_summary add COLUMN if not exists user_login_type int;
alter table log_summary add COLUMN if not exists collection_name int;
alter table log_summary add COLUMN if not exists collection_board int;
alter table log_summary add COLUMN if not exists collection_type int;
alter table log_summary add COLUMN if not exists collection_medium int;
alter table log_summary add COLUMN if not exists collection_gradelevel int;
alter table log_summary add COLUMN if not exists collection_subject int;
alter table log_summary add COLUMN if not exists collection_created_for int;
alter table log_summary add COLUMN if not exists total_count int;
alter table log_summary add COLUMN if not exists total_time_spent int;

/*sem null coll*/
alter table sem_null_col add COLUMN if not exists count_null_studentid int;

/*diksha content trans*/
alter table diksha_content_trans add COLUMN if not exists ff_uuid text;

/*Udise tables*/

create table if not exists udise_nsqf_plcmnt_c12(
udise_sch_code  bigint not null,
ac_year  text,
sector_no  smallint not null,
item_id  smallint,
opt_plcmnt_b  smallint,
opt_plcmnt_g  smallint,
placed_b  smallint,
placed_g  smallint,
voc_hs_b  smallint,
voc_hs_g  smallint,
nonvoc_hs_b  smallint,
nonvoc_hs_g  smallint,
self_emp_b  smallint,
self_emp_g  smallint,
primary key(udise_sch_code,sector_no,item_id)
);

create table if not exists udise_nsqf_plcmnt_c10(
udise_sch_code  bigint not null,
ac_year  text,
sector_no  smallint not null,
item_id  smallint,
opt_plcmnt_b  smallint,
opt_plcmnt_g  smallint,
placed_b  smallint,
placed_g  smallint,
voc_hs_b  smallint,
voc_hs_g  smallint,
nonvoc_hs_b  smallint,
nonvoc_hs_g  smallint,
self_emp_b  smallint,
self_emp_g  smallint,
primary key(udise_sch_code,sector_no,item_id)
);

create table if not exists udise_nsqf_class_cond(
udise_sch_code  bigint not null,
ac_year  text,
sector_no  smallint not null,
class_type_id  smallint not null,
c9  smallint,
c10  smallint,
c11  smallint,
c12  smallint,
primary key(udise_sch_code,sector_no,class_type_id)
);

create table if not exists udise_sch_exmres_c12(
udise_sch_code  bigint not null,
ac_year  text,
item_id  smallint not null,
stream_id  smallint not null,
gen_app_b  smallint,
gen_app_g  smallint,
obc_app_b  smallint,
obc_app_g  smallint,
sc_app_b  smallint,
sc_app_g  smallint,
st_app_b  smallint,
st_app_g  smallint,
gen_pass_b  smallint,
gen_pass_g  smallint,
obc_pass_b  smallint,
obc_pass_g  smallint,
sc_pass_b  smallint,
sc_pass_g  smallint,
st_pass_b  smallint,
st_pass_g  smallint,
primary key(udise_sch_code,item_id,stream_id)
);

create table if not exists udise_sch_exmres_c10(
udise_sch_code  bigint not null,
ac_year  text,
item_id  smallint not null,
gen_app_b  smallint,
gen_app_g  smallint,
obc_app_b  smallint,
obc_app_g  smallint,
sc_app_b  smallint,
sc_app_g  smallint,
st_app_b  smallint,
st_app_g  smallint,
gen_pass_b  smallint,
gen_pass_g  smallint,
obc_pass_b  smallint,
obc_pass_g  smallint,
sc_pass_b  smallint,
sc_pass_g  smallint,
st_pass_b  smallint,
st_pass_g  smallint,
primary key(udise_sch_code,item_id)
);

create table if not exists udise_sch_exmres_c5(
udise_sch_code  bigint primary key not null,
ac_year  text,
gen_app_b  smallint,
gen_app_g  smallint,
obc_app_b  smallint,
obc_app_g  smallint,
sc_app_b  smallint,
sc_app_g  smallint,
st_app_b  smallint,
st_app_g  smallint,
gen_pass_b  smallint,
gen_pass_g  smallint,
obc_pass_b  smallint,
obc_pass_g  smallint,
sc_pass_b  smallint,
sc_pass_g  smallint,
st_pass_b  smallint,
st_pass_g  smallint,
gen_60p_b  smallint,
gen_60p_g  smallint,
obc_60p_b  smallint,
obc_60p_g  smallint,
sc_60p_b  smallint,
sc_60p_g  smallint,
st_60p_b  smallint,
st_60p_g  smallint
);

create table if not exists udise_sch_incen_cwsn(
udise_sch_code  bigint not null,
ac_year  text,
item_id  smallint not null,
tot_pre_pri_b  smallint,
tot_pre_pri_g  smallint,
tot_pry_b  smallint,
tot_pry_g  smallint,
tot_upr_b  smallint,
tot_upr_g  smallint,
tot_sec_b  smallint,
tot_sec_g  smallint,
tot_hsec_b  smallint,
tot_hsec_g  smallint,
primary key(udise_sch_code,item_id)
);

create table if not exists udise_sch_incentives(
udise_sch_code  bigint not null,
ac_year  text,
grade_pri_upr  smallint not null,
incentive_type  smallint not null,
gen_b  smallint,
gen_g  smallint,
sc_b  smallint,
sc_g  smallint,
st_b  smallint,
st_g  smallint,
obc_b  smallint,
obc_g  smallint,
min_muslim_b  smallint,
min_muslim_g  smallint,
min_oth_b  smallint,
min_oth_g  smallint,
primary key(udise_sch_code,grade_pri_upr,incentive_type)
);

create table if not exists udise_sch_enr_by_stream(
udise_sch_code  bigint not null,
ac_year  text,
stream_id  smallint not null,
caste_id  smallint not null,
ec11_b  smallint,
ec11_g  smallint,
ec12_b  smallint,
ec12_g  smallint,
rc11_b  smallint,
rc11_g  smallint,
rc12_b  smallint,
rc12_g  smallint,
primary key(udise_sch_code,stream_id,caste_id)
);

create table if not exists udise_sch_enr_cwsn(
udise_sch_code  bigint not null,
ac_year  text,
disability_type  smallint not null,
cpp_b  smallint,
cpp_g  smallint,
c1_b  smallint,
c1_g  smallint,
c2_b  smallint,
c2_g  smallint,
c3_b  smallint,
c3_g  smallint,
c4_b  smallint,
c4_g  smallint,
c5_b  smallint,
c5_g  smallint,
c6_b  smallint,
c6_g  smallint,
c7_b  smallint,
c7_g  smallint,
c8_b  smallint,
c8_g  smallint,
c9_b  smallint,
c9_g  smallint,
c10_b  smallint,
c10_g  smallint,
c11_b  smallint,
c11_g  smallint,
c12_b  smallint,
c12_g  smallint,
primary key(udise_sch_code,disability_type)
);

create table if not exists udise_sch_enr_medinstr(
udise_sch_code  bigint not null,
ac_year  text,
medinstr_seq  smallint not null,
c1_b  smallint,
c1_g  smallint,
c2_b  smallint,
c2_g  smallint,
c3_b  smallint,
c3_g  smallint,
c4_b  smallint,
c4_g  smallint,
c5_b  smallint,
c5_g  smallint,
c6_b  smallint,
c6_g  smallint,
c7_b  smallint,
c7_g  smallint,
c8_b  smallint,
c8_g  smallint,
c9_b  smallint,
c9_g  smallint,
c10_b  smallint,
c10_g  smallint,
c11_b  smallint,
c11_g  smallint,
primary key(udise_sch_code,medinstr_seq)
);

create table if not exists udise_sch_enr_age(
udise_sch_code  bigint not null,
ac_year  text,
age_id  smallint not null,
c1_b  smallint,
c1_g  smallint,
c2_b  smallint,
c2_g  smallint,
c3_b  smallint,
c3_g  smallint,
c4_b  smallint,
c4_g  smallint,
c5_b  smallint,
c5_g  smallint,
c6_b  smallint,
c6_g  smallint,
c7_b  smallint,
c7_g  smallint,
c8_b  smallint,
c8_g  smallint,
c9_b  smallint,
c9_g  smallint,
c10_b  smallint,
c10_g  smallint,
c11_b  smallint,
c11_g  smallint,
c12_b  smallint,
c12_g  smallint,
primary key(udise_sch_code,age_id)
);

create table if not exists udise_sch_enr_reptr(
udise_sch_code  bigint not null,
ac_year  text,
item_group  smallint not null,
item_id  smallint not null,
c1_b  smallint,
c1_g  smallint,
c2_b  smallint,
c2_g  smallint,
c3_b  smallint,
c3_g  smallint,
c4_b  smallint,
c4_g  smallint,
c5_b  smallint,
c5_g  smallint,
c6_b  smallint,
c6_g  smallint,
c7_b  smallint,
c7_g  smallint,
c8_b  smallint,
c8_g  smallint,
c9_b  smallint,
c9_g  smallint,
c10_b  smallint,
c10_g  smallint,
c11_b  smallint,
c11_g  smallint,
c12_b  smallint,
c12_g  smallint,
primary key(udise_sch_code,item_group,item_id)
);

create table if not exists udise_sch_enr_fresh(
udise_sch_code  bigint not null,
ac_year  text,
item_group  smallint not null,
item_id  smallint not null,
cpp_b  smallint,
cpp_g  smallint,
c1_b  smallint,
c1_g  smallint,
c2_b  smallint,
c2_g  smallint,
c3_b  smallint,
c3_g  smallint,
c4_b  smallint,
c4_g  smallint,
c5_b  smallint,
c5_g  smallint,
c6_b  smallint,
c6_g  smallint,
c7_b  smallint,
c7_g  smallint,
c8_b  smallint,
c8_g  smallint,
c9_b  smallint,
c9_g  smallint,
c10_b  smallint,
c10_g  smallint,
c11_b  smallint,
c11_g  smallint,
c12_b  smallint,
c12_g  smallint,
primary key(udise_sch_code,item_group,item_id)
);

create table if not exists udise_sch_enr_newadm(
udise_sch_code  bigint primary key not null,
ac_year  text,
age4_b  smallint,
age4_g  smallint,
age5_b  smallint,
age5_g  smallint,
age6_b  smallint,
age6_g  smallint,
age7_b  smallint,
age7_g  smallint,
age8_b  smallint,
age8_g  smallint,
same_sch_b  smallint,
same_sch_g  smallint,
oth_sch_b  smallint,
oth_sch_g  smallint,
anganwadi_b  smallint,
anganwadi_g  smallint
);

create table if not exists udise_sch_facility(
udise_sch_code  bigint primary key not null,
ac_year  text,
bld_status  smallint,
bld_blk_tot  smallint,
bld_blk  smallint,
bld_blk_ppu  smallint,
bld_blk_kuc  smallint,
bld_blk_tnt  smallint,
bld_blk_dptd  smallint,
bld_blk_undcons  smallint,
bndrywall_type  smallint,
clsrms_inst  smallint,
clsrms_und_cons  smallint,
clsrms_dptd  smallint,
clsrms_pre_pri  smallint,
clsrms_pri  smallint,
clsrms_upr  smallint,
clsrms_sec  smallint,
clsrms_hsec  smallint,
othrooms  smallint,
clsrms_gd  smallint,
clsrms_gd_ppu  smallint,
clsrms_gd_kuc  smallint,
clsrms_gd_tnt  smallint,
clsrms_min  smallint,
clsrms_min_ppu  smallint,
clsrms_min_kun  smallint,
clsrms_min_tnt  smallint,
clsrms_maj  smallint,
clsrms_maj_ppu  smallint,
clsrms_maj_kuc  smallint,
clsrms_maj_tnt  smallint,
land_avl_yn  smallint,
hm_room_yn  smallint,
toilet_yn  smallint,
toiletb  smallint,
toiletb_fun  smallint,
toiletg  smallint,
toiletg_fun  smallint,
toiletb_cwsn  smallint,
toiletb_cwsn_fun  smallint,
toiletg_cwsn  smallint,
toiletg_cwsn_fun  smallint,
urinalsb  smallint,
urinalsb_fun  smallint,
urinalsg  smallint,
urinalsg_fun  smallint,
toiletb_fun_water  smallint,
toiletg_fun_water  smallint,
handwash_yn  smallint,
incinerator_yn  smallint,
drink_water_yn  smallint,
hand_pump_tot  smallint,
hand_pump_fun  smallint,
well_prot_tot  smallint,
well_prot_fun  smallint,
well_unprot_tot  smallint,
well_unprot_fun  smallint,
tap_tot  smallint,
tap_fun  smallint,
pack_water  smallint,
pack_water_fun  smallint,
othsrc_tot  smallint,
othsrc_fun  smallint,
othsrc_name  varchar(100),
water_purifier_yn  smallint,
water_tested_yn  smallint,
rain_harvest_yn  smallint,
handwash_meal_yn  smallint,
handwash_meal_tot  smallint,
electricity_yn  smallint,
solarpanel_yn  smallint,
library_yn  smallint,
lib_books  integer,
lib_books_ncert  integer,
bookbank_yn  smallint,
bkbnk_books  integer,
bkbnk_books_ncert  integer,
readcorner_yn  smallint,
readcorner_books  integer,
librarian_yn  smallint,
newspaper_yn  smallint,
playground_yn  smallint,
playground_alt_yn  smallint,
medchk_yn  smallint,
medchk_tot  smallint,
dewormtab_yn  smallint,
irontab_yn  smallint,
ramps_yn  smallint,
handrails_yn  smallint,
spl_educator_yn  smallint,
kitchen_garden_yn  smallint,
dstbn_clsrms_yn  smallint,
dstbn_toilet_yn  smallint,
dstbn_kitchen_yn  smallint,
stus_hv_furnt  smallint,
ahmvp_room_yn  smallint,
comroom_g_yn  smallint,
staff_room_yn  smallint,
craft_room_yn  smallint,
staff_qtr_yn  smallint,
integrated_lab_yn  smallint,
library_room_yn  smallint,
comp_room_yn  smallint,
tinkering_lab_yn  smallint,
phy_lab_yn  smallint,
phy_lab_cond  smallint,
chem_lab_yn  smallint,
chem_lab_cond  smallint,
boi_lab_yn  smallint,
bio_lab_cond  smallint,
math_lab_yn  smallint,
math_lab_cond  smallint,
lang_lab_yn  smallint,
lang_lab_cond  smallint,
geo_lab_yn  smallint,
geo_lab_cond  smallint,
homesc_lab_yn  smallint,
home_sc_lab_cond  smallint,
psycho_lab_yn  smallint,
psycho_lab_cond  smallint,
audio_system_yn  smallint,
sciencekit_yn  smallint,
mathkit_yn  smallint,
biometric_dev_yn  smallint,
comp_lab_type  smallint,
ict_impl_year  smallint,
ictlab_fun_yn  smallint,
ict_model_impl  smallint,
ict_instr_type  smallint,
laptop_yn  smallint,
laptop_tot  smallint,
laptop_fun  smallint,
tablets_yn  smallint,
tablets_tot  smallint,
tablets_fun  smallint,
desktop_yn  smallint,
desktop_tot  smallint,
desktop_fun  smallint,
teachdev_yn  smallint,
teachdev_tot  smallint,
teachdev_fun  smallint,
digi_board_yn  smallint,
digi_board_tot  smallint,
digi_board_fun  smallint,
server_yn  smallint,
server_tot  smallint,
server_fun  smallint,
projector_yn  smallint,
projector_tot  smallint,
projector_fun  smallint,
led_yn  smallint,
led_tot  smallint,
led_fun  smallint,
printer_yn  smallint,
printer_tot  smallint,
printer_fun  smallint,
scanner_yn  smallint,
scanner_tot  smallint,
scanner_fun  smallint,
webcam_yn  smallint,
webcam_tot  smallint,
webcam_fun  smallint,
generator_yn  smallint,
generator_tot  smallint,
generator_fun  smallint,
internet_yn  smallint,
dth_yn  smallint,
digi_res_yn  smallint,
tech_soln_yn  smallint,
ict_tools_yn  smallint,
ict_teach_hrs  smallint
);

create table if not exists udise_sch_profile(
udise_sch_code  bigint primary key not null,
ac_year  text,
address  varchar(100),
c0_sec  smallint,
c1_sec  smallint,
c2_sec  smallint,
c3_sec  smallint,
c4_sec  smallint,
c5_sec  smallint,
c6_sec  smallint,
c7_sec  smallint,
c8_sec  smallint,
c9_sec  smallint,
c10_sec  smallint,
c11_sec  smallint,
c12_sec  smallint,
estd_year   varchar(10),
recog_year_pri   varchar(10),
recog_year_upr   varchar(10),
recog_year_sec   varchar(10),
recog_year_hsec   varchar(10),
upgrd_year_ele   varchar(10),
upgrd_year_sec   varchar(10),
upgrd_year_hsec   varchar(10),
cwsn_sch_yn  smallint,
shift_sch_yn  smallint,
resi_sch_yn  smallint,
resi_sch_type  int,
boarding_pri_yn  smallint,
boarding_pri_b  smallint,
boarding_pri_g  smallint,
boarding_upr_yn  smallint,
boarding_upr_b  smallint,
boarding_upr_g  smallint,
boarding_sec_yn  smallint,
boarding_sec_b  smallint,
boarding_sec_g  smallint,
boarding_hsec_yn  smallint,
boarding_hsec_b  smallint,
boarding_hsec_g  smallint,
minority_yn  smallint,
minority_type  smallint,
mtongue_pri  smallint,
medinstr1  smallint,
medinstr2  smallint,
medinstr3  smallint,
medinstr4  smallint,
medinstr_oth  varchar(100),
lang1  smallint,
lang2  smallint,
lang3  smallint,
prevoc_yn  smallint,
eduvoc_yn  smallint,
board_sec  smallint,
board_sec_no  varchar(100),
board_sec_oth  varchar(100),
board_hsec  smallint,
board_hsec_no  varchar(100),
board_hsec_oth  varchar(100),
distance_pri  double precision,
distance_upr  double precision,
distance_sec  double precision,
distance_hsec  double precision,
approach_road_yn  smallint,
ppsec_yn  smallint,
ppstu_lkg_b  smallint,
ppstu_lkg_g  smallint,
ppstu_ukg_b  smallint,
ppstu_ukg_g  smallint,
anganwadi_yn  smallint,
anganwadi_code  varchar(100),
anganwadi_stu_b  smallint,
anganwadi_stu_g  smallint,
anganwadi_tch_trained  smallint,
workdays_pre_pri  smallint,
workdays_pri  smallint,
workdays_upr  smallint,
workdays_sec  smallint,
workdays_hsec  smallint,
sch_hrs_stu_pre_pri  double precision,
sch_hrs_stu_pri  double precision,
sch_hrs_stu_upr  double precision,
sch_hrs_stu_sec  double precision,
sch_hrs_stu_hsec  double precision,
sch_hrs_tch_pre_pri  double precision,
sch_hrs_tch_pri  double precision,
sch_hrs_tch_upr  double precision,
sch_hrs_tch_sec  double precision,
sch_hrs_tch_hsec  double precision,
cce_yn_pri  smallint,
cce_yn_upr  smallint,
cce_yn_sec  smallint,
cce_yn_hsec  smallint,
pcr_maintained_yn  smallint,
pcr_shared_yn  smallint,
rte_25p_applied  smallint,
rte_25p_enrolled  smallint,
rte_pvt_c0_b  smallint,
rte_pvt_c0_g  smallint,
rte_pvt_c1_b  smallint,
rte_pvt_c1_g  smallint,
rte_pvt_c2_b  smallint,
rte_pvt_c2_g  smallint,
rte_pvt_c3_b  smallint,
rte_pvt_c3_g  smallint,
rte_pvt_c4_b  smallint,
rte_pvt_c4_g  smallint,
rte_pvt_c5_b  smallint,
rte_pvt_c5_g  smallint,
rte_pvt_c6_b  smallint,
rte_pvt_c6_g  smallint,
rte_pvt_c7_b  smallint,
rte_pvt_c7_g  smallint,
rte_pvt_c8_b  smallint,
rte_pvt_c8_g  smallint,
rte_bld_c0_b  smallint,
rte_bld_c0_g  smallint,
rte_bld_c1_b  smallint,
rte_bld_c1_g  smallint,
rte_bld_c2_b  smallint,
rte_bld_c2_g  smallint,
rte_bld_c3_b  smallint,
rte_bld_c3_g  smallint,
rte_bld_c4_b  smallint,
rte_bld_c4_g  smallint,
rte_bld_c5_b  smallint,
rte_bld_c5_g  smallint,
rte_bld_c6_b  smallint,
rte_bld_c6_g  smallint,
rte_bld_c7_b  smallint,
rte_bld_c7_g  smallint,
rte_bld_c8_b  smallint,
rte_bld_c8_g  smallint,
rte_ews_c9_b  smallint,
rte_ews_c9_g  smallint,
rte_ews_c10_b  smallint,
rte_ews_c10_g  smallint,
rte_ews_c11_b  smallint,
rte_ews_c11_g  smallint,
rte_ews_c12_b  smallint,
rte_ews_c12_g  smallint,
spltrg_yn  smallint,
spltrg_cy_prov_b  smallint,
spltrg_cy_prov_g  smallint,
spltrg_py_enrol_b  smallint,
spltrg_py_enrol_g  smallint,
spltrg_py_prov_b  smallint,
spltrg_py_prov_g  smallint,
spltrg_by  smallint,
spltrg_place  smallint,
spltrg_type  smallint,
remedial_tch_enrol  smallint,
session_start_mon  smallint,
txtbk_recd_yn  smallint,
txtbk_recd_mon  smallint,
supp_mat_recd_yn  smallint,
txtbk_pre_pri_yn  smallint,
txtbk_pri_yn  smallint,
txtbk_upr_yn  smallint,
txtbk_sec_yn  smallint,
txtbk_hsec_yn  smallint,
tle_pre_pri_yn  smallint,
tle_pri_yn  smallint,
tle_upr_yn  smallint,
tle_sec_yn  smallint,
tle_hsec_yn  smallint,
playmat_pre_pri_yn  smallint,
playmat_pri_yn  smallint,
playmat_upr_yn  smallint,
playmat_sec_yn  smallint,
playmat_hsec_yn  smallint,
no_inspect  smallint,
no_visit_crc  smallint,
no_visit_brc  smallint,
no_visit_dis  smallint,
smc_yn  smallint,
smc_mem_m  smallint,
smc_mem_f  smallint,
smc_par_m  smallint,
smc_par_f  smallint,
smc_par_sc  smallint,
smc_par_st  smallint,
smc_par_ews  smallint,
smc_par_min  smallint,
smc_lgb_m  smallint,
smc_lgb_f  smallint,
smc_tch_m  smallint,
smc_tch_f  smallint,
smc_trained_m  smallint,
smc_trained_f  smallint,
smc_meetings  smallint,
smc_sdp_yn  smallint,
smc_bnkac_yn  smallint,
smdc_smc_same_yn  smallint,
smdc_yn  smallint,
smdc_mem_m  smallint,
smdc_mem_f  smallint,
smdc_par_m  smallint,
smdc_par_f  smallint,
smdc_par_ews_m  smallint,
smdc_par_ews_f  smallint,
smdc_lgb_m  smallint,
smdc_lgb_f  smallint,
smdc_ebmc_m  smallint,
smdc_ebmc_f  smallint,
smdc_women_f  smallint,
smdc_scst_m  smallint,
smdc_scst_f  smallint,
smdc_deo_m  smallint,
smdc_deo_f  smallint,
smdc_audit_m  smallint,
smdc_audit_f  smallint,
smdc_subexp_m  smallint,
smdc_subexp_f  smallint,
smdc_tch_m  smallint,
smdc_tch_f  smallint,
smdc_vp_m  smallint,
smdc_vp_f  smallint,
smdc_prin_m  smallint,
smdc_prin_f  smallint,
smdc_cp_m  smallint,
smdc_cp_f  smallint,
smdc_trained_m  smallint,
smdc_trained_f  smallint,
smdc_meetings  smallint,
smdc_sdp_yn  smallint,
smdc_bnkac_yn  smallint,
smdc_sbc_yn  smallint,
smdc_acadcom_yn  smallint,
smdc_pta_yn  smallint,
smdc_pta_meeting  smallint
);

alter table udise_sch_profile drop column if exists smc_bnk_name ;
alter table udise_sch_profile drop column if exists smc_bnk_br ;
alter table udise_sch_profile drop column if exists smc_bnkac_no ;
alter table udise_sch_profile drop column if exists smc_bnkac_ifsc ;
alter table udise_sch_profile drop column if exists smc_bnkac_name ;
alter table udise_sch_profile drop column if exists smdc_bnk_name ;
alter table udise_sch_profile drop column if exists smdc_bnk_br ;
alter table udise_sch_profile drop column if exists smdc_bnkac_no ;
alter table udise_sch_profile drop column if exists smdc_bnkac_ifsc ;
alter table udise_sch_profile drop column if exists smdc_bnkac_name ;



create table if not exists udise_sch_staff_posn(
udise_sch_code  bigint primary key not null,
ac_year  text,
tch_regular  smallint,
tch_contract  smallint,
tch_part_time  smallint,
nontch_accnt  smallint,
nontch_lib_asst  smallint,
nontch_lab_asst  smallint,
nontch_udc  smallint,
nontch_ldc  smallint,
nontch_peon  smallint,
nontch_watchman  smallint,
tch_hav_adhr  smallint
);

create table if not exists udise_tch_profile(
udise_sch_code  bigint primary key not null,
tch_code  varchar(100),
name  varchar(100),
gender  smallint,
dob  date,
social_cat  smallint,
tch_type  smallint,
nature_of_appt  smallint,
doj_service  date,
qual_acad  smallint,
qual_prof  smallint,
class_taught  smallint,
appt_sub  smallint,
sub_taught1  smallint,
sub_taught2  smallint,
trn_brc  smallint,
trn_crc  smallint,
trn_diet  smallint,
trn_other  smallint,
trng_rcvd  smallint,
trng_needed  smallint,
nontch_days  smallint,
math_upto  smallint,
science_upto  smallint,
english_upto  smallint,
lang_study_upto  smallint,
soc_study_upto  smallint,
yoj_pres_sch  varchar(100),
disability_type  smallint,
trained_cwsn  smallint,
trained_comp  smallint
);

alter table udise_tch_profile drop constraint if exists udise_tch_profile_pkey;
alter table udise_tch_profile add primary key(udise_sch_code,tch_code);

alter table udise_tch_profile drop column if exists name;
alter table udise_tch_profile drop column if exists gender;
alter table udise_tch_profile drop column if exists dob;  

/*alter table udise_tch_profile drop constraint if exists udise_tch_profile_pkey;
alter table udise_tch_profile add primary key(udise_sch_code,name,dob);
alter table udise_tch_profile alter column tch_code drop not null;*/

create table if not exists udise_sch_exmmarks_c10(
udise_sch_code  bigint not null,
ac_year  text,
item_id  smallint not null,
marks_range_id  smallint not null,
gen_b  smallint,
gen_g  smallint,
obc_b  smallint,
obc_g  smallint,
sc_b  smallint,
sc_g  smallint,
st_b  smallint,
st_g  integer,
primary key(udise_sch_code,item_id,marks_range_id)
);

create table if not exists udise_sch_exmmarks_c12(
udise_sch_code  bigint not null,
ac_year  text,
item_id  smallint not null,
marks_range_id  smallint not null,
gen_b  smallint,
gen_g  smallint,
obc_b  smallint,
obc_g  smallint,
sc_b  smallint,
sc_g  smallint,
st_b  smallint,
st_g  smallint,
primary key(udise_sch_code,item_id,marks_range_id)
);

create table if not exists udise_sch_recp_exp(
udise_sch_code  bigint primary key not null,
ac_year  text,
dev_grt_r  double precision,
dev_grt_e  double precision,
maint_grt_r  double precision,
maint_grt_e  double precision,
tlm_grt_r  double precision,
tlm_grt_e  double precision,
cw_grt_r  double precision,
cw_grt_e  double precision,
anl_grt_r  double precision,
anl_grt_e  double precision,
minrep_grt_r  double precision,
minrep_grt_e  double precision,
labrep_grt_r  double precision,
labrep_grt_e  double precision,
book_grt_r  double precision,
book_grt_e  double precision,
elec_grt_r  double precision,
elec_grt_e  double precision,
oth_grt_r  double precision,
oth_grt_e  double precision,
compo_grt_r  double precision,
compo_grt_e  double precision,
lib_grt_r  double precision,
lib_grt_e  double precision,
sport_grt_r  double precision,
sport_grt_e  double precision,
media_grt_r  double precision,
media_grt_e  double precision,
smc_grt_r  double precision,
smc_grt_e  double precision,
presch_grt_r  double precision,
presch_grt_e  double precision,
ngo_asst_yn  smallint,
ngo_asst_name  varchar(100),
ngo_asst_rcvd  double precision,
psu_asst_yn  smallint,
psu_asst_name  varchar(100),
psu_asst_rcvd  double precision,
comm_asst_yn  smallint,
comm_asst_rcvd  double precision,
comm_asst_name  varchar(100),
oth_asst_yn  smallint,
oth_asst_name  varchar(100),
oth_asst_rcvd  double precision,
ict_reg_yn  smallint,
sport_reg_yn  smallint,
lib_reg_yn  smallint
);

create table if not exists udise_nsqf_basic_info(
udise_sch_code  bigint primary key not null,
ac_year  text,
nsqf_yn  smallint,
voc_course_yn  smallint,
sec1_sub  Integer,
sec1_year  varchar(10),
sec2_sub  Integer,
sec2_year  varchar(10)
);

alter table udise_nsqf_basic_info alter column sec2_year type varchar(10);

alter table udise_nsqf_basic_info alter column sec1_year type varchar(10);


create table if not exists udise_nsqf_enr_caste(
udise_sch_code  bigint not null,
ac_year  text,
sector_no  smallint not null,
item_id  smallint not null,
c9_b  smallint,
c9_g  smallint,
c10_b  smallint,
c10_g  smallint,
c11_b  smallint,
c11_g  smallint,
c12_b  smallint,
c12_g  smallint,
primary key(udise_sch_code,sector_no,item_id)
);

create table if not exists udise_nsqf_enr_sub_sec(
udise_sch_code  bigint not null,
ac_year  text,
sub_sector_id  smallint,
sector_no  smallint not null,
c9_b  smallint,
c9_g  smallint,
c10_b  smallint,
c10_g  smallint,
c11_b  smallint,
c11_g  smallint,
c12_b  smallint,
c12_g  smallint,
primary key(udise_sch_code,sector_no)
);

alter table udise_nsqf_enr_sub_sec drop constraint if exists udise_nsqf_enr_sub_sec_pkey;
alter table udise_nsqf_enr_sub_sec add primary key(udise_sch_code,sector_no,sub_sector_id);

create table if not exists udise_nsqf_exmres_c10(
udise_sch_code  bigint not null,
ac_year  text,
sector_no  smallint not null,
marks_range_id  smallint not null,
gen_b  smallint,
gen_g  smallint,
obc_b  smallint,
obc_g  smallint,
sc_b  smallint,
sc_g  smallint,
st_b  smallint,
st_g  smallint,
primary key(udise_sch_code,sector_no,marks_range_id)
);

create table if not exists udise_nsqf_exmres_c12(
udise_sch_code  bigint not null,
ac_year  text,
sector_no  smallint not null,
marks_range_id  smallint not null,
gen_b  smallint,
gen_g  smallint,
obc_b  smallint,
obc_g  smallint,
sc_b  smallint,
sc_g  smallint,
st_b  smallint,
st_g  smallint,
primary key(udise_sch_code,sector_no,marks_range_id)
);

create table if not exists udise_nsqf_trng_prov(
udise_sch_code  bigint not null,
ac_year  text,
agency_name  varchar(200),
sector_no  smallint not null,
cert_no  varchar(200),
cert_agency  varchar(200),
primary key(udise_sch_code,sector_no)
);

create table if not exists udise_nsqf_faculty(
udise_sch_code  bigint not null,
ac_year  text,
nsqf_faculty_id bigint ,
faculty_code  varchar(100),
name  varchar(100),
gender  smallint,
dob  date,
soc_cat  smallint,
nature_of_appt  smallint,
qual_acad  smallint,
qual_prof  smallint,
industry_exp  smallint,
training_exp  smallint,
class_taught  smallint,
appt_sec  smallint,
induc_trg_rcvd  smallint,
inserv_trg_rcvd  smallint,
primary key(udise_sch_code,nsqf_faculty_id)
);

alter table udise_nsqf_faculty add column if not exists nsqf_faculty_id bigint;
alter table udise_nsqf_faculty drop constraint if exists udise_nsqf_faculty_pkey;
alter table udise_nsqf_faculty alter column faculty_code drop not null;
alter table udise_nsqf_faculty add primary key(udise_sch_code,nsqf_faculty_id);

create table if not exists udise_sch_pgi_details(
udise_sch_code  bigint primary key not null,
ac_year  text,
tch_adhr_seed  Integer,
stu_atndnc_yn  smallint,
tch_atndnc_yn  smallint,
sch_eval_yn  smallint,
improv_plan_yn  smallint,
sch_pfms_yn  smallint
);


create table if not exists udise_sch_safety(
udise_sch_code  bigint primary key not null,
ac_year  text,
sdmp_plan_yn  smallint,
struct_safaud_yn  smallint,
nonstr_safaud_yn  smallint,
cctv_cam_yn  smallint,
fire_ext_yn  smallint,
nodal_tch_yn  smallint,
safty_trng_yn  smallint,
dismgmt_taug_yn  smallint,
slfdef_grt_yn  smallint,
slfdef_trained  smallint
);

create table if not exists udise_sch_exmres_c8(
udise_sch_code  bigint primary key not null,
academic_year  varchar(10),
gen_app_b  smallint,
gen_app_g  smallint,
obc_app_b  smallint,
obc_app_g  smallint,
sc_app_b  smallint,
sc_app_g  smallint,
st_app_b  smallint,
st_app_g  smallint,
gen_pass_b  smallint,
gen_pass_g  smallint,
obc_pass_b  smallint,
obc_pass_g  smallint,
sc_pass_b  smallint,
sc_pass_g  smallint,
st_pass_b  smallint,
st_pass_g  smallint,
gen_60p_b  smallint,
gen_60p_g  smallint,
obc_60p_b  smallint,
obc_60p_g  smallint,
sc_60p_b  smallint,
sc_60p_g  smallint,
st_60p_b  smallint,
st_60p_g  smallint
);

alter table udise_sch_exmres_c8 alter column academic_year type varchar(10);

/*Udise transaction,aggregation,config */

CREATE TABLE if not exists udise_school_metrics_trans (academic_year text  NULL ,
     udise_school_id bigint  NOT NULL ,
     no_cwsn_students_rec_incentive integer  NULL ,
     no_of_students integer DEFAULT 0 NULL ,
     no_gen_students_rec_incentive integer DEFAULT 0 NULL ,
     no_cat_students_rec_incentive integer DEFAULT 0 NULL ,
     is_students_counselling boolean  NULL ,
     avg_instruct_days numeric DEFAULT 0 NULL ,
     avg_scl_hours_childrens numeric DEFAULT 0 NULL ,
     avg_work_hours_teachers numeric DEFAULT 0 NULL ,
     is_training_oosc boolean  NULL ,
     is_txtbk_pre_pri smallint DEFAULT 0 NULL ,
     is_txtbk_pri smallint DEFAULT 0 NULL ,
     is_txtbk_upr smallint DEFAULT 0 NULL ,
     is_txtbk_sec smallint DEFAULT 0 NULL ,
     is_txtbk_hsec smallint DEFAULT 0 NULL ,
     is_tle_pre_pri smallint DEFAULT 0 NULL ,
     is_tle_pri smallint DEFAULT 0 NULL ,
     is_tle_upr smallint DEFAULT 0 NULL ,
     is_tle_sec smallint DEFAULT 0 NULL ,
     is_tle_hsec smallint DEFAULT 0 NULL ,
     is_playmat_pre_pri smallint DEFAULT 0 NULL ,
     is_playmat_pri smallint DEFAULT 0 NULL ,
     is_playmat_upr smallint DEFAULT 0 NULL ,
     is_playmat_sec smallint DEFAULT 0 NULL ,
     is_playmat_hsec smallint DEFAULT 0 NULL ,
     stu_atndnc_yn boolean  NULL ,
     tch_atndnc_yn boolean  NULL ,
     nodal_tch_yn boolean  NULL ,
     language_room boolean  NULL ,
     geography_room boolean  NULL ,
     science_room boolean  NULL ,
     psychology_room boolean  NULL ,
     total_male_smc_members integer DEFAULT 0 NULL ,
     total_female_smc_members integer DEFAULT 0 NULL ,
     total_male_smc_trained integer DEFAULT 0 NULL ,
     total_female_smc_trained integer DEFAULT 0 NULL ,
     total_meetings_smc integer DEFAULT 0 NULL ,
     is_smdc_school boolean  NULL ,
     cwsn_students integer DEFAULT 0 NULL ,
     repeaters_students integer DEFAULT 0 NULL ,
     no_students_girls integer DEFAULT 0 NULL ,
     no_of_teachers integer DEFAULT 0 NULL ,
     classrooms_good_condition integer DEFAULT 0 NULL ,
     students_pre_primary_boys integer DEFAULT 0 NULL ,
     students_pre_primary_girls integer DEFAULT 0 NULL ,
     no_of_grades integer DEFAULT 0 NULL ,
     anganwadi_boys integer DEFAULT 0 NULL ,
     anganwadi_girls integer DEFAULT 0 NULL ,
     dev_grt_r numeric DEFAULT 0 NULL ,
     dev_grt_e numeric DEFAULT 0 NULL ,
     maint_grt_r numeric DEFAULT 0 NULL ,
     maint_grt_e numeric DEFAULT 0 NULL ,
     tlm_grt_r numeric DEFAULT 0 NULL ,
     tlm_grt_e numeric DEFAULT 0 NULL ,
     cw_grt_r numeric DEFAULT 0 NULL ,
     cw_grt_e numeric DEFAULT 0 NULL ,
     anl_grt_r numeric DEFAULT 0 NULL ,
     anl_grt_e numeric DEFAULT 0 NULL ,
     minrep_grt_r numeric DEFAULT 0 NULL ,
     minrep_grt_e numeric DEFAULT 0 NULL ,
     labrep_grt_r numeric DEFAULT 0 NULL ,
     labrep_grt_e numeric DEFAULT 0 NULL ,
     book_grt_r numeric DEFAULT 0 NULL ,
     book_grt_e numeric DEFAULT 0 NULL ,
     elec_grt_r numeric DEFAULT 0 NULL ,
     elec_grt_e numeric DEFAULT 0 NULL ,
     oth_grt_r numeric DEFAULT 0 NULL ,
     oth_grt_e numeric DEFAULT 0 NULL ,
     compo_grt_r numeric DEFAULT 0 NULL ,
     compo_grt_e numeric DEFAULT 0 NULL ,
     lib_grt_r numeric DEFAULT 0 NULL ,
     lib_grt_e numeric DEFAULT 0 NULL ,
     sport_grt_r numeric DEFAULT 0 NULL ,
     sport_grt_e numeric DEFAULT 0 NULL ,
     media_grt_r numeric DEFAULT 0 NULL ,
     media_grt_e numeric DEFAULT 0 NULL ,
     smc_grt_r numeric DEFAULT 0 NULL ,
     smc_grt_e numeric DEFAULT 0 NULL ,
     presch_grt_r numeric DEFAULT 0 NULL ,
     presch_grt_e numeric DEFAULT 0 NULL ,
     laptop_fun integer DEFAULT 0 NULL ,
     tablets_fun integer DEFAULT 0 NULL ,
     desktop_fun integer DEFAULT 0 NULL ,
     server_fun integer DEFAULT 0 NULL ,
     projector_fun integer DEFAULT 0 NULL ,
     led_fun integer DEFAULT 0 NULL ,
     webcam_fun integer DEFAULT 0 NULL ,
     generator_fun integer DEFAULT 0 NULL ,
     printer_fun integer DEFAULT 0 NULL ,
     scanner_fun integer DEFAULT 0 NULL ,
     medchk_yn boolean  NULL ,
     dewormtab_yn boolean  NULL ,
     irontab_yn boolean  NULL ,
     students_got_placement_class10 integer DEFAULT 0 NULL ,
     students_got_placement_class12 integer DEFAULT 0 NULL ,
     no_students_received_incentives integer DEFAULT 0 NULL ,
     cce_yn_pri smallint DEFAULT 0 NULL ,
     cce_yn_upr smallint DEFAULT 0 NULL ,
     cce_yn_sec smallint DEFAULT 0 NULL ,
     cce_yn_hsec smallint DEFAULT 0 NULL ,
     students_enrolled_rte integer DEFAULT 0 NULL ,
     sdmp_plan_yn boolean  NULL ,
     cctv_cam_yn boolean  NULL ,
     fire_ext_yn boolean  NULL ,
     slfdef_grt_yn boolean  NULL ,
     slfdef_trained integer DEFAULT 0 NULL ,
     no_students_boys integer DEFAULT 0 NULL ,
     no_of_boys_func_toilet integer DEFAULT 0 NULL ,
     no_of_girls_func_toilet integer DEFAULT 0 NULL ,
     no_boys_func_urinals integer DEFAULT 0 NULL ,
     no_girls_func_urinals integer DEFAULT 0 NULL ,
     cwsn_sch_yn boolean  NULL ,
     anganwadi_yn boolean  NULL ,
     voc_course_yn boolean  NULL ,
     nsqf_yn boolean  NULL ,
     no_visit_crc integer DEFAULT 0 NULL ,
     no_visit_brc integer DEFAULT 0 NULL ,
     no_visit_dis integer DEFAULT 0 NULL ,
     students_passed_class10 integer DEFAULT 0 NULL ,
     students_applied_class10 integer DEFAULT 0 NULL ,
     students_passed_class12 integer DEFAULT 0 NULL ,
     students_applied_class12 integer DEFAULT 0 NULL ,
     phy_lab_yn boolean  NULL ,
     chem_lab_yn boolean  NULL ,
     bio_lab_yn boolean  NULL ,
     math_lab_yn boolean  NULL ,
     tch_avg_years_service integer DEFAULT 0 NULL ,
     trn_brc integer DEFAULT 0 NULL ,
     trn_crc integer DEFAULT 0 NULL ,
     trn_diet integer DEFAULT 0 NULL ,
     trn_other integer DEFAULT 0 NULL ,
     trained_cwsn integer DEFAULT 0 NULL ,
     trained_comp integer DEFAULT 0 NULL ,
     students_applied_class8 integer  NULL ,
     students_passed_class8 integer  NULL ,
     students_scored_above60_c8 integer  NULL ,
     no_of_newadm_kids integer  NULL ,
     no_of_newadm_boy_kids integer  NULL ,
     no_of_newadm_girl_kids integer  NULL ,
     students_opt_placement_class12 integer  NULL ,
     students_opt_voc_fields_class12 integer  NULL ,
     students_opt_non_voc_fields_class12 integer  NULL ,
     no_of_students_self_employed_class12 integer  NULL ,
     total_nsqf_class_conducted integer  NULL ,
     students_applied_class5 integer  NULL ,
     students_passed_class5 integer  NULL ,
     students_scored_above60_c5 integer  NULL ,
     students_opt_placement_class10 integer  NULL ,
     students_opt_voc_fields_class10 integer  NULL ,
     students_opt_non_voc_fields_class10 integer  NULL ,
     no_of_students_self_employed_class10 integer  NULL ,
     total_blocks integer  NULL ,
     total_blocks_pucca integer  NULL ,
     total_classrooms integer  NULL ,
     total_classrooms_instructional integer  NULL ,
     land_available_expansion smallint  NULL ,
     have_toilet smallint  NULL ,
     no_of_boys_toilet integer  NULL ,
     no_of_girls_toilet integer  NULL ,
     no_of_boys_cwsn_toilet integer  NULL ,
     no_of_boys_cwsn_func_toilet integer  NULL ,
     no_of_girls_cwsn_toilet integer  NULL ,
     no_of_girls_cwsn_func_toilet integer  NULL ,
     no_of_boys_urinals integer  NULL ,
     no_of_girls_urinals integer  NULL ,
     handwash_available smallint  NULL ,
     incinerator_girls_toilet smallint  NULL ,
     drinking_water smallint  NULL ,
     no_of_hand_pumps integer  NULL ,
     no_of_func_hand_pumps integer  NULL ,
     no_of_well integer  NULL ,
     no_of_func_well integer  NULL ,
     no_of_tap_water integer  NULL ,
     no_of_func_tap_water integer  NULL ,
     no_of_bottle_water integer  NULL ,
     no_of_func_bottle_water integer  NULL ,
     water_purifier smallint  NULL ,
     electricity_available smallint  NULL ,
     solar_panel_available smallint  NULL ,
     library_available smallint  NULL ,
     no_of_library_books integer  NULL ,
     playground smallint  NULL ,
     playground_alt smallint  NULL ,
     ramps smallint  NULL ,
     hand_rail smallint  NULL ,
     no_of_students_hv_furniture integer  NULL ,
     integrated_science_lab smallint  NULL ,
     library_room smallint  NULL ,
     computer_lab smallint  NULL ,
     tinkering_lab smallint  NULL ,
     science_kit smallint  NULL ,
     maths_kit smallint  NULL ,
     laptop_available smallint  NULL ,
     no_of_laptop integer  NULL ,
     tablets_available smallint  NULL ,
     no_of_tablets integer  NULL ,
     desktop_available smallint  NULL ,
     no_of_desktops integer  NULL ,
     integrated_pc_tld smallint  NULL ,
     no_of_integrated_pc_tld integer  NULL ,
     no_of_func_integrated_pc_tld integer  NULL ,
     digital_boards_with_cms smallint  NULL ,
     no_of_digital_boards_with_cms integer  NULL ,
     no_of_func_digital_boards_with_cms integer  NULL ,
     server_available smallint  NULL ,
     no_of_servers integer  NULL ,
     projectors_available smallint  NULL ,
     no_of_projectors integer  NULL ,
     led_available smallint  NULL ,
     no_of_led integer  NULL ,
     printer_available smallint  NULL ,
     no_of_printers integer  NULL ,
     scanner_available smallint  NULL ,
     no_of_scanners integer  NULL ,
     web_cam_available smallint  NULL ,
     no_of_web_cams integer  NULL ,
     generator_available smallint  NULL ,
     no_of_generators integer  NULL ,
     internet_available smallint  NULL ,
     dth_available smallint  NULL ,
     digital_resources smallint  NULL ,
     tech_based_sol_cwsn smallint  NULL ,
     ict_for_teaching smallint  NULL ,
     no_of_fresh_students_enrolled integer  NULL ,
     nontch_days integer  NULL ,
     no_of_sections_class0 integer  NULL ,
     no_of_sections_class1 integer  NULL ,
     no_of_sections_class2 integer  NULL ,
     no_of_sections_class3 integer  NULL ,
     no_of_sections_class4 integer  NULL ,
     no_of_sections_class5 integer  NULL ,
     no_of_sections_class6 integer  NULL ,
     no_of_sections_class7 integer  NULL ,
     no_of_sections_class8 integer  NULL ,
     no_of_sections_class9 integer  NULL ,
     no_of_sections_class10 integer  NULL ,
     no_of_sections_class11 integer  NULL ,
     no_of_sections_class12 integer  NULL ,
     school_established_age integer  NULL ,
     shift_sch_yn smallint  NULL ,
     resi_sch_yn smallint  NULL ,
     boarding_pri_yn smallint  NULL ,
     boarding_pri_b smallint  NULL ,
     boarding_pri_g smallint  NULL ,
     boarding_upr_yn smallint  NULL ,
     boarding_upr_b smallint  NULL ,
     boarding_upr_g smallint  NULL ,
     boarding_sec_yn smallint  NULL ,
     boarding_sec_b smallint  NULL ,
     boarding_sec_g smallint  NULL ,
     boarding_hsec_yn smallint  NULL ,
     boarding_hsec_b smallint  NULL ,
     boarding_hsec_g smallint  NULL ,
     minority_yn smallint  NULL ,
     mtongue_pri smallint  NULL ,
     prevoc_yn smallint  NULL ,
     anganwadi_tch_trained smallint  NULL ,
     no_of_hsec_boys_rte integer  NULL ,
     no_of_hsec_girls_rte integer  NULL ,
     no_of_hsec_boys_rte_facility integer  NULL ,
     no_of_hsec_girls_rte_facility integer  NULL ,
     no_of_ews_hs_boys_rte_enr integer  NULL ,
     no_of_ews_hs_girls_rte_enr integer  NULL ,
     spltrg_cy_prov_b integer  NULL ,
     spltrg_cy_prov_g integer  NULL ,
     spltrg_py_enrol_b integer  NULL ,
     spltrg_py_enrol_g integer  NULL ,
     spltrg_py_prov_b integer  NULL ,
     spltrg_py_prov_g integer  NULL ,
     remedial_tch_enrol integer  NULL ,
     no_inspect integer  NULL ,
     smc_par_m integer  NULL ,
     smc_par_f integer  NULL ,
     smc_par_sc integer  NULL ,
     smc_par_st integer  NULL ,
     smc_par_ews integer  NULL ,
     smc_par_min integer  NULL ,
     smc_lgb_m integer  NULL ,
     smc_lgb_f integer  NULL ,
     smc_tch_m integer  NULL ,
     smc_tch_f integer  NULL ,
     smdc_mem_m integer  NULL ,
     smdc_mem_f integer  NULL ,
     smdc_par_m integer  NULL ,
     smdc_par_f integer  NULL ,
     smdc_par_ews_m integer  NULL ,
     smdc_par_ews_f integer  NULL ,
     smdc_lgb_m integer  NULL ,
     smdc_lgb_f integer  NULL ,
     smdc_ebmc_m integer  NULL ,
     smdc_ebmc_f integer  NULL ,
     smdc_women_f integer  NULL ,
     smdc_scst_m integer  NULL ,
     smdc_scst_f integer  NULL ,
     smdc_deo_m integer  NULL ,
     smdc_deo_f integer  NULL ,
     smdc_audit_m integer  NULL ,
     smdc_audit_f integer  NULL ,
     smdc_subexp_m integer  NULL ,
     smdc_subexp_f integer  NULL ,
     smdc_tch_m integer  NULL ,
     smdc_tch_f integer  NULL ,
     smdc_trained_m integer  NULL ,
     smdc_trained_f integer  NULL ,
     smdc_meetings integer  NULL ,
     smdc_sdp_yn integer  NULL ,
     smdc_pta_meeting integer  NULL ,
     tch_regular integer  NULL ,
     tch_contract integer  NULL ,
     tch_part_time integer  NULL ,
     nontch_accnt integer  NULL ,
     nontch_lib_asst integer  NULL ,
     nontch_lab_asst integer  NULL ,
     nontch_udc integer  NULL ,
     nontch_ldc integer  NULL ,
     nontch_peon integer  NULL ,
     nontch_watchman integer  NULL ,
     nsqf_tch_industry_exp integer  NULL ,
     nsqf_tch_training_exp integer  NULL ,
     sch_eval_yn smallint  NULL ,
     improv_plan_yn smallint  NULL ,
     sch_pfms_yn smallint  NULL ,
     struct_safaud_yn smallint  NULL ,
     nonstr_safaud_yn smallint  NULL ,
     safty_trng_yn smallint  NULL ,
     dismgmt_taug_yn smallint  NULL ,
     ngo_asst_yn smallint  NULL ,
     psu_asst_yn smallint  NULL ,
     comm_asst_yn smallint  NULL ,
     oth_asst_yn smallint  NULL ,
     ict_reg_yn smallint  NULL ,
     sport_reg_yn smallint  NULL ,
     lib_reg_yn smallint  NULL ,
     primary key(udise_school_id),
     created_on timestamp without time zone  NULL ,
     updated_on timestamp without time zone  NULL); 

create table if not exists udise_metrics_range(
metric_id serial,
metric_name text,
range numeric[],
direction text,
created_on timestamp,
updated_on timestamp,
primary key(metric_name)
);

create table if not exists udise_config(
id integer,
description text,
column_name text,
type text,
indice_id integer,
status boolean,
score numeric,
trans_columns text,
direction text,
metric_config text default 'static',
created_on timestamp,
updated_on timestamp,
primary key(id)
);

/*udise_school_metrics_trans*/

alter table udise_school_metrics_trans add COLUMN if not exists     no_cwsn_students_rec_incentive integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_students integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_gen_students_rec_incentive integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_cat_students_rec_incentive integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_students_counselling boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     avg_instruct_days numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     avg_scl_hours_childrens numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     avg_work_hours_teachers numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_training_oosc boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_txtbk_pre_pri smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_txtbk_pri smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_txtbk_upr smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_txtbk_sec smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_txtbk_hsec smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_tle_pre_pri smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_tle_pri smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_tle_upr smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_tle_sec smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_tle_hsec smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_playmat_pre_pri smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_playmat_pri smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_playmat_upr smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_playmat_sec smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_playmat_hsec smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     stu_atndnc_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tch_atndnc_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nodal_tch_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     language_room boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     geography_room boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     science_room boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     psychology_room boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_male_smc_members integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_female_smc_members integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_male_smc_trained integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_female_smc_trained integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_meetings_smc integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     is_smdc_school boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     cwsn_students integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     repeaters_students integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_students_girls integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_teachers integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     classrooms_good_condition integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_pre_primary_boys integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_pre_primary_girls integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_grades integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     anganwadi_boys integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     anganwadi_girls integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     dev_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     dev_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     maint_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     maint_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tlm_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tlm_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     cw_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     cw_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     anl_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     anl_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     minrep_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     minrep_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     labrep_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     labrep_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     book_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     book_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     elec_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     elec_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     oth_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     oth_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     compo_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     compo_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     lib_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     lib_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     sport_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     sport_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     media_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     media_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     presch_grt_r numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     presch_grt_e numeric DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     laptop_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tablets_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     desktop_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     server_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     projector_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     led_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     webcam_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     generator_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     printer_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     scanner_fun integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     medchk_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     dewormtab_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     irontab_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_got_placement_class10 integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_got_placement_class12 integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_students_received_incentives integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     cce_yn_pri smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     cce_yn_upr smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     cce_yn_sec smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     cce_yn_hsec smallint DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_enrolled_rte integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     sdmp_plan_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     cctv_cam_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     fire_ext_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     slfdef_grt_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     slfdef_trained integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_students_boys integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_boys_func_toilet integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_girls_func_toilet integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_boys_func_urinals integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_girls_func_urinals integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     cwsn_sch_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     anganwadi_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     voc_course_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nsqf_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_visit_crc integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_visit_brc integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_visit_dis integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_passed_class10 integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_applied_class10 integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_passed_class12 integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_applied_class12 integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     phy_lab_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     chem_lab_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     bio_lab_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     math_lab_yn boolean  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tch_avg_years_service integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     trn_brc integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     trn_crc integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     trn_diet integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     trn_other integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     trained_cwsn integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     trained_comp integer DEFAULT 0 NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_applied_class8 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_passed_class8 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_scored_above60_c8 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_newadm_kids integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_newadm_boy_kids integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_newadm_girl_kids integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_opt_placement_class12 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_opt_voc_fields_class12 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_opt_non_voc_fields_class12 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_students_self_employed_class12 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_nsqf_class_conducted integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_applied_class5 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_passed_class5 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_scored_above60_c5 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_opt_placement_class10 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_opt_voc_fields_class10 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     students_opt_non_voc_fields_class10 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_students_self_employed_class10 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_blocks integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_blocks_pucca integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_classrooms integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     total_classrooms_instructional integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     land_available_expansion smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     have_toilet smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_boys_toilet integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_girls_toilet integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_boys_cwsn_toilet integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_boys_cwsn_func_toilet integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_girls_cwsn_toilet integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_girls_cwsn_func_toilet integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_boys_urinals integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_girls_urinals integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     handwash_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     incinerator_girls_toilet smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     drinking_water smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_hand_pumps integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_func_hand_pumps integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_well integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_func_well integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_tap_water integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_func_tap_water integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_bottle_water integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_func_bottle_water integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     water_purifier smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     electricity_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     solar_panel_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     library_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_library_books integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     playground smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     playground_alt smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     ramps smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     hand_rail smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_students_hv_furniture integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     integrated_science_lab smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     library_room smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     computer_lab smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tinkering_lab smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     science_kit smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     maths_kit smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     laptop_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_laptop integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tablets_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_tablets integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     desktop_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_desktops integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     integrated_pc_tld smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_integrated_pc_tld integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_func_integrated_pc_tld integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     digital_boards_with_cms smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_digital_boards_with_cms integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_func_digital_boards_with_cms integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     server_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_servers integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     projectors_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_projectors integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     led_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_led integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     printer_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_printers integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     scanner_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_scanners integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     web_cam_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_web_cams integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     generator_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_generators integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     internet_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     dth_available smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     digital_resources smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tech_based_sol_cwsn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     ict_for_teaching smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_fresh_students_enrolled integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nontch_days integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class0 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class1 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class2 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class3 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class4 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class5 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class6 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class7 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class8 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class9 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class10 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class11 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_sections_class12 integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     school_established_age integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     shift_sch_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     resi_sch_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_pri_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_pri_b smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_pri_g smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_upr_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_upr_b smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_upr_g smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_sec_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_sec_b smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_sec_g smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_hsec_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_hsec_b smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     boarding_hsec_g smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     minority_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     mtongue_pri smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     prevoc_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     anganwadi_tch_trained smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_hsec_boys_rte integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_hsec_girls_rte integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_hsec_boys_rte_facility integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_hsec_girls_rte_facility integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_ews_hs_boys_rte_enr integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_of_ews_hs_girls_rte_enr integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     spltrg_cy_prov_b integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     spltrg_cy_prov_g integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     spltrg_py_enrol_b integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     spltrg_py_enrol_g integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     spltrg_py_prov_b integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     spltrg_py_prov_g integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     remedial_tch_enrol integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     no_inspect integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_par_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_par_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_par_sc integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_par_st integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_par_ews integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_par_min integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_lgb_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_lgb_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_tch_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smc_tch_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_mem_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_mem_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_par_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_par_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_par_ews_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_par_ews_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_lgb_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_lgb_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_ebmc_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_ebmc_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_women_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_scst_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_scst_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_deo_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_deo_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_audit_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_audit_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_subexp_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_subexp_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_tch_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_tch_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_trained_m integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_trained_f integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_meetings integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_sdp_yn integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     smdc_pta_meeting integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tch_regular integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tch_contract integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     tch_part_time integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nontch_accnt integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nontch_lib_asst integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nontch_lab_asst integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nontch_udc integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nontch_ldc integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nontch_peon integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nontch_watchman integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nsqf_tch_industry_exp integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nsqf_tch_training_exp integer  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     sch_eval_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     improv_plan_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     sch_pfms_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     struct_safaud_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     nonstr_safaud_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     safty_trng_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     dismgmt_taug_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     ngo_asst_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     psu_asst_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     comm_asst_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     oth_asst_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     ict_reg_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     sport_reg_yn smallint  NULL ;
alter table udise_school_metrics_trans add COLUMN if not exists     lib_reg_yn smallint  NULL ;

/*alter udise_config*/
alter table udise_config add COLUMN if not exists trans_columns text;
alter table udise_config add COLUMN if not exists direction text;
alter table udise_config add COLUMN if not exists metric_config text;

/*log summary*/
alter table log_summary add COLUMN if not exists udise_sch_code int;
alter table log_summary add COLUMN if not exists sector_no int;
alter table log_summary add COLUMN if not exists item_id int;
alter table log_summary add COLUMN if not exists class_type_id int;
alter table log_summary add COLUMN if not exists stream_id int;
alter table log_summary add COLUMN if not exists grade_pri_upr int;
alter table log_summary add COLUMN if not exists incentive_type int;
alter table log_summary add COLUMN if not exists caste_id int;
alter table log_summary add COLUMN if not exists disability_type int;
alter table log_summary add COLUMN if not exists medinstr_seq int;
alter table log_summary add COLUMN if not exists age_id int;
alter table log_summary add COLUMN if not exists item_group int;
alter table log_summary add COLUMN if not exists tch_code int;
alter table log_summary add COLUMN if not exists marks_range_id int;
alter table log_summary add COLUMN if not exists nsqf_faculty_id int;

/*udise null table*/

create table if not exists udise_null_col(
filename varchar(200),
ff_uuid varchar(200),
count_null_udise_sch_code int,
count_null_item_id int,
count_null_stream_id int,
count_null_sector_no int,
count_null_class_type_id int,
count_null_grade_pri_upr int,
count_null_incentive_type int,
count_null_caste_id int,
count_null_disability_type int,
count_null_medinstr_seq int,
count_null_age_id int,
count_null_item_group int,
count_null_tch_code int,
count_null_marks_range_id int,
count_null_nsqf_faculty_id int
);

/*udise duplicate check tables*/

/*udise_dup_tables*/

create table if not exists udise_nsqf_plcmnt_c12_dup( udise_sch_code bigint , ac_year text, sector_no smallint , item_id smallint, opt_plcmnt_b smallint, opt_plcmnt_g smallint, placed_b smallint, placed_g smallint, voc_hs_b smallint, voc_hs_g smallint, nonvoc_hs_b smallint, nonvoc_hs_g smallint, self_emp_b smallint, self_emp_g smallint, 
num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_nsqf_plcmnt_c12_dup drop constraint if exists udise_nsqf_plcmnt_c12_dup_key;

create table if not exists udise_nsqf_plcmnt_c10_dup( udise_sch_code bigint , ac_year text, sector_no smallint , item_id smallint, opt_plcmnt_b smallint, opt_plcmnt_g smallint, placed_b smallint, placed_g smallint, voc_hs_b smallint, voc_hs_g smallint, nonvoc_hs_b smallint, nonvoc_hs_g smallint, self_emp_b smallint, self_emp_g smallint, 
num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_nsqf_plcmnt_c10_dup drop constraint if exists udise_nsqf_plcmnt_c10_dup_key;

create table if not exists udise_nsqf_class_cond_dup( udise_sch_code bigint , ac_year text, sector_no smallint , class_type_id smallint , c9 smallint, c10 smallint, c11 smallint, c12 smallint, num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_nsqf_class_cond_dup drop constraint if exists udise_nsqf_class_cond_dup_key;

create table if not exists udise_sch_exmres_c12_dup( udise_sch_code bigint , ac_year text, item_id smallint , stream_id smallint , gen_app_b smallint, gen_app_g smallint, obc_app_b smallint, obc_app_g smallint, sc_app_b smallint, sc_app_g smallint, st_app_b smallint, st_app_g smallint, gen_pass_b smallint, gen_pass_g smallint, obc_pass_b smallint, obc_pass_g smallint, sc_pass_b smallint, sc_pass_g smallint, st_pass_b smallint, st_pass_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_exmres_c12_dup drop constraint if exists udise_sch_exmres_c12_dup_key;

create table if not exists udise_sch_exmres_c10_dup( udise_sch_code bigint , ac_year text, item_id smallint , gen_app_b smallint, gen_app_g smallint, obc_app_b smallint, obc_app_g smallint, sc_app_b smallint, sc_app_g smallint, st_app_b smallint, st_app_g smallint, gen_pass_b smallint, gen_pass_g smallint, obc_pass_b smallint, obc_pass_g smallint, sc_pass_b smallint, sc_pass_g smallint, st_pass_b smallint, st_pass_g smallint, 
num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_sch_exmres_c10_dup drop constraint if exists udise_sch_exmres_c10_dup_key;

create table if not exists udise_sch_exmres_c5_dup( udise_sch_code bigint , ac_year text, gen_app_b smallint, gen_app_g smallint, obc_app_b smallint, obc_app_g smallint, sc_app_b smallint, sc_app_g smallint, st_app_b smallint, st_app_g smallint, gen_pass_b smallint, gen_pass_g smallint, obc_pass_b smallint, obc_pass_g smallint, sc_pass_b smallint, sc_pass_g smallint, st_pass_b smallint, st_pass_g smallint, gen_60p_b smallint, gen_60p_g smallint, obc_60p_b smallint, obc_60p_g smallint, sc_60p_b smallint, sc_60p_g smallint, st_60p_b smallint, st_60p_g smallint ,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_exmres_c5_dup drop constraint if exists udise_sch_exmres_c5_dup_key;

create table if not exists udise_sch_incen_cwsn_dup( udise_sch_code bigint , ac_year text, item_id smallint , tot_pre_pri_b smallint, tot_pre_pri_g smallint, tot_pry_b smallint, tot_pry_g smallint, tot_upr_b smallint, tot_upr_g smallint, tot_sec_b smallint, tot_sec_g smallint, tot_hsec_b smallint, tot_hsec_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_incen_cwsn_dup drop constraint if exists udise_sch_incen_cwsn_dup_key;

create table if not exists udise_sch_incentives_dup( udise_sch_code bigint , ac_year text, grade_pri_upr smallint , incentive_type smallint , gen_b smallint, gen_g smallint, sc_b smallint, sc_g smallint, st_b smallint, st_g smallint, obc_b smallint, obc_g smallint, min_muslim_b smallint, min_muslim_g smallint, min_oth_b smallint, min_oth_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_incentives_dup drop constraint if exists udise_sch_incentives_dup_key;

create table if not exists udise_sch_enr_by_stream_dup( udise_sch_code bigint , ac_year text, stream_id smallint , caste_id smallint , ec11_b smallint, ec11_g smallint, ec12_b smallint, ec12_g smallint, rc11_b smallint, rc11_g smallint, rc12_b smallint, rc12_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp) ;

alter table udise_sch_enr_by_stream_dup drop constraint if exists udise_sch_enr_by_stream_dup_key;

create table if not exists udise_sch_enr_cwsn_dup( udise_sch_code bigint , ac_year text, disability_type smallint , cpp_b smallint, cpp_g smallint, c1_b smallint, c1_g smallint, c2_b smallint, c2_g smallint, c3_b smallint, c3_g smallint, c4_b smallint, c4_g smallint, c5_b smallint, c5_g smallint, c6_b smallint, c6_g smallint, c7_b smallint, c7_g smallint, c8_b smallint, c8_g smallint, c9_b smallint, c9_g smallint, c10_b smallint, c10_g smallint, c11_b smallint, c11_g smallint, c12_b smallint, c12_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_enr_cwsn_dup drop constraint if exists udise_sch_enr_cwsn_dup_key;

create table if not exists udise_sch_enr_medinstr_dup( udise_sch_code bigint , ac_year text, medinstr_seq smallint , c1_b smallint, c1_g smallint, c2_b smallint, c2_g smallint, c3_b smallint, c3_g smallint, c4_b smallint, c4_g smallint, c5_b smallint, c5_g smallint, c6_b smallint, c6_g smallint, c7_b smallint, c7_g smallint, c8_b smallint, c8_g smallint, c9_b smallint, c9_g smallint, c10_b smallint, c10_g smallint, c11_b smallint, c11_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_sch_enr_medinstr_dup drop constraint if exists udise_sch_enr_medinstr_dup_key;

create table if not exists udise_sch_enr_age_dup( udise_sch_code bigint , ac_year text, age_id smallint , c1_b smallint, c1_g smallint, c2_b smallint, c2_g smallint, c3_b smallint, c3_g smallint, c4_b smallint, c4_g smallint, c5_b smallint, c5_g smallint, c6_b smallint, c6_g smallint, c7_b smallint, c7_g smallint, c8_b smallint, c8_g smallint, c9_b smallint, c9_g smallint, c10_b smallint, c10_g smallint, c11_b smallint, c11_g smallint, c12_b smallint, c12_g smallint, primary key(udise_sch_code,age_id) );

alter table udise_sch_enr_age_dup drop constraint if exists udise_sch_enr_age_dup_key;

create table if not exists udise_sch_enr_reptr_dup( udise_sch_code bigint , ac_year text, item_group smallint , item_id smallint , c1_b smallint, c1_g smallint, c2_b smallint, c2_g smallint, c3_b smallint, c3_g smallint, c4_b smallint, c4_g smallint, c5_b smallint, c5_g smallint, c6_b smallint, c6_g smallint, c7_b smallint, c7_g smallint, c8_b smallint, c8_g smallint, c9_b smallint, c9_g smallint, c10_b smallint, c10_g smallint, c11_b smallint, c11_g smallint, c12_b smallint, c12_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_enr_reptr_dup drop constraint if exists udise_sch_enr_reptr_dup_key;

create table if not exists udise_sch_enr_fresh_dup( udise_sch_code bigint , ac_year text, item_group smallint , item_id smallint , cpp_b smallint, cpp_g smallint, c1_b smallint, c1_g smallint, c2_b smallint, c2_g smallint, c3_b smallint, c3_g smallint, c4_b smallint, c4_g smallint, c5_b smallint, c5_g smallint, c6_b smallint, c6_g smallint, c7_b smallint, c7_g smallint, c8_b smallint, c8_g smallint, c9_b smallint, c9_g smallint, c10_b smallint, c10_g smallint, c11_b smallint, c11_g smallint, c12_b smallint, c12_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_enr_fresh_dup drop constraint if exists udise_sch_enr_fresh_dup_key;

create table if not exists udise_sch_enr_newadm_dup( udise_sch_code bigint , ac_year text, age4_b smallint, age4_g smallint, age5_b smallint, age5_g smallint, age6_b smallint, age6_g smallint, age7_b smallint, age7_g smallint, age8_b smallint, age8_g smallint, same_sch_b smallint, same_sch_g smallint, oth_sch_b smallint, oth_sch_g smallint, anganwadi_b smallint, anganwadi_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_sch_enr_newadm_dup drop constraint if exists udise_sch_enr_newadm_dup_key;

create table if not exists udise_sch_facility_dup( udise_sch_code bigint , ac_year text, bld_status smallint, bld_blk_tot smallint, bld_blk smallint, bld_blk_ppu smallint, bld_blk_kuc smallint, bld_blk_tnt smallint, bld_blk_dptd smallint, bld_blk_undcons smallint, bndrywall_type smallint, clsrms_inst smallint, clsrms_und_cons smallint, clsrms_dptd smallint, clsrms_pre_pri smallint, clsrms_pri smallint, clsrms_upr smallint, clsrms_sec smallint, clsrms_hsec smallint, othrooms smallint, clsrms_gd smallint, clsrms_gd_ppu smallint, clsrms_gd_kuc smallint, clsrms_gd_tnt smallint, clsrms_min smallint, clsrms_min_ppu smallint, clsrms_min_kun smallint, clsrms_min_tnt smallint, clsrms_maj smallint, clsrms_maj_ppu smallint, clsrms_maj_kuc smallint, clsrms_maj_tnt smallint, land_avl_yn smallint, hm_room_yn smallint, toilet_yn smallint, toiletb smallint, toiletb_fun smallint, toiletg smallint, toiletg_fun smallint, toiletb_cwsn smallint, toiletb_cwsn_fun smallint, toiletg_cwsn smallint, toiletg_cwsn_fun smallint, urinalsb smallint, urinalsb_fun smallint, urinalsg smallint, urinalsg_fun smallint, toiletb_fun_water smallint, toiletg_fun_water smallint, handwash_yn smallint, incinerator_yn smallint, drink_water_yn smallint, hand_pump_tot smallint, hand_pump_fun smallint, well_prot_tot smallint, well_prot_fun smallint, well_unprot_tot smallint, well_unprot_fun smallint, tap_tot smallint, tap_fun smallint, pack_water smallint, pack_water_fun smallint, othsrc_tot smallint, othsrc_fun smallint, othsrc_name varchar(100), water_purifier_yn smallint, water_tested_yn smallint, rain_harvest_yn smallint, handwash_meal_yn smallint, handwash_meal_tot smallint, electricity_yn smallint, solarpanel_yn smallint, library_yn smallint, lib_books integer, lib_books_ncert integer, bookbank_yn smallint, bkbnk_books integer, bkbnk_books_ncert integer, readcorner_yn smallint, readcorner_books integer, librarian_yn smallint, newspaper_yn smallint, playground_yn smallint, playground_alt_yn smallint, medchk_yn smallint, medchk_tot smallint, dewormtab_yn smallint, irontab_yn smallint, ramps_yn smallint, handrails_yn smallint, spl_educator_yn smallint, kitchen_garden_yn smallint, dstbn_clsrms_yn smallint, dstbn_toilet_yn smallint, dstbn_kitchen_yn smallint, stus_hv_furnt smallint, ahmvp_room_yn smallint, comroom_g_yn smallint, staff_room_yn smallint, craft_room_yn smallint, staff_qtr_yn smallint, integrated_lab_yn smallint, library_room_yn smallint, comp_room_yn smallint, tinkering_lab_yn smallint, phy_lab_yn smallint, phy_lab_cond smallint, chem_lab_yn smallint, chem_lab_cond smallint, boi_lab_yn smallint, bio_lab_cond smallint, math_lab_yn smallint, math_lab_cond smallint, lang_lab_yn smallint, lang_lab_cond smallint, geo_lab_yn smallint, geo_lab_cond smallint, homesc_lab_yn smallint, home_sc_lab_cond smallint, psycho_lab_yn smallint, psycho_lab_cond smallint, audio_system_yn smallint, sciencekit_yn smallint, mathkit_yn smallint, biometric_dev_yn smallint, comp_lab_type smallint, ict_impl_year smallint, ictlab_fun_yn smallint, ict_model_impl smallint, ict_instr_type smallint, laptop_yn smallint, laptop_tot smallint, laptop_fun smallint, tablets_yn smallint, tablets_tot smallint, tablets_fun smallint, desktop_yn smallint, desktop_tot smallint, desktop_fun smallint, teachdev_yn smallint, teachdev_tot smallint, teachdev_fun smallint, digi_board_yn smallint, digi_board_tot smallint, digi_board_fun smallint, server_yn smallint, server_tot smallint, server_fun smallint, projector_yn smallint, projector_tot smallint, projector_fun smallint, led_yn smallint, led_tot smallint, led_fun smallint, printer_yn smallint, printer_tot smallint, printer_fun smallint, scanner_yn smallint, scanner_tot smallint, scanner_fun smallint, webcam_yn smallint, webcam_tot smallint, webcam_fun smallint, generator_yn smallint, generator_tot smallint, generator_fun smallint, internet_yn smallint, dth_yn smallint, digi_res_yn smallint, tech_soln_yn smallint, ict_tools_yn smallint, ict_teach_hrs smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_sch_facility_dup drop constraint if exists udise_sch_facility_dup_key;

create table if not exists udise_sch_profile_dup( udise_sch_code bigint , 
ac_year text, c0_sec smallint, c1_sec smallint, c2_sec smallint, c3_sec smallint, c4_sec smallint, 
c5_sec smallint, c6_sec smallint, c7_sec smallint, c8_sec smallint, c9_sec smallint, c10_sec smallint, 
c11_sec smallint, c12_sec smallint, estd_year varchar(10), recog_year_pri varchar(10), recog_year_upr varchar(10), 
recog_year_sec varchar(10), recog_year_hsec varchar(10), upgrd_year_ele varchar(10), upgrd_year_sec varchar(10), 
upgrd_year_hsec varchar(10), cwsn_sch_yn smallint, shift_sch_yn smallint, resi_sch_yn smallint, resi_sch_type int, 
boarding_pri_yn smallint, boarding_pri_b smallint, boarding_pri_g smallint, boarding_upr_yn smallint, boarding_upr_b smallint, 
boarding_upr_g smallint, boarding_sec_yn smallint, boarding_sec_b smallint, boarding_sec_g smallint, boarding_hsec_yn smallint, 
boarding_hsec_b smallint, boarding_hsec_g smallint, minority_yn smallint, minority_type smallint, mtongue_pri smallint, medinstr1 smallint, 
medinstr2 smallint, medinstr3 smallint, medinstr4 smallint, medinstr_oth varchar(100), lang1 smallint, lang2 smallint, lang3 smallint, 
prevoc_yn smallint, eduvoc_yn smallint, board_sec smallint, board_sec_no varchar(100), board_sec_oth varchar(100), board_hsec smallint, 
board_hsec_no varchar(100), board_hsec_oth varchar(100), distance_pri double precision, distance_upr double precision, 
distance_sec double precision, distance_hsec double precision, approach_road_yn smallint, ppsec_yn smallint, ppstu_lkg_b smallint, 
ppstu_lkg_g smallint, ppstu_ukg_b smallint, ppstu_ukg_g smallint, anganwadi_yn smallint, anganwadi_code varchar(100), anganwadi_stu_b smallint, 
anganwadi_stu_g smallint, anganwadi_tch_trained smallint, workdays_pre_pri smallint, workdays_pri smallint, workdays_upr smallint, workdays_sec smallint, 
workdays_hsec smallint, sch_hrs_stu_pre_pri double precision, sch_hrs_stu_pri double precision, sch_hrs_stu_upr double precision, 
sch_hrs_stu_sec double precision, sch_hrs_stu_hsec double precision, sch_hrs_tch_pre_pri double precision, sch_hrs_tch_pri double precision, 
sch_hrs_tch_upr double precision, sch_hrs_tch_sec double precision, sch_hrs_tch_hsec double precision, cce_yn_pri smallint, cce_yn_upr smallint, 
cce_yn_sec smallint, cce_yn_hsec smallint, pcr_maintained_yn smallint, pcr_shared_yn smallint, rte_25p_applied smallint, rte_25p_enrolled smallint, 
rte_pvt_c0_b smallint, rte_pvt_c0_g smallint, rte_pvt_c1_b smallint, rte_pvt_c1_g smallint, rte_pvt_c2_b smallint, rte_pvt_c2_g smallint, rte_pvt_c3_b smallint, 
rte_pvt_c3_g smallint, rte_pvt_c4_b smallint, rte_pvt_c4_g smallint, rte_pvt_c5_b smallint, rte_pvt_c5_g smallint, rte_pvt_c6_b smallint, rte_pvt_c6_g smallint, 
rte_pvt_c7_b smallint, rte_pvt_c7_g smallint, rte_pvt_c8_b smallint, rte_pvt_c8_g smallint, rte_bld_c0_b smallint, rte_bld_c0_g smallint, rte_bld_c1_b smallint, 
rte_bld_c1_g smallint, rte_bld_c2_b smallint, rte_bld_c2_g smallint, rte_bld_c3_b smallint, rte_bld_c3_g smallint, rte_bld_c4_b smallint, rte_bld_c4_g smallint, 
rte_bld_c5_b smallint, rte_bld_c5_g smallint, rte_bld_c6_b smallint, rte_bld_c6_g smallint, rte_bld_c7_b smallint, rte_bld_c7_g smallint, rte_bld_c8_b smallint, 
rte_bld_c8_g smallint, rte_ews_c9_b smallint, rte_ews_c9_g smallint, rte_ews_c10_b smallint, rte_ews_c10_g smallint, rte_ews_c11_b smallint, rte_ews_c11_g smallint, 
rte_ews_c12_b smallint, rte_ews_c12_g smallint, spltrg_yn smallint, spltrg_cy_prov_b smallint, spltrg_cy_prov_g smallint, spltrg_py_enrol_b smallint, 
spltrg_py_enrol_g smallint, spltrg_py_prov_b smallint, spltrg_py_prov_g smallint, spltrg_by smallint, spltrg_place smallint, spltrg_type smallint, 
remedial_tch_enrol smallint, session_start_mon smallint, txtbk_recd_yn smallint, txtbk_recd_mon smallint, supp_mat_recd_yn smallint, txtbk_pre_pri_yn smallint, 
txtbk_pri_yn smallint, txtbk_upr_yn smallint, txtbk_sec_yn smallint, txtbk_hsec_yn smallint, tle_pre_pri_yn smallint, tle_pri_yn smallint, tle_upr_yn smallint, 
tle_sec_yn smallint, tle_hsec_yn smallint, playmat_pre_pri_yn smallint, playmat_pri_yn smallint, playmat_upr_yn smallint, playmat_sec_yn smallint, playmat_hsec_yn smallint, 
no_inspect smallint, no_visit_crc smallint, no_visit_brc smallint, no_visit_dis smallint, smc_yn smallint, smc_mem_m smallint, smc_mem_f smallint, 
smc_par_m smallint, smc_par_f smallint, smc_par_sc smallint, smc_par_st smallint, smc_par_ews smallint, smc_par_min smallint, smc_lgb_m smallint, 
smc_lgb_f smallint, smc_tch_m smallint, smc_tch_f smallint, smc_trained_m smallint, smc_trained_f smallint, smc_meetings smallint, smc_sdp_yn smallint, 
smc_bnkac_yn smallint, smdc_smc_same_yn smallint, smdc_yn smallint, smdc_mem_m smallint, smdc_mem_f smallint, smdc_par_m smallint, smdc_par_f smallint, 
smdc_par_ews_m smallint, smdc_par_ews_f smallint, smdc_lgb_m smallint, smdc_lgb_f smallint, smdc_ebmc_m smallint, smdc_ebmc_f smallint, smdc_women_f smallint, 
smdc_scst_m smallint, smdc_scst_f smallint, smdc_deo_m smallint, smdc_deo_f smallint, smdc_audit_m smallint, smdc_audit_f smallint, smdc_subexp_m smallint, 
smdc_subexp_f smallint, smdc_tch_m smallint, smdc_tch_f smallint, smdc_vp_m smallint, smdc_vp_f smallint, smdc_prin_m smallint, smdc_prin_f smallint, smdc_cp_m smallint, 
smdc_cp_f smallint, smdc_trained_m smallint, smdc_trained_f smallint, smdc_meetings smallint, smdc_sdp_yn smallint, smdc_bnkac_yn smallint, smdc_sbc_yn smallint, 
smdc_acadcom_yn smallint, smdc_pta_yn smallint, smdc_pta_meeting smallint ,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_profile_dup drop constraint if exists udise_sch_profile_dup_key;

alter table udise_sch_profile_dup drop column if exists smc_bnk_name ;
alter table udise_sch_profile_dup drop column if exists smc_bnk_br ;
alter table udise_sch_profile_dup drop column if exists smc_bnkac_no ;
alter table udise_sch_profile_dup drop column if exists smc_bnkac_ifsc ;
alter table udise_sch_profile_dup drop column if exists smc_bnkac_name ;
alter table udise_sch_profile_dup drop column if exists smdc_bnk_name ;
alter table udise_sch_profile_dup drop column if exists smdc_bnk_br ;
alter table udise_sch_profile_dup drop column if exists smdc_bnkac_no ;
alter table udise_sch_profile_dup drop column if exists smdc_bnkac_ifsc ;
alter table udise_sch_profile_dup drop column if exists smdc_bnkac_name ;

create table if not exists udise_sch_staff_posn_dup( udise_sch_code bigint , ac_year text, tch_regular smallint, tch_contract smallint, tch_part_time smallint, nontch_accnt smallint, nontch_lib_asst smallint, nontch_lab_asst smallint, nontch_udc smallint, nontch_ldc smallint, nontch_peon smallint, nontch_watchman smallint, tch_hav_adhr smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_sch_staff_posn_dup drop constraint if exists udise_sch_staff_posn_dup_key;

create table if not exists udise_tch_profile_dup( udise_sch_code bigint , tch_code varchar(100), name varchar(100), gender smallint, dob date, social_cat smallint, tch_type smallint, nature_of_appt smallint, doj_service date, qual_acad smallint, qual_prof smallint, class_taught smallint, appt_sub smallint, sub_taught1 smallint, sub_taught2 smallint, trn_brc smallint, trn_crc smallint, trn_diet smallint, trn_other smallint, trng_rcvd smallint, trng_needed smallint, nontch_days smallint, math_upto smallint, science_upto smallint, english_upto smallint, lang_study_upto smallint, soc_study_upto smallint, yoj_pres_sch varchar(100), disability_type smallint, trained_cwsn smallint, trained_comp smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_tch_profile_dup drop constraint if exists udise_tch_profile_dup_key;

create table if not exists udise_sch_exmmarks_c10_dup( udise_sch_code bigint , ac_year text, item_id smallint , marks_range_id smallint , gen_b smallint, gen_g smallint, obc_b smallint, obc_g smallint, sc_b smallint, sc_g smallint, st_b smallint, st_g integer,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_sch_exmmarks_c10_dup drop constraint if exists udise_sch_exmmarks_c10_dup_key;

create table if not exists udise_sch_exmmarks_c12_dup( udise_sch_code bigint , ac_year text, item_id smallint , marks_range_id smallint , gen_b smallint, gen_g smallint, obc_b smallint, obc_g smallint, sc_b smallint, sc_g smallint, st_b smallint, st_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_exmmarks_c12_dup drop constraint if exists udise_sch_exmmarks_c12_dup_key;

create table if not exists udise_sch_recp_exp_dup( udise_sch_code bigint , ac_year text, dev_grt_r double precision, dev_grt_e double precision, maint_grt_r double precision, maint_grt_e double precision, tlm_grt_r double precision, tlm_grt_e double precision, cw_grt_r double precision, cw_grt_e double precision, anl_grt_r double precision, anl_grt_e double precision, minrep_grt_r double precision, minrep_grt_e double precision, labrep_grt_r double precision, labrep_grt_e double precision, book_grt_r double precision, book_grt_e double precision, elec_grt_r double precision, elec_grt_e double precision, oth_grt_r double precision, oth_grt_e double precision, compo_grt_r double precision, compo_grt_e double precision, lib_grt_r double precision, lib_grt_e double precision, sport_grt_r double precision, sport_grt_e double precision, media_grt_r double precision, media_grt_e double precision, smc_grt_r double precision, smc_grt_e double precision, presch_grt_r double precision, presch_grt_e double precision, ngo_asst_yn smallint, ngo_asst_name varchar(100), ngo_asst_rcvd double precision, psu_asst_yn smallint, psu_asst_name varchar(100), psu_asst_rcvd double precision, comm_asst_yn smallint, comm_asst_rcvd double precision, comm_asst_name varchar(100), oth_asst_yn smallint, oth_asst_name varchar(100), oth_asst_rcvd double precision, ict_reg_yn smallint, sport_reg_yn smallint, lib_reg_yn smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_sch_recp_exp_dup drop constraint if exists udise_sch_recp_exp_dup_key;

create table if not exists udise_nsqf_basic_info_dup( udise_sch_code bigint , ac_year text, nsqf_yn smallint, voc_course_yn smallint, sec1_sub Integer, sec1_year varchar(10), sec2_sub Integer, sec2_year varchar(10),num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_nsqf_basic_info_dup drop constraint if exists udise_nsqf_basic_info_dup_key;

create table if not exists udise_nsqf_enr_caste_dup( udise_sch_code bigint , ac_year text, sector_no smallint , item_id smallint , c9_b smallint, c9_g smallint, c10_b smallint, c10_g smallint, c11_b smallint, c11_g smallint, c12_b smallint, c12_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_nsqf_enr_caste_dup drop constraint if exists udise_nsqf_enr_caste_dup_key;

create table if not exists udise_nsqf_enr_sub_sec_dup( udise_sch_code bigint , ac_year text, sub_sector_id smallint, sector_no smallint , c9_b smallint, c9_g smallint, c10_b smallint, c10_g smallint, c11_b smallint, c11_g smallint, c12_b smallint, c12_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_nsqf_enr_sub_sec_dup drop constraint if exists udise_nsqf_enr_sub_sec_dup_key;

create table if not exists udise_nsqf_exmres_c10_dup( udise_sch_code bigint , ac_year text, sector_no smallint , marks_range_id smallint , gen_b smallint, gen_g smallint, obc_b smallint, obc_g smallint, sc_b smallint, sc_g smallint, st_b smallint, st_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_nsqf_exmres_c10_dup drop constraint if exists udise_nsqf_exmres_c10_dup_key;

create table if not exists udise_nsqf_exmres_c12_dup( udise_sch_code bigint , ac_year text, sector_no smallint , marks_range_id smallint , gen_b smallint, gen_g smallint, obc_b smallint, obc_g smallint, sc_b smallint, sc_g smallint, st_b smallint, st_g smallint, num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_nsqf_exmres_c12_dup drop constraint if exists udise_nsqf_exmres_c12_dup_key;

create table if not exists udise_nsqf_trng_prov_dup( udise_sch_code bigint , ac_year text, agency_name varchar(200), sector_no smallint , cert_no varchar(200), cert_agency varchar(200),num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_nsqf_trng_prov_dup drop constraint if exists udise_nsqf_trng_prov_dup_key;

create table if not exists udise_nsqf_faculty_dup( udise_sch_code bigint , ac_year text, faculty_code varchar(100) , name varchar(100), gender smallint, dob date, soc_cat smallint, nature_of_appt smallint, qual_acad smallint, qual_prof smallint, industry_exp smallint, training_exp smallint, class_taught smallint, appt_sec smallint, induc_trg_rcvd smallint, inserv_trg_rcvd smallint, num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_nsqf_faculty_dup drop constraint if exists udise_nsqf_faculty_dup_key;

create table if not exists udise_sch_pgi_details_dup( udise_sch_code bigint , ac_year text, tch_adhr_seed Integer, stu_atndnc_yn smallint, tch_atndnc_yn smallint, sch_eval_yn smallint, improv_plan_yn smallint, sch_pfms_yn smallint, num_of_times int,
ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp);

alter table udise_sch_pgi_details_dup drop constraint if exists udise_sch_pgi_details_dup_key;

create table if not exists udise_sch_safety_dup( udise_sch_code bigint , ac_year text, sdmp_plan_yn smallint, struct_safaud_yn smallint, nonstr_safaud_yn smallint, cctv_cam_yn smallint, fire_ext_yn smallint, nodal_tch_yn smallint, safty_trng_yn smallint, dismgmt_taug_yn smallint, slfdef_grt_yn smallint, slfdef_trained smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_sch_safety_dup drop constraint if exists udise_sch_safety_dup_key;

create table if not exists udise_sch_exmres_c8_dup( udise_sch_code bigint primary key , academic_year varchar(10), gen_app_b smallint, gen_app_g smallint, obc_app_b smallint, obc_app_g smallint, sc_app_b smallint, sc_app_g smallint, st_app_b smallint, st_app_g smallint, gen_pass_b smallint, gen_pass_g smallint, obc_pass_b smallint, obc_pass_g smallint, sc_pass_b smallint, sc_pass_g smallint, st_pass_b smallint, st_pass_g smallint, gen_60p_b smallint, gen_60p_g smallint, obc_60p_b smallint, obc_60p_g smallint, sc_60p_b smallint, sc_60p_g smallint, st_60p_b smallint, st_60p_g smallint,num_of_times int,ff_uuid varchar(255),created_on_file_process timestamp default current_timestamp );

alter table udise_sch_exmres_c8_dup drop constraint if exists udise_sch_exmres_c8_dup_key;

/*pat null validation table*/

create table if not exists pat_null_col(
filename varchar(200) ,
ff_uuid varchar(200),
count_null_exam_id int,
count_null_question_id int,
count_null_assessment_year int,
count_null_medium int,
count_null_standard int,
count_null_subject_id int,
count_null_subject_name int,
count_null_exam_type_id int,
count_null_exam_type int,
count_null_exam_code int,
count_null_exam_date int,
count_null_total_questions int,
count_null_total_marks int,
count_null_question_title int,
count_null_question int,
count_null_question_marks int,
count_null_id int,
count_null_student_uid int,
count_null_school_id int,
count_null_studying_class int,
count_null_obtained_marks int
);

create table if not exists pat_trans_null_col(
filename varchar(200) ,
ff_uuid varchar(200),
count_null_exam_id int,
count_null_question_id int,
count_null_exam_code int,
count_null_exam_date int,
count_null_id int,
count_null_student_uid int,
count_null_school_id int,
count_null_studying_class int,
count_null_obtained_marks int
);

create table if not exists periodic_exam_mst_dup(
exam_id	int,
assessment_year	varchar(20),
medium	varchar(20),
standard	int,
division	varchar(20),
subject_id	int,
subject_name	varchar(50),
exam_type_id	int,
exam_type	varchar(50),
exam_code	varchar(100),
exam_date	date,
total_questions	int,
total_marks	int,
num_of_times int,
ff_uuid varchar(255),
created_on_file_process  TIMESTAMP without time zone default current_timestamp
);

create table if not exists periodic_exam_qst_mst_dup(
question_id	int,
exam_id	int,
indicator_id	int,
indicator_title	varchar(20),
indicator	text,
question_title	varchar(20),
question	text,
question_marks	numeric,
num_of_times int,
ff_uuid varchar(255),
created_on_file_process  TIMESTAMP without time zone default current_timestamp
);

create table if not exists periodic_exam_result_dup(
id	int,
exam_id	int,
exam_code	varchar(100),
student_id	bigint,
student_uid	bigint,
school_id	bigint,
studying_class	int,
section	varchar(20),
question_id	int,
obtained_marks	numeric,
num_of_times int,
ff_uuid varchar(255),
created_on_file_process  TIMESTAMP without time zone default current_timestamp
);

/*log summary*/

alter table log_summary add COLUMN if not exists exam_id int;
alter table log_summary add COLUMN if not exists question_id  int;
alter table log_summary add COLUMN if not exists assessment_year int;
alter table log_summary add COLUMN if not exists medium int;
alter table log_summary add COLUMN if not exists standard int;
alter table log_summary add COLUMN if not exists subject_id int;
alter table log_summary add COLUMN if not exists subject_name int;
alter table log_summary add COLUMN if not exists exam_type_id int;
alter table log_summary add COLUMN if not exists exam_type int;
alter table log_summary add COLUMN if not exists exam_code int;
alter table log_summary add COLUMN if not exists exam_date int;
alter table log_summary add COLUMN if not exists total_questions int;
alter table log_summary add COLUMN if not exists total_marks int;
alter table log_summary add COLUMN if not exists question_title int;
alter table log_summary add COLUMN if not exists question int;
alter table log_summary add COLUMN if not exists question_marks int;
alter table log_summary add COLUMN if not exists id  int;
alter table log_summary add COLUMN if not exists school_id int;
alter table log_summary add COLUMN if not exists student_uid int;
alter table log_summary add COLUMN if not exists studying_class int;
alter table log_summary add COLUMN if not exists obtained_marks int;


alter table log_summary add COLUMN if not exists udise_sch_code int;
alter table log_summary add COLUMN if not exists sector_no  int;
alter table log_summary add COLUMN if not exists item_id int;
alter table log_summary add COLUMN if not exists class_type_id int;
alter table log_summary add COLUMN if not exists stream_id int;
alter table log_summary add COLUMN if not exists grade_pri_upr int;
alter table log_summary add COLUMN if not exists incentive_type int;
alter table log_summary add COLUMN if not exists caste_id int;
alter table log_summary add COLUMN if not exists disability_type int;
alter table log_summary add COLUMN if not exists medinstr_seq int;
alter table log_summary add COLUMN if not exists age_id int;
alter table log_summary add COLUMN if not exists item_group int;
alter table log_summary add COLUMN if not exists tch_code int;
alter table log_summary add COLUMN if not exists marks_range_id int;
alter table log_summary add COLUMN if not exists nsqf_faculty_id int;

/*PAT data tables*/

create table if not exists periodic_exam_mst(
exam_id  int,
assessment_year  varchar(20),
medium  varchar(20),
standard  int,
division  varchar(20),
subject_id  int,
subject_name  varchar(50),
exam_type_id  int,
exam_type  varchar(50),
exam_code  varchar(100),
exam_date  date,
total_questions  int,
total_marks  numeric,
created_on  timestamp,
updated_on  timestamp,
primary key(exam_id,assessment_year)
);

alter table periodic_exam_mst drop constraint if exists periodic_exam_mst_pkey;
alter table periodic_exam_mst add primary key(exam_id,assessment_year);

create table if not exists periodic_exam_qst_mst(
question_id  int primary key not null,
exam_id  int,
indicator_id  int,
indicator_title varchar(20),
indicator  text,
question_title  varchar(20),
question  text,
question_marks  numeric,
created_on  timestamp,
updated_on  timestamp
);

create table if not exists periodic_exam_result_temp(
id  int primary key not null,
ffuid text,
exam_id  int,
exam_code  varchar(100),
student_id  bigint,
student_uid  bigint,
school_id  bigint,
studying_class  int,
section  varchar(20),
question_id  int,
obtained_marks  numeric,
created_on  timestamp,
updated_on  timestamp
);

create table if not exists periodic_exam_result_staging_1(
id  int,
ff_uuid text,
exam_id  int,
exam_code  varchar(100),
student_id  bigint,
student_uid  bigint,
school_id  bigint,
studying_class  int,
section  varchar(20),
question_id  int,
obtained_marks  numeric,
created_on  timestamp,
updated_on  timestamp
);

create table if not exists periodic_exam_result_staging_2(
id  int,
ff_uuid text,
exam_id  int,
exam_code  varchar(100),
student_id  bigint,
student_uid  bigint,
school_id  bigint,
studying_class  int,
section  varchar(20),
question_id  int,
obtained_marks  numeric,
created_on  timestamp,
updated_on  timestamp
);

create table if not exists periodic_exam_result_trans(
id  int,
exam_id  int,
exam_code  varchar(100),
student_id  bigint,
student_uid  bigint,
school_id  bigint,
studying_class  int,
section  varchar(20),
question_id  int,
obtained_marks  numeric,
created_on  timestamp,
updated_on  timestamp,
primary key(exam_code, student_uid, question_id)
);

create table if not exists periodic_exam_school_result
(id  serial,
academic_year  varchar(50),
exam_code  varchar(100),
school_id  bigint,
grade  smallint,
school_name  varchar(200),
school_latitude  double precision,
school_longitude  double precision,
district_id  bigint,
district_name  varchar(100),
district_latitude  double precision,
district_longitude  double precision,
block_id  bigint,
block_name  varchar(100),
block_latitude  double precision,
block_longitude  double precision,
cluster_id  bigint,
cluster_name  varchar(100),
cluster_latitude  double precision,
cluster_longitude  double precision,
subject  text,
obtained_marks  numeric,
total_marks  numeric,
students_count   int,
created_on  timestamp,
updated_on  timestamp,
primary key(academic_year,exam_code,school_id)
);

alter table periodic_exam_school_result add COLUMN if not exists exam_date date;

alter table periodic_exam_school_result add COLUMN if not exists students_attended int;

create table if not exists periodic_exam_school_qst_result
(id  serial,
academic_year  varchar(50),
exam_code varchar(100),
exam_date  date,
school_id  bigint,
grade  smallint,
school_name  varchar(200),
district_id  bigint,
district_name  varchar(100),
block_id  bigint,
block_name  varchar(100),
cluster_id  bigint,
cluster_name  varchar(100),
subject  text,
question_id	int,
indicator	text,
obtained_marks  numeric,
total_marks  numeric,
students_attended   int,
total_students int,
created_on  timestamp,
updated_on  timestamp,
primary key(academic_year,exam_code,school_id,question_id)
);

/*Composite reports queries*/

/* composite nifi template info */

CREATE TABLE IF NOT EXISTS nifi_template_info ( 
 id serial,
 template text, 
 status boolean
);

/* composite config */

CREATE TABLE IF NOT EXISTS composite_config ( 
 id serial,
 template text, 
 status boolean,
 select_query text,
 table_join text,
 category text,
 jolt_spec text,
 primary key(template,category)
);

 create table if not exists telemetry_views_data
    (
  uid text,
  eventtype text,
  reportid text,
  click_time TIMESTAMP without time zone,
  created_on TIMESTAMP without time zone default current_timestamp
  );

Alter table diksha_content_staging
add column if not exists collection_id text,
Add column if not exists collection_name text,
add column if not exists batch_id text,
add column if not exists batch_name text,
add column if not exists uuid text,
Add column if not exists district text,
add column if not exists state text,
add column if not exists org_name text,
add column if not exists school_id bigint,
Add column if not exists declared_board text,
Add column if not exists school_name text,
Add column if not exists block_name text,
add column if not exists enrolment_date date,
add column if not exists completion_date date,
add column if not exists progress double precision,
add column if not exists certificate_status text,
add column if not exists total_score double precision,
Add column if not exists created_on timestamp without time zone,
Add column if not exists updated_on timestamp without time zone;

Alter table diksha_null_col
Add column if not exists count_null_collection_id int,
Add column if not exists count_null_uuid int,
Add column if not exists count_null_school_id int;

create table IF NOT EXISTS diksha_tpd_dup(
 ff_uuid text,
 collection_id text,
 collection_name text,
 batch_id text,
 batch_name text,
 uuid text,
 state text,
 org_name text,
 school_id bigint,
 enrolment_date date,
 completion_date date,
 progress double precision,
 certificate_status text,
 total_score double precision,
 nested_collection_progress	jsonb,
assessment_score	jsonb,
 created_on timestamp without time zone,
 updated_on timestamp without time zone);


create table IF NOT EXISTS diksha_tpd_content_temp(
ff_uuid text,
 collection_id text,
 collection_name text,
 batch_id text,
 batch_name text,
 uuid text,
 state text,
 org_name text,
 school_id bigint,
 enrolment_date date,
 completion_date date,
 progress double precision,
 certificate_status text,
 total_score double precision,
nested_collection_progress	jsonb,
assessment_score	jsonb,
 created_on timestamp without time zone,
 updated_on timestamp without time zone);

create table IF NOT EXISTS diksha_tpd_trans(
collection_id	text,
collection_name	text,
batch_id	text,
batch_name	text,
uuid	text,
state	text,
org_name	text,
school_id	bigint,
enrolment_date	date,
completion_date	date,
progress	double precision,
certificate_status	text,
total_score	double precision,
nested_collection_progress	jsonb,
assessment_score	jsonb,
created_on	TIMESTAMP without time zone,
updated_on	TIMESTAMP without time zone,
primary key(collection_id,uuid,school_id)
  );


alter table log_summary add column IF NOT EXISTS collection_id int;
alter table log_summary add column IF NOT EXISTS uuid int;

create table IF NOT EXISTS diksha_tpd_agg(
collection_id	text,
collection_name	text,
collection_progress	double precision,
enrolled_date date,
school_id	bigint,
school_name  varchar(200),
district_id  bigint,
district_name  varchar(100),
block_id  bigint,
block_name  varchar(100),
cluster_id  bigint,
cluster_name  varchar(100),
created_on	TIMESTAMP without time zone,
updated_on	TIMESTAMP without time zone,
primary key(collection_id,enrolled_date,school_id,collection_name)
  );

alter table diksha_tpd_agg add column IF NOT EXISTS total_enrolled int;
alter table diksha_tpd_agg add column IF NOT EXISTS total_completed int;
alter table diksha_tpd_agg drop column IF EXISTS percentage_teachers;

create table  if not exists diksha_api_meta (request_id text,encryption_key text,batch_id text,channel_id text,from_date date,to_date date,request_status text,
cqube_process_status text,expiry_time timestamp,requested_on timestamp,dataset text,request_channel text, ff_uuid text primary key);

ALTER TABLE school_tmp ALTER COLUMN created_on DROP NOT NULL;
ALTER TABLE school_tmp ALTER COLUMN updated_on DROP NOT NULL;
ALTER TABLE school_master ALTER COLUMN created_on DROP NOT NULL;
ALTER TABLE school_master ALTER COLUMN updated_on DROP NOT NULL;
ALTER TABLE school_management_master ALTER COLUMN created_on DROP NOT NULL;
ALTER TABLE school_management_master ALTER COLUMN updated_on DROP NOT NULL;
ALTER TABLE school_category_master ALTER COLUMN created_on DROP NOT NULL;
ALTER TABLE school_category_master ALTER COLUMN updated_on DROP NOT NULL;
ALTER TABLE school_medium_master ALTER COLUMN created_on DROP NOT NULL;
ALTER TABLE school_medium_master ALTER COLUMN updated_on DROP NOT NULL;



