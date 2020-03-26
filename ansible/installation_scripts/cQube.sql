/* working days function*/

create or replace function working_days(y int,m int)
RETURNS TABLE(total bigint) as 
$func$
begin

return query 
select count(d.dow) as total from (
select date::date,
       extract('isodow' from date) as dow,
       to_char(date, 'dy') as day,
       extract('isoyear' from date) as "iso year",
       extract('week' from date) as week,
       extract('day' from
               (date + interval '2 month - 1 day')
              )
        as feb,
       extract('year' from date) as year,
       extract('month' from date) as month,
       extract('day' from
               (date + interval '2 month - 1 day')
              ) = 29
       as leap
  from generate_series(date '2019-01-01',
                       date '2020-12-31',
                       interval '1 day')
       as t(date)) as d where dow <>7 and year = y and month = m;
end;
$func$ language plpgsql;


/*school_master*/

create table if not exists school_master
	(
school_id  bigint primary key not null,
udise_code  varchar(20),
school_address_1  varchar(50),
school_address_2  varchar(50),
school_area  varchar(20),
school_zipcode  int,
school_primary_contact  bigint,
school_secondary_contact  bigint,
school_email_contact  varchar(20),
school_website  varchar(20),
management_of_school_id  int,
management_of_school  varchar(50),
year_of_establishment  int,
medium_of_instruction_id  int,
medium_of_instruction_name  varchar(10),
no_of_govt_schemes  int,
govt_schemes_list  varchar(200),
school_category_id  int,
school_category  varchar(20),
school_lowest_class  int,
school_highest_class  int,
type_of_school_id  int,
type_of_school  varchar(20),
medium_of_school_id  int,
medium_of_school  varchar(20),
status_of_school_building  varchar(20),
drinking_water_facility  smallint,
toilet_facility  smallint,
electricity_facility  smallint,
solar_panel_facility  smallint,
library_facility  smallint,
playground_facility  smallint,
computer_lab_facility  smallint,
chemistry_lab_facility  smallint,
internet_facility  smallint,
total_teaching_staffs  int,
total_non_teaching_staff  int,
created_on  TIMESTAMPTZ NOT NULL,
updated_on  date);

create index if not exists school_master_id on school_master(school_id);

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
village_id  bigint,
village_latitude  double precision,
village_longitude  double precision,
created_on  TIMESTAMPTZ ,
updated_on  TIMESTAMPTZ 
/*foreign key (school_id) references school_master(school_id)*/
);

create index if not exists school_geo_master_id on school_geo_master(school_id);

/*student_master*/

create table if not exists student_master
(student_id  bigint primary key not null,
school_student_id  bigint,
school_id  bigint,
dob  date,
disability  varchar(10),
created_on  TIMESTAMPTZ ,
updated_on  date);
/*foreign key (school_id) references school_master(school_id));*/

create index if not exists student_master_id on student_master(student_id);

/*student_attendance_temp_1*/

create table if not exists student_attendance_temp_1(StudentAttendanceId varchar(20) primary key not null,
StudentId   varchar(20),SchoolId varchar(20),AadhaarUID   varchar(20),AcademicYear  varchar(20),
month   varchar(5),"day1" varchar(5),"day2" varchar(5),"day3" varchar(5),"day4" varchar(5),"day5" varchar(5),"day6" varchar(5),
"day7" varchar(5),"day8" varchar(5),"day9" varchar(5),"day10" varchar(5),"day11" varchar(5),"day12" varchar(5),"day13" varchar(5),
"day14" varchar(5),"day15" varchar(5),"day16" varchar(5),"day17" varchar(5),"day18" varchar(5),"day19" varchar(5),"day20" varchar(5),
"day21" varchar(5),"day22" varchar(5),"day23" varchar(5),"day24" varchar(5),"day25" varchar(5),"day26" varchar(5),"day27" varchar(5),
"day28" varchar(5),"day29" varchar(5),"day30" varchar(5),"day31" varchar(5));

create index if not exists student_attendance_temp1_month ON student_attendance_temp_1(month,SchoolId);


/*student_attendance_trans*/

create table if not exists student_attendance_trans
(
attendance_id  bigint primary key not null,
student_id  bigint,
school_student_id  bigint,
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
updated_on  date
/*foreign key (school_id) references school_master(school_id),
foreign key (student_id) references student_master(student_id)*/
);

create index if not exists student_attendance_trans_id on student_attendance_trans(attendance_id);


/*Aggregated*/
/*school_student_total_attendance*/

create table if not exists school_student_total_attendance
(
student_attendance_id  serial,
year  int,
month  smallint,
school_id  bigint,
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
village_id  bigint,
village_latitude  double precision,
village_longitude  double precision,

total_present  int,
total_absent  int,
total_working_days  int,
created_on  TIMESTAMPTZ ,
updated_on  date
);

create index if not exists school_student_total_attendance_id on school_student_total_attendance(month,school_id);



