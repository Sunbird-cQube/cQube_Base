/*******************************************************************************************************************************************************************************/

/* c3_mst_board */

create table if not exists c3_mst_board(board_id  int primary key not null,
board_code  varchar(30),
board_name  varchar(100),
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone);

create index if not exists c3_mst_board_id on c3_mst_board(board_id);

/* c3_mst_subjects */

create table if not exists c3_mst_subjects(subject_id int primary key not null,
subject_code varchar(30),
board_id   int,
subject_class   int,
subject_name   varchar(30),
academic_year   int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (board_id) references c3_mst_board(board_id));

create index if not exists c3_mst_subjects_id on c3_mst_subjects(subject_id);

/* c3_mst_assessment */

create table if not exists c3_mst_assessment(assessment_id bigint primary key not null,
board_id int,
assessment_name  varchar(50),
assessment_type  varchar(50),
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (board_id) references c3_mst_board(board_id));

create index if not exists c3_mst_assessment_id on c3_mst_assessment(assessment_id);

/* c3_mst_state */

create table if not exists c3_mst_state(state_id  int primary key not null,
state_name  varchar(50),
state_code  int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone);

create index if not exists c3_mst_state_id on c3_mst_state(state_id);

/* c3_mst_region */

create table if not exists c3_mst_region(region_id int primary key not null,
region_name  varchar(50),
region_code  varchar(50),
state_id  int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (state_id) references c3_mst_state(state_id));

create index if not exists c3_mst_region_id on c3_mst_region(region_id);

/* c3_mst_district */

create table if not exists c3_mst_district(district_id  int primary key not null,
district_name  varchar(50),
district_code  varchar(50),
state_id  int,
region_id  int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (state_id) references c3_mst_state(state_id),
foreign key (region_id) references c3_mst_region(region_id));

create index if not exists c3_mst_district_id on c3_mst_district(district_id);

/* c3_mst_block */

create table if not exists c3_mst_block(block_id int primary key not null,
block_name varchar(50),
region_id  int,
district_id  int,
state_id  int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (state_id) references c3_mst_state(state_id),
foreign key (region_id) references c3_mst_region(region_id),
foreign key (district_id) references c3_mst_district(district_id));

create index if not exists c3_mst_block_id on c3_mst_block(block_id);

/* c3_mst_cluster */

create table if not exists c3_mst_cluster(clusterId  int primary key not null,
cluster_name  varchar(50),
block_id  int,
district_id  int,
state_id  int,
region_id  int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (state_id) references c3_mst_state(state_id),
foreign key (region_id) references c3_mst_region(region_id),
foreign key (block_id) references c3_mst_block(block_id),
foreign key (district_id) references c3_mst_district(district_id));

create index if not exists c3_mst_clusterId on c3_mst_cluster(clusterId);

/* c3_mst_town */

create table if not exists c3_mst_town(town_id int primary key not null,
town_name  varchar(50),
state_id  int,
region_id  int,
district_id  int,
clusterId  int,
block_id  int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (state_id) references c3_mst_state(state_id),
foreign key (region_id) references c3_mst_region(region_id),
foreign key (district_id) references c3_mst_district(district_id),
foreign key (block_id) references c3_mst_block(block_id),
foreign key (clusterId) references c3_mst_cluster(clusterId));

create index if not exists c3_mst_town_id on c3_mst_town(town_id);

/* c3_mst_city */

create table if not exists c3_mst_city(city_id int primary key not null,
city_name varchar(50),
state_id  int,
region_id  int,
district_id  int,
clusterId  int,
block_id  int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (state_id) references c3_mst_state(state_id),
foreign key (region_id) references c3_mst_region(region_id),
foreign key (district_id) references c3_mst_district(district_id),
foreign key (block_id) references c3_mst_block(block_id),
foreign key (clusterId) references c3_mst_cluster(clusterId));

/* c3_mst_village */

create table if not exists c3_mst_village(village_id int primary key not null,
village_name  varchar(50),
state_id  int,
region_id  int,
district_id  int,
clusterId  int,
block_id  int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (state_id) references c3_mst_state(state_id),
foreign key (region_id) references c3_mst_region(region_id),
foreign key (district_id) references c3_mst_district(district_id),
foreign key (block_id) references c3_mst_block(block_id),
foreign key (clusterId) references c3_mst_cluster(clusterId));

create index if not exists c3_mst_village_id on c3_mst_village(village_id);

/* c3_mst_school_category */

create table if not exists c3_mst_school_category(school_category_id int primary key not null,
school_category_name varchar(30),
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone);

