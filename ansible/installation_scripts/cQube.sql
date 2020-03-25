/*CCC 2.0 Gujarat*/

/*c3_student_attendance_tmp_1*/

create table if not exists c3_student_attendance_tmp_1(StudentAttendanceId varchar(20) primary key not null,
StudentId   varchar(20),SchoolId varchar(20),AadhaarUID   varchar(20),AcademicYear  varchar(20),month   varchar(5),"day1" varchar(5),"day2" varchar(5),"day3" varchar(5),"day4" varchar(5),"day5" varchar(5),"day6" varchar(5),"day7" varchar(5),"day8" varchar(5),"day9" varchar(5),"day10" varchar(5),"day11" varchar(5),"day12" varchar(5),"day13" varchar(5),"day14" varchar(5),"day15" varchar(5),"day16" varchar(5),"day17" varchar(5),"day18" varchar(5),"day19" varchar(5),"day20" varchar(5),"day21" varchar(5),"day22" varchar(5),"day23" varchar(5),"day24" varchar(5),"day25" varchar(5),"day26" varchar(5),"day27" varchar(5),"day28" varchar(5),"day29" varchar(5),"day30" varchar(5),"day31" varchar(5));

create index if not exists c3_student_attendance_tmp_month ON c3_student_attendance_tmp_1(month);
create index if not exists c3_student_attendance_tmp_School ON c3_student_attendance_tmp_1(SchoolId);

/*c3_student_attendance_tmp_2*/

create table if not exists c3_student_attendance_tmp_2(StudentAttendanceId bigint ,
StudentId   varchar(20),SchoolId varchar(20),AadhaarUID   varchar(20),AcademicYear  varchar(10),month varchar(5),date_day varchar(5),attendance varchar(5));

create index if not exists c3_student_attendance_month_tmp ON c3_student_attendance_tmp_2(month);
create index if not exists c3_student_attendance_School_tmp ON c3_student_attendance_tmp_2(SchoolId);

/*c3_student_attendance*/

create table if not exists c3_student_attendance(StudentAttendanceId bigint ,
StudentId   bigint,SchoolId bigint,AadhaarUID   bigint,AcademicYear  varchar(10),month smallint,date_day smallint,attendance smallint, dates date);

create index if not exists c3_student_attendance_month ON c3_student_attendance(month);
create index if not exists c3_student_attendance_School ON c3_student_attendance(SchoolId);

/*c3_lat_long_all*/

create table if not exists c3_lat_long_all(Id bigint primary key not null,
Latitude   float,
Longitude float,segment varchar(10));

create index if not exists c3_ind_lat_long_all ON c3_lat_long_all(segment);

/*c3_school_master*/

create table if not exists c3_school_master(Id int,
SchoolId bigint ,
School varchar(100),
DistrictId bigint,
BlockId bigint,
ClusterId bigint,
VillageId bigint,
StateId varchar(50),
DistrictName varchar(50),
blockName varchar(50)
);

create index if not exists c3_school_master_district ON c3_school_master(DistrictId);
create index if not exists c3_school_master_block ON c3_school_master(BlockId);
create index if not exists c3_school_master_cluster ON c3_school_master(ClusterId);
create index if not exists c3_school_master_village ON c3_school_master(VillageId);

/*c3_agg_column_chart*/

create table if not exists c3_agg_column_chart(batch_id int,
chart_id int,
chart_name varchar(100),
x_axis varchar(20),
x_value varchar(20),
y_axis varchar(20),
y_value varchar(20),
z_axis varchar(20),
z_value varchar(20),
created_on timestamp with time zone,
updated_on timestamp with time zone);

create index if not exists c3_agg_col_batch_id on c3_agg_column_chart(batch_id);

create index if not exists c3_agg_col_chart_id on c3_agg_column_chart(chart_id);

/*c3_agg_attributes_chart*/

create table if not exists c3_agg_attributes_chart(batch_id int,
chart_id int,
chart_name varchar(100),
attribute_name varchar(50),
attribute_value varchar(50),
created_on timestamp with time zone,
updated_on timestamp with time zone);

create index if not exists c3_agg_att_batch_id on c3_agg_attributes_chart(batch_id);

create index if not exists c3_agg_att_chart_id on c3_agg_attributes_chart(chart_id);

/*is_date function*/

create or replace function is_date(s varchar) returns int as $$
begin
  perform s::date;
  return 1;
exception when others then
  return 0;
end;
$$ language plpgsql;

