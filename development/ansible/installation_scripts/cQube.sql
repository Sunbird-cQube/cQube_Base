create table student_attendance_tmp(school_id int,schoolname varchar(200),student_id int,month varchar(10),day1 smallint,day2 smallint,day3 smallint,day4 smallint,
day5 smallint,day6 smallint,day7 smallint,day8 smallint,day9 smallint,day10 smallint,day11 smallint,day12 smallint,day13 smallint,day14 smallint,day15 smallint,day16 smallint,day17 smallint,day18 smallint,day19 smallint,day20 smallint,day21 smallint,day22 smallint,day23 smallint,day24 smallint,day25 smallint,day26 smallint,day27 smallint,day28 smallint,day29 smallint,day30 smallint,day31 smallint,gender varchar(11));


create table student_attendance(school_id int,schoolname varchar(50),student_id int,month varchar(10),gender varchar(2),Day int,attendance int);


create table agg_column_chart(chart_name varchar(100),x_axis varchar(15),x_value varchar(15),y_axis varchar(15),y_value varchar(15),z_axis varchar(15),z_value varchar(15), attribute_1 varchar(50),attribute_2 varchar(50),attribute_3 varchar(50), created_on TIMESTAMP with time zone default current_timestamp,updated_on TIMESTAMP with time zone default current_timestamp);