create index if not exists c3_mst_school_category_id on c3_mst_school_category(school_category_id);

/* c3_mst_school_details */

create table if not exists c3_mst_school_details(school_id bigint primary key not null,
school_name varchar(100),
school_established_date date,
category_id int,
board_id int,
school_lowest_class int,
school_highest_class int,
school_address_1 text,
school_address_2 text,
school_area varchar(50),
school_state int,
school_district int,
school_region int,
school_village int,
school_zipcode int,
school_primary_contact bigint,
school_secondary_contact bigint,
school_email_contact varchar(50),
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (school_state) references c3_mst_state(state_id),
foreign key (school_district) references c3_mst_district(district_id),
foreign key (school_region) references c3_mst_region(region_id),
foreign key (school_village) references c3_mst_village(village_id),
foreign key (category_id) references c3_mst_school_category(school_category_id),
foreign key (board_id) references c3_mst_board(board_id));

create index if not exists c3_mst_school_details_id on c3_mst_school_details(school_id);

/* c3_mst_student_details */

create table if not exists c3_mst_student_details(student_id  bigint primary key not null,
school_student_id  bigint,
school_id  bigint,
student_first_name  varchar(30),
student_middle_name  varchar(30),
student_last_name  varchar(30),
student_father_name  varchar(50),
student_mother_name  varchar(50),
student_guardian_name  varchar(50),
student_guardian_relationship  varchar(20),
student_gender  smallint,
student_dob  date,
student_aadhar_number  bigint,
student_address_1  text,
student_address_2  text,
student_area  varchar(50),
student_state int,
student_region int,
student_district  int,
student_city  int,
student_town  int,
student_zipcode  int,
student_primary_contact  bigint,
student_secondary_contact  bigint,
student_primary_contact_email  varchar(50),
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (student_state) references c3_mst_state(state_id),
foreign key (student_district) references c3_mst_district(district_id),
foreign key (student_region) references c3_mst_region(region_id),
foreign key (student_city) references c3_mst_city(city_id),
foreign key (student_town) references c3_mst_town(town_id));

create index if not exists c3_mst_student_details_id on c3_mst_student_details(student_id, school_student_id);

/* c3_mst_teacher_details */

create table if not exists c3_mst_teacher_details(teacher_id bigint primary key not null,
school_id  bigint,
teacher_first_name varchar(30),
teacher_middle_name varchar(30),
teacher_last_name varchar(30),
teacher_father_name varchar(30),
teacher_mother_name varchar(30),
teacher_guardian_name varchar(50),
teacher_guardian_relationship varchar(30),
teacher_gender smallint,
teacher_dob date,
teacher_experience int,
teacher_aadhar_number bigint,
teacher_address_1 text,
teacher_address_2 text,
teacher_area varchar(50),
teacher_district int,
teacher_city int,
teacher_town int,
teacher_state int,
teacher_zipcode int,
teacher_primary_contact bigint,
teacher_secondary_contact bigint,
teacher_primary_contact_email varchar(50),
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (school_id) references c3_mst_school_details(school_id),
foreign key (teacher_state) references c3_mst_state(state_id),
foreign key (teacher_district) references c3_mst_district(district_id),
foreign key (teacher_city) references c3_mst_city(city_id),
foreign key (teacher_town) references c3_mst_town(town_id));

/* c3_mst_subject_category */

create table if not exists c3_mst_subject_category(category_id  int primary key not null,
category_type  varchar(50),
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone);

create index if not exists c3_mst_subject_category_id on c3_mst_subject_category(category_id);

/* c3_cr_teacher_school_subject */

create table if not exists c3_cr_teacher_school_subject(serial_number bigint primary key not null,
teacher_id bigint,
school_id bigint,
subject_id int,
category_id int,
foreign key (teacher_id) references c3_mst_teacher_details(teacher_id),
foreign key (school_id) references c3_mst_school_details(school_id),
foreign key (subject_id) references c3_mst_subjects(subject_id),
foreign key (category_id) references c3_mst_subject_category(category_id));

/* c3_mst_teacher_qualification */

create table if not exists c3_mst_teacher_qualification(qualification_id int primary key not null,
qualification_name varchar(30),
board_id int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (board_id) references c3_mst_board(board_id));

create index if not exists c3_mst_teacher_qualification_id on c3_mst_teacher_qualification(qualification_id);

/* c3_mst_teacher_institute */

