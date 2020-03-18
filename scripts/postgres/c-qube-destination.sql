/*******************************************************************************************************************************************************************************/

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


/*c3_trf_teacher_attendance*/
create table if not exists c3_trf_teacher_attendance(serial_id bigint primary key not null,
school_id bigint,
teacher_id bigint,
gender smallint,
academic_year int,
month smallint,
day_month smallint,
created_on timestamp with  time zone,
updated_on timestamp with  time zone);

create index if not exists c3_trf_tch_school_id on c3_trf_teacher_attendance(school_id);

create index if not exists c3_trf_tch_teacher_id on c3_trf_teacher_attendance(teacher_id);

create index if not exists c3_trf_tch_month on c3_trf_teacher_attendance(month);


/*c3_trf_student_attendance*/
create table if not exists c3_trf_student_attendance(serial_id bigint primary key not null,
school_id bigint,
student_id bigint,
student_school_id bigint,
gender smallint,
academic_year int,
month smallint,
day_month smallint,
created_on timestamp with  time zone,
updated_on timestamp with  time zone);

create index if not exists c3_trf_stu_school_id on c3_trf_student_attendance(school_id);

create index if not exists c3_trf_stu_student_id on c3_trf_student_attendance(student_id);

create index if not exists c3_trf_stu_month on c3_trf_student_attendance(month);


/* Partition tables for period of three years*/

/* c3_trf_student_attendance */

