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
----------------------------------------------
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
school_address  varchar(250),
school_zipcode  int,
school_contact_number  bigint,
school_email_contact  varchar(50),
school_website  varchar(50),
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
created_on  TIMESTAMP without time zone NOT NULL,
updated_on  TIMESTAMP without time zone NOT NULL
);

----------------------------------------------------
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
school_address  varchar(250),
school_zipcode  int,
school_contact_number  bigint,
school_email_contact  varchar(50),
school_website  varchar(50),
school_lowest_class  int,
school_highest_class  int,
school_management_type_id int ,
school_category_id  int ,
school_medium_id  int ,
created_on  TIMESTAMP without time zone NOT NULL,
updated_on  TIMESTAMP without time zone NOT NULL
);

/*school_management_master*/

create table if not exists school_management_master
  (
school_management_type_id int primary key not null,
school_management_type varchar(100),
created_on  TIMESTAMP without time zone NOT NULL,
updated_on  TIMESTAMP without time zone NOT NULL
-- ,foreign key (school_management_type_id) references school_master(school_management_type_id)
);

/*school_category_master*/

create table if not exists school_category_master
  (
school_category_id int primary key not null,
school_category varchar(100),
created_on  TIMESTAMP without time zone NOT NULL,
updated_on  TIMESTAMP without time zone NOT NULL
-- ,foreign key (school_category_id) references school_master(school_category_id)
);

/*school_medium_master*/

create table if not exists school_medium_master
  (
school_medium_id int primary key not null,
medium_of_school varchar(100),
created_on  TIMESTAMP without time zone NOT NULL,
updated_on  TIMESTAMP without time zone NOT NULL
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

-- create table if not exists holiday_master(holiday_id bigint primary key not null,school_id bigint not null,holiday_date date,created_on timestamp,updated_on timestamp);

-- create index if not exists holiday_master_id on holiday_master(school_id,holiday_date);

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

/*student_attendance_temp*/

create table if not exists student_attendance_staging
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

create index if not exists student_attendance_staging_id on student_attendance_staging(school_id,month,student_id);


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
 count_null_aadhaaruid int,
 count_null_academicyear int, 
count_null_month  int
 );

/* Table name: sem_null_col */

create table if not exists sem_null_col
(filename  varchar(200),  
 ff_uuid  varchar(200), 
 count_null_schoolid int,
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
created_on  TIMESTAMP without time zone, /* created_on field will come from source data*/
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
school_address  varchar(250),
school_zipcode  int,
school_contact_number  bigint,
school_email_contact  varchar(50),
school_website  varchar(50),
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