create table if not exists c3_mst_teacher_institute(institute_id int primary key not null,
institute_name varchar(100),
state_id int,
region_id int,
district_id int,
village_id int,
institute_zipcode int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (state_id) references c3_mst_state(state_id),
foreign key (region_id) references c3_mst_region(region_id),
foreign key (district_id) references c3_mst_district(district_id),
foreign key (village_id) references c3_mst_village(village_id));

create index if not exists c3_mst_teacher_institute_id on c3_mst_teacher_institute(institute_id);

/* c3_cr_teacher_qualification */

create table if not exists c3_cr_teacher_qualification(qualification_id int primary key not null,
teacher_id bigint,
institute_id int,
foreign key (teacher_id) references c3_mst_teacher_details(teacher_id),
foreign key (qualification_id) references c3_mst_teacher_qualification(qualification_id),
foreign key (institute_id) references c3_mst_teacher_institute(institute_id));

create index if not exists c3_cr_teacher_qualification_id on c3_cr_teacher_qualification(qualification_id);

/* c3_student_attendance */

create table if not exists c3_student_attendance(serial_id bigint primary key not null,
school_id   bigint,
student_id bigint,
student_school_id   bigint,
academic_year   date,
gender smallint,
month  smallint,
day_1   smallint,
day_2   smallint,
day_3   smallint,
day_4   smallint,
day_5   smallint,
day_6   smallint,
day_7   smallint,
day_8   smallint,
day_9   smallint,
day_10   smallint,
day_11   smallint,
day_12   smallint,
day_13   smallint,
day_14   smallint,
day_15   smallint,
day_16   smallint,
day_17   smallint,
day_18   smallint,
day_19   smallint,
day_20   smallint,
day_21   smallint,
day_22   smallint,
day_23   smallint,
day_24   smallint,
day_25   smallint,
day_26   smallint,
day_27   smallint,
day_28   smallint,
day_29   smallint,
day_30   smallint,
day_31   smallint,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (student_id) references c3_mst_student_details(student_id),
foreign key (school_id) references c3_mst_school_details(school_id));

create index if not exists c3_student_attendance_id on c3_student_attendance(serial_id,student_id,school_id);

/* c3_teacher_attendance */

create table if not exists c3_teacher_attendance(serial_id   bigint primary key not null,
teacher_id   bigint,
teacher_name   varchar(50),
school_id   bigint,
academic_year   smallint,
gender  smallint,
month   smallint,
day_1   smallint,
day_2   smallint,
day_3   smallint,
day_4   smallint,
day_5   smallint,
day_6   smallint,
day_7   smallint,
day_8   smallint,
day_9   smallint,
day_10   smallint,
day_11   smallint,
day_12   smallint,
day_13   smallint,
day_14   smallint,
day_15   smallint,
day_16   smallint,
day_17   smallint,
day_18   smallint,
day_19   smallint,
day_20   smallint,
day_21   smallint,
day_22   smallint,
day_23   smallint,
day_24   smallint,
day_25   smallint,
day_26   smallint,
day_27   smallint,
day_28   smallint,
day_29   smallint,
day_30   smallint,
day_31   smallint,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (teacher_id) references c3_mst_teacher_details(teacher_id),
foreign key (school_id) references c3_mst_school_details(school_id));

create index if not exists c3_teacher_attendance_id on c3_teacher_attendance(serial_id,teacher_id,school_id);

/* c3_student_assessment */

create table if not exists c3_student_assessment(serial_id  bigint primary key not null,
assessment_id   bigint,
academic_year   int,
student_class   smallint,
school_id   bigint,
student_school_id   bigint,
student_id bigint,
assessment_date   int,
subject_id   int,
total_marks   int,
marks_scored   int,
created_on  timestamp with  time zone,
updated_on  timestamp with  time zone,
foreign key (assessment_id) references c3_mst_assessment(assessment_id),
foreign key (school_id) references c3_mst_school_details(school_id),
foreign key (student_id) references c3_mst_student_details(student_id),
foreign key (subject_id) references c3_mst_subjects(subject_id));

create index if not exists c3_student_assessment_id on c3_student_assessment(serial_id);

/* partition tables */
/* c3_student_attendance */