create table if not exists c3_part_student_attendance_y01m01(check( academic_year >= 2019 and academic_year <2020 and month=1)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m02(check( academic_year >= 2019 and academic_year <2020 and month=2)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m03(check( academic_year >= 2019 and academic_year <2020 and month=3)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m04(check( academic_year >= 2019 and academic_year <2020 and month=4)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m05(check( academic_year >= 2019 and academic_year <2020 and month=5)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m06(check( academic_year >= 2019 and academic_year <2020 and month=6)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m07(check( academic_year >= 2019 and academic_year <2020 and month=7)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m08(check( academic_year >= 2019 and academic_year <2020 and month=8)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m09(check( academic_year >= 2019 and academic_year <2020 and month=9)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m10(check( academic_year >= 2019 and academic_year <2020 and month=10)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m11(check( academic_year >= 2019 and academic_year <2020 and month=11)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y01m12(check( academic_year >= 2019 and academic_year <2020 and month=12)) inherits (c3_trf_student_attendance);

create table if not exists c3_part_student_attendance_y02m01(check( academic_year >= 2020 and academic_year <2021 and month=1)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m02(check( academic_year >= 2020 and academic_year <2021 and month=2)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m03(check( academic_year >= 2020 and academic_year <2021 and month=3)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m04(check( academic_year >= 2020 and academic_year <2021 and month=4)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m05(check( academic_year >= 2020 and academic_year <2021 and month=5)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m06(check( academic_year >= 2020 and academic_year <2021 and month=6)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m07(check( academic_year >= 2020 and academic_year <2021 and month=7)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m08(check( academic_year >= 2020 and academic_year <2021 and month=8)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m09(check( academic_year >= 2020 and academic_year <2021 and month=9)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m10(check( academic_year >= 2020 and academic_year <2021 and month=10)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m11(check( academic_year >= 2020 and academic_year <2021 and month=11)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y02m12(check( academic_year >= 2020 and academic_year <2021 and month=12)) inherits (c3_trf_student_attendance);

create table if not exists c3_part_student_attendance_y03m01(check( academic_year >= 2021 and academic_year <2022 and month=1)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m02(check( academic_year >= 2021 and academic_year <2022 and month=2)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m03(check( academic_year >= 2021 and academic_year <2022 and month=3)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m04(check( academic_year >= 2021 and academic_year <2022 and month=4)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m05(check( academic_year >= 2021 and academic_year <2022 and month=5)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m06(check( academic_year >= 2021 and academic_year <2022 and month=6)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m07(check( academic_year >= 2021 and academic_year <2022 and month=7)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m08(check( academic_year >= 2021 and academic_year <2022 and month=8)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m09(check( academic_year >= 2021 and academic_year <2022 and month=9)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m10(check( academic_year >= 2021 and academic_year <2022 and month=10)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m11(check( academic_year >= 2021 and academic_year <2022 and month=11)) inherits (c3_trf_student_attendance);
create table if not exists c3_part_student_attendance_y03m12(check( academic_year >= 2021 and academic_year <2022 and month=12)) inherits (c3_trf_student_attendance);

create index if not exists c3_part_student_attendance_y01m01_academic_year ON c3_part_student_attendance_y01m01 (academic_year);
create index if not exists c3_part_student_attendance_y01m01_month ON c3_part_student_attendance_y01m01 (month);

create index if not exists c3_part_student_attendance_y01m02_academic_year ON c3_part_student_attendance_y01m02 (academic_year);
create index if not exists c3_part_student_attendance_y01m02_month ON c3_part_student_attendance_y01m02 (month);

create index if not exists c3_part_student_attendance_y01m03_academic_year ON c3_part_student_attendance_y01m03 (academic_year);
create index if not exists c3_part_student_attendance_y01m03_month ON c3_part_student_attendance_y01m03 (month);

create index if not exists c3_part_student_attendance_y01m04_academic_year ON c3_part_student_attendance_y01m04 (academic_year);
create index if not exists c3_part_student_attendance_y01m04_month ON c3_part_student_attendance_y01m04 (month);

create index if not exists c3_part_student_attendance_y01m05_academic_year ON c3_part_student_attendance_y01m05 (academic_year);
create index if not exists c3_part_student_attendance_y01m05_month ON c3_part_student_attendance_y01m05 (month);

create index if not exists c3_part_student_attendance_y01m06_academic_year ON c3_part_student_attendance_y01m06 (academic_year);
create index if not exists c3_part_student_attendance_y01m06_month ON c3_part_student_attendance_y01m06 (month);

create index if not exists c3_part_student_attendance_y01m07_academic_year ON c3_part_student_attendance_y01m07 (academic_year);
create index if not exists c3_part_student_attendance_y01m07_month ON c3_part_student_attendance_y01m07 (month);

create index if not exists c3_part_student_attendance_y01m08_academic_year ON c3_part_student_attendance_y01m08 (academic_year);
create index if not exists c3_part_student_attendance_y01m08_month ON c3_part_student_attendance_y01m08 (month);

create index if not exists c3_part_student_attendance_y01m09_academic_year ON c3_part_student_attendance_y01m09 (academic_year);
create index if not exists c3_part_student_attendance_y01m09_month ON c3_part_student_attendance_y01m09 (month);

create index if not exists c3_part_student_attendance_y01m10_academic_year ON c3_part_student_attendance_y01m10 (academic_year);
create index if not exists c3_part_student_attendance_y01m10_month ON c3_part_student_attendance_y01m10 (month);

create index if not exists c3_part_student_attendance_y01m11_academic_year ON c3_part_student_attendance_y01m11 (academic_year);
create index if not exists c3_part_student_attendance_y01m11_month ON c3_part_student_attendance_y01m11 (month);

create index if not exists c3_part_student_attendance_y01m12_academic_year ON c3_part_student_attendance_y01m12 (academic_year);
create index if not exists c3_part_student_attendance_y01m12_month ON c3_part_student_attendance_y01m12 (month);

create index if not exists c3_part_student_attendance_y02m01_academic_year ON c3_part_student_attendance_y02m01 (academic_year);
create index if not exists c3_part_student_attendance_y02m01_month ON c3_part_student_attendance_y02m01 (month);

create index if not exists c3_part_student_attendance_y02m02_academic_year ON c3_part_student_attendance_y02m02 (academic_year);
create index if not exists c3_part_student_attendance_y02m02_month ON c3_part_student_attendance_y02m02 (month);

create index if not exists c3_part_student_attendance_y02m03_academic_year ON c3_part_student_attendance_y02m03 (academic_year);
create index if not exists c3_part_student_attendance_y02m03_month ON c3_part_student_attendance_y02m03 (month);

create index if not exists c3_part_student_attendance_y02m04_academic_year ON c3_part_student_attendance_y02m04 (academic_year);
create index if not exists c3_part_student_attendance_y02m04_month ON c3_part_student_attendance_y02m04 (month);

create index if not exists c3_part_student_attendance_y02m05_academic_year ON c3_part_student_attendance_y02m05 (academic_year);
create index if not exists c3_part_student_attendance_y02m05_month ON c3_part_student_attendance_y02m05 (month);

create index if not exists c3_part_student_attendance_y02m06_academic_year ON c3_part_student_attendance_y02m06 (academic_year);
create index if not exists c3_part_student_attendance_y02m06_month ON c3_part_student_attendance_y02m06 (month);

create index if not exists c3_part_student_attendance_y02m07_academic_year ON c3_part_student_attendance_y02m07 (academic_year);
create index if not exists c3_part_student_attendance_y02m07_month ON c3_part_student_attendance_y02m07 (month);

create index if not exists c3_part_student_attendance_y02m08_academic_year ON c3_part_student_attendance_y02m08 (academic_year);
create index if not exists c3_part_student_attendance_y02m08_month ON c3_part_student_attendance_y02m08 (month);

create index if not exists c3_part_student_attendance_y02m09_academic_year ON c3_part_student_attendance_y02m09 (academic_year);
create index if not exists c3_part_student_attendance_y02m09_month ON c3_part_student_attendance_y02m09 (month);

create index if not exists c3_part_student_attendance_y02m10_academic_year ON c3_part_student_attendance_y02m10 (academic_year);
create index if not exists c3_part_student_attendance_y02m10_month ON c3_part_student_attendance_y02m10 (month);

create index if not exists c3_part_student_attendance_y02m11_academic_year ON c3_part_student_attendance_y02m11 (academic_year);
create index if not exists c3_part_student_attendance_y02m11_month ON c3_part_student_attendance_y02m11 (month);

create index if not exists c3_part_student_attendance_y02m12_academic_year ON c3_part_student_attendance_y02m12 (academic_year);
create index if not exists c3_part_student_attendance_y02m12_month ON c3_part_student_attendance_y02m12 (month);

create index if not exists c3_part_student_attendance_y03m01_academic_year ON c3_part_student_attendance_y03m01 (academic_year);
create index if not exists c3_part_student_attendance_y03m01_month ON c3_part_student_attendance_y03m01 (month);

create index if not exists c3_part_student_attendance_y03m02_academic_year ON c3_part_student_attendance_y03m02 (academic_year);
create index if not exists c3_part_student_attendance_y03m02_month ON c3_part_student_attendance_y03m02 (month);

create index if not exists c3_part_student_attendance_y03m03_academic_year ON c3_part_student_attendance_y03m03 (academic_year);
create index if not exists c3_part_student_attendance_y03m03_month ON c3_part_student_attendance_y03m03 (month);

create index if not exists c3_part_student_attendance_y03m04_academic_year ON c3_part_student_attendance_y03m04 (academic_year);
create index if not exists c3_part_student_attendance_y03m04_month ON c3_part_student_attendance_y03m04 (month);

create index if not exists c3_part_student_attendance_y03m05_academic_year ON c3_part_student_attendance_y03m05 (academic_year);
create index if not exists c3_part_student_attendance_y03m05_month ON c3_part_student_attendance_y03m05 (month);

create index if not exists c3_part_student_attendance_y03m06_academic_year ON c3_part_student_attendance_y03m06 (academic_year);
create index if not exists c3_part_student_attendance_y03m06_month ON c3_part_student_attendance_y03m06 (month);

create index if not exists c3_part_student_attendance_y03m07_academic_year ON c3_part_student_attendance_y03m07 (academic_year);
create index if not exists c3_part_student_attendance_y03m07_month ON c3_part_student_attendance_y03m07 (month);

create index if not exists c3_part_student_attendance_y03m08_academic_year ON c3_part_student_attendance_y03m08 (academic_year);
create index if not exists c3_part_student_attendance_y03m08_month ON c3_part_student_attendance_y03m08 (month);

create index if not exists c3_part_student_attendance_y03m09_academic_year ON c3_part_student_attendance_y03m09 (academic_year);
create index if not exists c3_part_student_attendance_y03m09_month ON c3_part_student_attendance_y03m09 (month);

create index if not exists c3_part_student_attendance_y03m10_academic_year ON c3_part_student_attendance_y03m10 (academic_year);
create index if not exists c3_part_student_attendance_y03m10_month ON c3_part_student_attendance_y03m10 (month);

create index if not exists c3_part_student_attendance_y03m11_academic_year ON c3_part_student_attendance_y03m11 (academic_year);
create index if not exists c3_part_student_attendance_y03m11_month ON c3_part_student_attendance_y03m11 (month);

create index if not exists c3_part_student_attendance_y03m12_academic_year ON c3_part_student_attendance_y03m12 (academic_year);
create index if not exists c3_part_student_attendance_y03m12_month ON c3_part_student_attendance_y03m12 (month);

/* c3_trf_teacher_attendance */

create table if not exists c3_part_teacher_attendance_y01m01(check( academic_year >= 2019 and academic_year <2020 and month=1)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m02(check( academic_year >= 2019 and academic_year <2020 and month=2)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m03(check( academic_year >= 2019 and academic_year <2020 and month=3)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m04(check( academic_year >= 2019 and academic_year <2020 and month=4)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m05(check( academic_year >= 2019 and academic_year <2020 and month=5)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m06(check( academic_year >= 2019 and academic_year <2020 and month=6)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m07(check( academic_year >= 2019 and academic_year <2020 and month=7)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m08(check( academic_year >= 2019 and academic_year <2020 and month=8)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m09(check( academic_year >= 2019 and academic_year <2020 and month=9)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m10(check( academic_year >= 2019 and academic_year <2020 and month=10)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m11(check( academic_year >= 2019 and academic_year <2020 and month=11)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y01m12(check( academic_year >= 2019 and academic_year <2020 and month=12)) inherits (c3_trf_teacher_attendance);

create table if not exists c3_part_teacher_attendance_y02m01(check( academic_year >= 2020 and academic_year <2021 and month=1)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m02(check( academic_year >= 2020 and academic_year <2021 and month=2)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m03(check( academic_year >= 2020 and academic_year <2021 and month=3)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m04(check( academic_year >= 2020 and academic_year <2021 and month=4)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m05(check( academic_year >= 2020 and academic_year <2021 and month=5)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m06(check( academic_year >= 2020 and academic_year <2021 and month=6)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m07(check( academic_year >= 2020 and academic_year <2021 and month=7)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m08(check( academic_year >= 2020 and academic_year <2021 and month=8)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m09(check( academic_year >= 2020 and academic_year <2021 and month=9)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m10(check( academic_year >= 2020 and academic_year <2021 and month=10)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m11(check( academic_year >= 2020 and academic_year <2021 and month=11)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y02m12(check( academic_year >= 2020 and academic_year <2021 and month=12)) inherits (c3_trf_teacher_attendance);

create table if not exists c3_part_teacher_attendance_y03m01(check( academic_year >= 2021 and academic_year <2022 and month=1)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m02(check( academic_year >= 2021 and academic_year <2022 and month=2)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m03(check( academic_year >= 2021 and academic_year <2022 and month=3)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m04(check( academic_year >= 2021 and academic_year <2022 and month=4)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m05(check( academic_year >= 2021 and academic_year <2022 and month=5)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m06(check( academic_year >= 2021 and academic_year <2022 and month=6)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m07(check( academic_year >= 2021 and academic_year <2022 and month=7)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m08(check( academic_year >= 2021 and academic_year <2022 and month=8)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m09(check( academic_year >= 2021 and academic_year <2022 and month=9)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m10(check( academic_year >= 2021 and academic_year <2022 and month=10)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m11(check( academic_year >= 2021 and academic_year <2022 and month=11)) inherits (c3_trf_teacher_attendance);
create table if not exists c3_part_teacher_attendance_y03m12(check( academic_year >= 2021 and academic_year <2022 and month=12)) inherits (c3_trf_teacher_attendance);

create index if not exists c3_part_teacher_attendance_y01m01_academic_year ON c3_part_teacher_attendance_y01m01 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m01_month ON c3_part_teacher_attendance_y01m01 (month);

create index if not exists c3_part_teacher_attendance_y01m02_academic_year ON c3_part_teacher_attendance_y01m02 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m02_month ON c3_part_teacher_attendance_y01m02 (month);

create index if not exists c3_part_teacher_attendance_y01m03_academic_year ON c3_part_teacher_attendance_y01m03 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m03_month ON c3_part_teacher_attendance_y01m03 (month);

create index if not exists c3_part_teacher_attendance_y01m04_academic_year ON c3_part_teacher_attendance_y01m04 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m04_month ON c3_part_teacher_attendance_y01m04 (month);

create index if not exists c3_part_teacher_attendance_y01m05_academic_year ON c3_part_teacher_attendance_y01m05 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m05_month ON c3_part_teacher_attendance_y01m05 (month);

create index if not exists c3_part_teacher_attendance_y01m06_academic_year ON c3_part_teacher_attendance_y01m06 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m06_month ON c3_part_teacher_attendance_y01m06 (month);

create index if not exists c3_part_teacher_attendance_y01m07_academic_year ON c3_part_teacher_attendance_y01m07 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m07_month ON c3_part_teacher_attendance_y01m07 (month);

create index if not exists c3_part_teacher_attendance_y01m08_academic_year ON c3_part_teacher_attendance_y01m08 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m08_month ON c3_part_teacher_attendance_y01m08 (month);

create index if not exists c3_part_teacher_attendance_y01m09_academic_year ON c3_part_teacher_attendance_y01m09 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m09_month ON c3_part_teacher_attendance_y01m09 (month);

create index if not exists c3_part_teacher_attendance_y01m10_academic_year ON c3_part_teacher_attendance_y01m10 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m10_month ON c3_part_teacher_attendance_y01m10 (month);

create index if not exists c3_part_teacher_attendance_y01m11_academic_year ON c3_part_teacher_attendance_y01m11 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m11_month ON c3_part_teacher_attendance_y01m11 (month);

create index if not exists c3_part_teacher_attendance_y01m12_academic_year ON c3_part_teacher_attendance_y01m12 (academic_year);
create index if not exists c3_part_teacher_attendance_y01m12_month ON c3_part_teacher_attendance_y01m12 (month);

create index if not exists c3_part_teacher_attendance_y02m01_academic_year ON c3_part_teacher_attendance_y02m01 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m01_month ON c3_part_teacher_attendance_y02m01 (month);

create index if not exists c3_part_teacher_attendance_y02m02_academic_year ON c3_part_teacher_attendance_y02m02 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m02_month ON c3_part_teacher_attendance_y02m02 (month);

create index if not exists c3_part_teacher_attendance_y02m03_academic_year ON c3_part_teacher_attendance_y02m03 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m03_month ON c3_part_teacher_attendance_y02m03 (month);

create index if not exists c3_part_teacher_attendance_y02m04_academic_year ON c3_part_teacher_attendance_y02m04 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m04_month ON c3_part_teacher_attendance_y02m04 (month);

create index if not exists c3_part_teacher_attendance_y02m05_academic_year ON c3_part_teacher_attendance_y02m05 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m05_month ON c3_part_teacher_attendance_y02m05 (month);

create index if not exists c3_part_teacher_attendance_y02m06_academic_year ON c3_part_teacher_attendance_y02m06 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m06_month ON c3_part_teacher_attendance_y02m06 (month);

create index if not exists c3_part_teacher_attendance_y02m07_academic_year ON c3_part_teacher_attendance_y02m07 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m07_month ON c3_part_teacher_attendance_y02m07 (month);

create index if not exists c3_part_teacher_attendance_y02m08_academic_year ON c3_part_teacher_attendance_y02m08 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m08_month ON c3_part_teacher_attendance_y02m08 (month);

create index if not exists c3_part_teacher_attendance_y02m09_academic_year ON c3_part_teacher_attendance_y02m09 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m09_month ON c3_part_teacher_attendance_y02m09 (month);

create index if not exists c3_part_teacher_attendance_y02m10_academic_year ON c3_part_teacher_attendance_y02m10 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m10_month ON c3_part_teacher_attendance_y02m10 (month);

create index if not exists c3_part_teacher_attendance_y02m11_academic_year ON c3_part_teacher_attendance_y02m11 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m11_month ON c3_part_teacher_attendance_y02m11 (month);

create index if not exists c3_part_teacher_attendance_y02m12_academic_year ON c3_part_teacher_attendance_y02m12 (academic_year);
create index if not exists c3_part_teacher_attendance_y02m12_month ON c3_part_teacher_attendance_y02m12 (month);

create index if not exists c3_part_teacher_attendance_y03m01_academic_year ON c3_part_teacher_attendance_y03m01 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m01_month ON c3_part_teacher_attendance_y03m01 (month);

create index if not exists c3_part_teacher_attendance_y03m02_academic_year ON c3_part_teacher_attendance_y03m02 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m02_month ON c3_part_teacher_attendance_y03m02 (month);

create index if not exists c3_part_teacher_attendance_y03m03_academic_year ON c3_part_teacher_attendance_y03m03 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m03_month ON c3_part_teacher_attendance_y03m03 (month);

create index if not exists c3_part_teacher_attendance_y03m04_academic_year ON c3_part_teacher_attendance_y03m04 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m04_month ON c3_part_teacher_attendance_y03m04 (month);

create index if not exists c3_part_teacher_attendance_y03m05_academic_year ON c3_part_teacher_attendance_y03m05 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m05_month ON c3_part_teacher_attendance_y03m05 (month);

create index if not exists c3_part_teacher_attendance_y03m06_academic_year ON c3_part_teacher_attendance_y03m06 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m06_month ON c3_part_teacher_attendance_y03m06 (month);

create index if not exists c3_part_teacher_attendance_y03m07_academic_year ON c3_part_teacher_attendance_y03m07 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m07_month ON c3_part_teacher_attendance_y03m07 (month);

create index if not exists c3_part_teacher_attendance_y03m08_academic_year ON c3_part_teacher_attendance_y03m08 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m08_month ON c3_part_teacher_attendance_y03m08 (month);

create index if not exists c3_part_teacher_attendance_y03m09_academic_year ON c3_part_teacher_attendance_y03m09 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m09_month ON c3_part_teacher_attendance_y03m09 (month);

create index if not exists c3_part_teacher_attendance_y03m10_academic_year ON c3_part_teacher_attendance_y03m10 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m10_month ON c3_part_teacher_attendance_y03m10 (month);

create index if not exists c3_part_teacher_attendance_y03m11_academic_year ON c3_part_teacher_attendance_y03m11 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m11_month ON c3_part_teacher_attendance_y03m11 (month);

create index if not exists c3_part_teacher_attendance_y03m12_academic_year ON c3_part_teacher_attendance_y03m12 (academic_year);
create index if not exists c3_part_teacher_attendance_y03m12_month ON c3_part_teacher_attendance_y03m12 (month);

/*******************************************************************************************************************************************************************************/