create table if not exists c3_student_attendance_y01m01(check( academic_year >= 2019 and academic_year <2020 and month=1)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m02(check( academic_year >= 2019 and academic_year <2020 and month=2)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m03(check( academic_year >= 2019 and academic_year <2020 and month=3)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m04(check( academic_year >= 2019 and academic_year <2020 and month=4)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m05(check( academic_year >= 2019 and academic_year <2020 and month=5)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m06(check( academic_year >= 2019 and academic_year <2020 and month=6)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m07(check( academic_year >= 2019 and academic_year <2020 and month=7)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m08(check( academic_year >= 2019 and academic_year <2020 and month=8)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m09(check( academic_year >= 2019 and academic_year <2020 and month=9)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m10(check( academic_year >= 2019 and academic_year <2020 and month=10)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m11(check( academic_year >= 2019 and academic_year <2020 and month=11)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y01m12(check( academic_year >= 2019 and academic_year <2020 and month=12)) inherits (c3_student_attendance);

create table if not exists c3_student_attendance_y02m01(check( academic_year >= 2020 and academic_year <2021 and month=1)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m02(check( academic_year >= 2020 and academic_year <2021 and month=2)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m03(check( academic_year >= 2020 and academic_year <2021 and month=3)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m04(check( academic_year >= 2020 and academic_year <2021 and month=4)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m05(check( academic_year >= 2020 and academic_year <2021 and month=5)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m06(check( academic_year >= 2020 and academic_year <2021 and month=6)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m07(check( academic_year >= 2020 and academic_year <2021 and month=7)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m08(check( academic_year >= 2020 and academic_year <2021 and month=8)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m09(check( academic_year >= 2020 and academic_year <2021 and month=9)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m10(check( academic_year >= 2020 and academic_year <2021 and month=10)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m11(check( academic_year >= 2020 and academic_year <2021 and month=11)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y02m12(check( academic_year >= 2020 and academic_year <2021 and month=12)) inherits (c3_student_attendance);

create table if not exists c3_student_attendance_y03m01(check( academic_year >= 2021 and academic_year <2022 and month=1)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m02(check( academic_year >= 2021 and academic_year <2022 and month=2)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m03(check( academic_year >= 2021 and academic_year <2022 and month=3)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m04(check( academic_year >= 2021 and academic_year <2022 and month=4)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m05(check( academic_year >= 2021 and academic_year <2022 and month=5)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m06(check( academic_year >= 2021 and academic_year <2022 and month=6)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m07(check( academic_year >= 2021 and academic_year <2022 and month=7)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m08(check( academic_year >= 2021 and academic_year <2022 and month=8)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m09(check( academic_year >= 2021 and academic_year <2022 and month=9)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m10(check( academic_year >= 2021 and academic_year <2022 and month=10)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m11(check( academic_year >= 2021 and academic_year <2022 and month=11)) inherits (c3_student_attendance);
create table if not exists c3_student_attendance_y03m12(check( academic_year >= 2021 and academic_year <2022 and month=12)) inherits (c3_student_attendance);

create index if not exists c3_student_attendance_y01m01_academic_year ON c3_student_attendance_y01m01 (academic_year);
create index if not exists c3_student_attendance_y01m01_month ON c3_student_attendance_y01m01 (month);

create index if not exists c3_student_attendance_y01m02_academic_year ON c3_student_attendance_y01m02 (academic_year);
create index if not exists c3_student_attendance_y01m02_month ON c3_student_attendance_y01m02 (month);

create index if not exists c3_student_attendance_y01m03_academic_year ON c3_student_attendance_y01m03 (academic_year);
create index if not exists c3_student_attendance_y01m03_month ON c3_student_attendance_y01m03 (month);

create index if not exists c3_student_attendance_y01m04_academic_year ON c3_student_attendance_y01m04 (academic_year);
create index if not exists c3_student_attendance_y01m04_month ON c3_student_attendance_y01m04 (month);

create index if not exists c3_student_attendance_y01m05_academic_year ON c3_student_attendance_y01m05 (academic_year);
create index if not exists c3_student_attendance_y01m05_month ON c3_student_attendance_y01m05 (month);

create index if not exists c3_student_attendance_y01m06_academic_year ON c3_student_attendance_y01m06 (academic_year);
create index if not exists c3_student_attendance_y01m06_month ON c3_student_attendance_y01m06 (month);

create index if not exists c3_student_attendance_y01m07_academic_year ON c3_student_attendance_y01m07 (academic_year);
create index if not exists c3_student_attendance_y01m07_month ON c3_student_attendance_y01m07 (month);

create index if not exists c3_student_attendance_y01m08_academic_year ON c3_student_attendance_y01m08 (academic_year);
create index if not exists c3_student_attendance_y01m08_month ON c3_student_attendance_y01m08 (month);

create index if not exists c3_student_attendance_y01m09_academic_year ON c3_student_attendance_y01m09 (academic_year);
create index if not exists c3_student_attendance_y01m09_month ON c3_student_attendance_y01m09 (month);

create index if not exists c3_student_attendance_y01m10_academic_year ON c3_student_attendance_y01m10 (academic_year);
create index if not exists c3_student_attendance_y01m10_month ON c3_student_attendance_y01m10 (month);

create index if not exists c3_student_attendance_y01m11_academic_year ON c3_student_attendance_y01m11 (academic_year);
create index if not exists c3_student_attendance_y01m11_month ON c3_student_attendance_y01m11 (month);

create index if not exists c3_student_attendance_y01m12_academic_year ON c3_student_attendance_y01m12 (academic_year);
create index if not exists c3_student_attendance_y01m12_month ON c3_student_attendance_y01m12 (month);

create index if not exists c3_student_attendance_y02m01_academic_year ON c3_student_attendance_y02m01 (academic_year);
create index if not exists c3_student_attendance_y02m01_month ON c3_student_attendance_y02m01 (month);

create index if not exists c3_student_attendance_y02m02_academic_year ON c3_student_attendance_y02m02 (academic_year);
create index if not exists c3_student_attendance_y02m02_month ON c3_student_attendance_y02m02 (month);

create index if not exists c3_student_attendance_y02m03_academic_year ON c3_student_attendance_y02m03 (academic_year);
create index if not exists c3_student_attendance_y02m03_month ON c3_student_attendance_y02m03 (month);

create index if not exists c3_student_attendance_y02m04_academic_year ON c3_student_attendance_y02m04 (academic_year);
create index if not exists c3_student_attendance_y02m04_month ON c3_student_attendance_y02m04 (month);

create index if not exists c3_student_attendance_y02m05_academic_year ON c3_student_attendance_y02m05 (academic_year);
create index if not exists c3_student_attendance_y02m05_month ON c3_student_attendance_y02m05 (month);

create index if not exists c3_student_attendance_y02m06_academic_year ON c3_student_attendance_y02m06 (academic_year);
create index if not exists c3_student_attendance_y02m06_month ON c3_student_attendance_y02m06 (month);

create index if not exists c3_student_attendance_y02m07_academic_year ON c3_student_attendance_y02m07 (academic_year);
create index if not exists c3_student_attendance_y02m07_month ON c3_student_attendance_y02m07 (month);

create index if not exists c3_student_attendance_y02m08_academic_year ON c3_student_attendance_y02m08 (academic_year);
create index if not exists c3_student_attendance_y02m08_month ON c3_student_attendance_y02m08 (month);

create index if not exists c3_student_attendance_y02m09_academic_year ON c3_student_attendance_y02m09 (academic_year);
create index if not exists c3_student_attendance_y02m09_month ON c3_student_attendance_y02m09 (month);

create index if not exists c3_student_attendance_y02m10_academic_year ON c3_student_attendance_y02m10 (academic_year);
create index if not exists c3_student_attendance_y02m10_month ON c3_student_attendance_y02m10 (month);

create index if not exists c3_student_attendance_y02m11_academic_year ON c3_student_attendance_y02m11 (academic_year);
create index if not exists c3_student_attendance_y02m11_month ON c3_student_attendance_y02m11 (month);

create index if not exists c3_student_attendance_y02m12_academic_year ON c3_student_attendance_y02m12 (academic_year);
create index if not exists c3_student_attendance_y02m12_month ON c3_student_attendance_y02m12 (month);

create index if not exists c3_student_attendance_y03m01_academic_year ON c3_student_attendance_y03m01 (academic_year);
create index if not exists c3_student_attendance_y03m01_month ON c3_student_attendance_y03m01 (month);

create index if not exists c3_student_attendance_y03m02_academic_year ON c3_student_attendance_y03m02 (academic_year);
create index if not exists c3_student_attendance_y03m02_month ON c3_student_attendance_y03m02 (month);

create index if not exists c3_student_attendance_y03m03_academic_year ON c3_student_attendance_y03m03 (academic_year);
create index if not exists c3_student_attendance_y03m03_month ON c3_student_attendance_y03m03 (month);

create index if not exists c3_student_attendance_y03m04_academic_year ON c3_student_attendance_y03m04 (academic_year);
create index if not exists c3_student_attendance_y03m04_month ON c3_student_attendance_y03m04 (month);

create index if not exists c3_student_attendance_y03m05_academic_year ON c3_student_attendance_y03m05 (academic_year);
create index if not exists c3_student_attendance_y03m05_month ON c3_student_attendance_y03m05 (month);

create index if not exists c3_student_attendance_y03m06_academic_year ON c3_student_attendance_y03m06 (academic_year);
create index if not exists c3_student_attendance_y03m06_month ON c3_student_attendance_y03m06 (month);

create index if not exists c3_student_attendance_y03m07_academic_year ON c3_student_attendance_y03m07 (academic_year);
create index if not exists c3_student_attendance_y03m07_month ON c3_student_attendance_y03m07 (month);

create index if not exists c3_student_attendance_y03m08_academic_year ON c3_student_attendance_y03m08 (academic_year);
create index if not exists c3_student_attendance_y03m08_month ON c3_student_attendance_y03m08 (month);

create index if not exists c3_student_attendance_y03m09_academic_year ON c3_student_attendance_y03m09 (academic_year);
create index if not exists c3_student_attendance_y03m09_month ON c3_student_attendance_y03m09 (month);

create index if not exists c3_student_attendance_y03m10_academic_year ON c3_student_attendance_y03m10 (academic_year);
create index if not exists c3_student_attendance_y03m10_month ON c3_student_attendance_y03m10 (month);

create index if not exists c3_student_attendance_y03m11_academic_year ON c3_student_attendance_y03m11 (academic_year);
create index if not exists c3_student_attendance_y03m11_month ON c3_student_attendance_y03m11 (month);

create index if not exists c3_student_attendance_y03m12_academic_year ON c3_student_attendance_y03m12 (academic_year);
create index if not exists c3_student_attendance_y03m12_month ON c3_student_attendance_y03m12 (month);

/* c3_teacher_attendance */

/* c3_teacher_attendance */

create table if not exists c3_teacher_attendance_y01m01(check( academic_year >= 2019 and academic_year <2020 and month=1)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m02(check( academic_year >= 2019 and academic_year <2020 and month=2)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m03(check( academic_year >= 2019 and academic_year <2020 and month=3)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m04(check( academic_year >= 2019 and academic_year <2020 and month=4)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m05(check( academic_year >= 2019 and academic_year <2020 and month=5)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m06(check( academic_year >= 2019 and academic_year <2020 and month=6)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m07(check( academic_year >= 2019 and academic_year <2020 and month=7)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m08(check( academic_year >= 2019 and academic_year <2020 and month=8)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m09(check( academic_year >= 2019 and academic_year <2020 and month=9)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m10(check( academic_year >= 2019 and academic_year <2020 and month=10)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m11(check( academic_year >= 2019 and academic_year <2020 and month=11)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y01m12(check( academic_year >= 2019 and academic_year <2020 and month=12)) inherits (c3_teacher_attendance);

create table if not exists c3_teacher_attendance_y02m01(check( academic_year >= 2020 and academic_year <2021 and month=1)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m02(check( academic_year >= 2020 and academic_year <2021 and month=2)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m03(check( academic_year >= 2020 and academic_year <2021 and month=3)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m04(check( academic_year >= 2020 and academic_year <2021 and month=4)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m05(check( academic_year >= 2020 and academic_year <2021 and month=5)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m06(check( academic_year >= 2020 and academic_year <2021 and month=6)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m07(check( academic_year >= 2020 and academic_year <2021 and month=7)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m08(check( academic_year >= 2020 and academic_year <2021 and month=8)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m09(check( academic_year >= 2020 and academic_year <2021 and month=9)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m10(check( academic_year >= 2020 and academic_year <2021 and month=10)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m11(check( academic_year >= 2020 and academic_year <2021 and month=11)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y02m12(check( academic_year >= 2020 and academic_year <2021 and month=12)) inherits (c3_teacher_attendance);

create table if not exists c3_teacher_attendance_y03m01(check( academic_year >= 2021 and academic_year <2022 and month=1)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m02(check( academic_year >= 2021 and academic_year <2022 and month=2)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m03(check( academic_year >= 2021 and academic_year <2022 and month=3)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m04(check( academic_year >= 2021 and academic_year <2022 and month=4)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m05(check( academic_year >= 2021 and academic_year <2022 and month=5)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m06(check( academic_year >= 2021 and academic_year <2022 and month=6)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m07(check( academic_year >= 2021 and academic_year <2022 and month=7)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m08(check( academic_year >= 2021 and academic_year <2022 and month=8)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m09(check( academic_year >= 2021 and academic_year <2022 and month=9)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m10(check( academic_year >= 2021 and academic_year <2022 and month=10)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m11(check( academic_year >= 2021 and academic_year <2022 and month=11)) inherits (c3_teacher_attendance);
create table if not exists c3_teacher_attendance_y03m12(check( academic_year >= 2021 and academic_year <2022 and month=12)) inherits (c3_teacher_attendance);

create index if not exists c3_teacher_attendance_y01m01_academic_year ON c3_teacher_attendance_y01m01 (academic_year);
create index if not exists c3_teacher_attendance_y01m01_month ON c3_teacher_attendance_y01m01 (month);

create index if not exists c3_teacher_attendance_y01m02_academic_year ON c3_teacher_attendance_y01m02 (academic_year);
create index if not exists c3_teacher_attendance_y01m02_month ON c3_teacher_attendance_y01m02 (month);

create index if not exists c3_teacher_attendance_y01m03_academic_year ON c3_teacher_attendance_y01m03 (academic_year);
create index if not exists c3_teacher_attendance_y01m03_month ON c3_teacher_attendance_y01m03 (month);

create index if not exists c3_teacher_attendance_y01m04_academic_year ON c3_teacher_attendance_y01m04 (academic_year);
create index if not exists c3_teacher_attendance_y01m04_month ON c3_teacher_attendance_y01m04 (month);

create index if not exists c3_teacher_attendance_y01m05_academic_year ON c3_teacher_attendance_y01m05 (academic_year);
create index if not exists c3_teacher_attendance_y01m05_month ON c3_teacher_attendance_y01m05 (month);

create index if not exists c3_teacher_attendance_y01m06_academic_year ON c3_teacher_attendance_y01m06 (academic_year);
create index if not exists c3_teacher_attendance_y01m06_month ON c3_teacher_attendance_y01m06 (month);

create index if not exists c3_teacher_attendance_y01m07_academic_year ON c3_teacher_attendance_y01m07 (academic_year);
create index if not exists c3_teacher_attendance_y01m07_month ON c3_teacher_attendance_y01m07 (month);

create index if not exists c3_teacher_attendance_y01m08_academic_year ON c3_teacher_attendance_y01m08 (academic_year);
create index if not exists c3_teacher_attendance_y01m08_month ON c3_teacher_attendance_y01m08 (month);

create index if not exists c3_teacher_attendance_y01m09_academic_year ON c3_teacher_attendance_y01m09 (academic_year);
create index if not exists c3_teacher_attendance_y01m09_month ON c3_teacher_attendance_y01m09 (month);

create index if not exists c3_teacher_attendance_y01m10_academic_year ON c3_teacher_attendance_y01m10 (academic_year);
create index if not exists c3_teacher_attendance_y01m10_month ON c3_teacher_attendance_y01m10 (month);

create index if not exists c3_teacher_attendance_y01m11_academic_year ON c3_teacher_attendance_y01m11 (academic_year);
create index if not exists c3_teacher_attendance_y01m11_month ON c3_teacher_attendance_y01m11 (month);

create index if not exists c3_teacher_attendance_y01m12_academic_year ON c3_teacher_attendance_y01m12 (academic_year);
create index if not exists c3_teacher_attendance_y01m12_month ON c3_teacher_attendance_y01m12 (month);

create index if not exists c3_teacher_attendance_y02m01_academic_year ON c3_teacher_attendance_y02m01 (academic_year);
create index if not exists c3_teacher_attendance_y02m01_month ON c3_teacher_attendance_y02m01 (month);

create index if not exists c3_teacher_attendance_y02m02_academic_year ON c3_teacher_attendance_y02m02 (academic_year);
create index if not exists c3_teacher_attendance_y02m02_month ON c3_teacher_attendance_y02m02 (month);

create index if not exists c3_teacher_attendance_y02m03_academic_year ON c3_teacher_attendance_y02m03 (academic_year);
create index if not exists c3_teacher_attendance_y02m03_month ON c3_teacher_attendance_y02m03 (month);

create index if not exists c3_teacher_attendance_y02m04_academic_year ON c3_teacher_attendance_y02m04 (academic_year);
create index if not exists c3_teacher_attendance_y02m04_month ON c3_teacher_attendance_y02m04 (month);

create index if not exists c3_teacher_attendance_y02m05_academic_year ON c3_teacher_attendance_y02m05 (academic_year);
create index if not exists c3_teacher_attendance_y02m05_month ON c3_teacher_attendance_y02m05 (month);

create index if not exists c3_teacher_attendance_y02m06_academic_year ON c3_teacher_attendance_y02m06 (academic_year);
create index if not exists c3_teacher_attendance_y02m06_month ON c3_teacher_attendance_y02m06 (month);

create index if not exists c3_teacher_attendance_y02m07_academic_year ON c3_teacher_attendance_y02m07 (academic_year);
create index if not exists c3_teacher_attendance_y02m07_month ON c3_teacher_attendance_y02m07 (month);

create index if not exists c3_teacher_attendance_y02m08_academic_year ON c3_teacher_attendance_y02m08 (academic_year);
create index if not exists c3_teacher_attendance_y02m08_month ON c3_teacher_attendance_y02m08 (month);

create index if not exists c3_teacher_attendance_y02m09_academic_year ON c3_teacher_attendance_y02m09 (academic_year);
create index if not exists c3_teacher_attendance_y02m09_month ON c3_teacher_attendance_y02m09 (month);

create index if not exists c3_teacher_attendance_y02m10_academic_year ON c3_teacher_attendance_y02m10 (academic_year);
create index if not exists c3_teacher_attendance_y02m10_month ON c3_teacher_attendance_y02m10 (month);

create index if not exists c3_teacher_attendance_y02m11_academic_year ON c3_teacher_attendance_y02m11 (academic_year);
create index if not exists c3_teacher_attendance_y02m11_month ON c3_teacher_attendance_y02m11 (month);

create index if not exists c3_teacher_attendance_y02m12_academic_year ON c3_teacher_attendance_y02m12 (academic_year);
create index if not exists c3_teacher_attendance_y02m12_month ON c3_teacher_attendance_y02m12 (month);

create index if not exists c3_teacher_attendance_y03m01_academic_year ON c3_teacher_attendance_y03m01 (academic_year);
create index if not exists c3_teacher_attendance_y03m01_month ON c3_teacher_attendance_y03m01 (month);

create index if not exists c3_teacher_attendance_y03m02_academic_year ON c3_teacher_attendance_y03m02 (academic_year);
create index if not exists c3_teacher_attendance_y03m02_month ON c3_teacher_attendance_y03m02 (month);

create index if not exists c3_teacher_attendance_y03m03_academic_year ON c3_teacher_attendance_y03m03 (academic_year);
create index if not exists c3_teacher_attendance_y03m03_month ON c3_teacher_attendance_y03m03 (month);

create index if not exists c3_teacher_attendance_y03m04_academic_year ON c3_teacher_attendance_y03m04 (academic_year);
create index if not exists c3_teacher_attendance_y03m04_month ON c3_teacher_attendance_y03m04 (month);

create index if not exists c3_teacher_attendance_y03m05_academic_year ON c3_teacher_attendance_y03m05 (academic_year);
create index if not exists c3_teacher_attendance_y03m05_month ON c3_teacher_attendance_y03m05 (month);

create index if not exists c3_teacher_attendance_y03m06_academic_year ON c3_teacher_attendance_y03m06 (academic_year);
create index if not exists c3_teacher_attendance_y03m06_month ON c3_teacher_attendance_y03m06 (month);

create index if not exists c3_teacher_attendance_y03m07_academic_year ON c3_teacher_attendance_y03m07 (academic_year);
create index if not exists c3_teacher_attendance_y03m07_month ON c3_teacher_attendance_y03m07 (month);

create index if not exists c3_teacher_attendance_y03m08_academic_year ON c3_teacher_attendance_y03m08 (academic_year);
create index if not exists c3_teacher_attendance_y03m08_month ON c3_teacher_attendance_y03m08 (month);

create index if not exists c3_teacher_attendance_y03m09_academic_year ON c3_teacher_attendance_y03m09 (academic_year);
create index if not exists c3_teacher_attendance_y03m09_month ON c3_teacher_attendance_y03m09 (month);

create index if not exists c3_teacher_attendance_y03m10_academic_year ON c3_teacher_attendance_y03m10 (academic_year);
create index if not exists c3_teacher_attendance_y03m10_month ON c3_teacher_attendance_y03m10 (month);

create index if not exists c3_teacher_attendance_y03m11_academic_year ON c3_teacher_attendance_y03m11 (academic_year);
create index if not exists c3_teacher_attendance_y03m11_month ON c3_teacher_attendance_y03m11 (month);

create index if not exists c3_teacher_attendance_y03m12_academic_year ON c3_teacher_attendance_y03m12 (academic_year);
create index if not exists c3_teacher_attendance_y03m12_month ON c3_teacher_attendance_y03m12 (month);

/*******************************************************************************************************************************************************************************/
