create table c3_student_attendance(serial_id   bigint,school_id   bigint,student_school_id   bigint,academic_year   date,month   smallint,day_1   smallint,day_2   smallint,day_3   smallint,day_4   smallint,day_5   smallint,day_6   smallint,day_7   smallint,day_8   smallint,day_9   smallint,day_10   smallint,day_11   smallint,day_12   smallint,day_13   smallint,day_14   smallint,day_15   smallint,day_16   smallint,day_17   smallint,day_18   smallint,day_19   smallint,day_20   smallint,day_21   smallint,day_22   smallint,day_23   smallint,day_24   smallint,day_25   smallint,day_26   smallint,day_27   smallint,day_28   smallint,day_29   smallint,day_30   smallint,day_31   smallint,date_created   date,date_updated   date,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_teacher_attendance(serial_id   bigint,teacher_id   bigint,teacher_name   varchar(50),school_id   bigint,academic_year   int,month   smallint,day_1   smallint,day_2   smallint,day_3   smallint,day_4   smallint,day_5   smallint,day_6   smallint,day_7   smallint,day_8   smallint,day_9   smallint,day_10   smallint,day_11   smallint,day_12   smallint,day_13   smallint,day_14   smallint,day_15   smallint,day_16   smallint,day_17   smallint,day_18   smallint,day_19   smallint,day_20   smallint,day_21   smallint,day_22   smallint,day_23   smallint,day_24   smallint,day_25   smallint,day_26   smallint,day_27   smallint,day_28   smallint,day_29   smallint,day_30   smallint,day_31   smallint,date_created   date,date_updated   date,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_student_assessment(serial_id   bigint,exam_id   bigint,academic_year   int,standard   smallint,school_id   bigint,student_school_id   bigint,exam_date   int,subject_id   int,total_marks   int,marks_scored   int,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_board(board_id   int, board_code   varchar(30), board_name   varchar(100),created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_subjects(subject_id   int,subject_code   varchar(30),board_id   int,standard   int,subject_name   varchar(30),academic_year   int,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_mst_town(town_id  int, town_name  varchar(50), state_id int, district_id int, region_id  int,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_mst_assessment(assessment_id  int,assessment_name  varchar(50),assessment_type  varchar(50),created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_mst_state(state_id  int,state_name  varchar(50),state_code  int,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_mst_region(region_id int,region_name  varchar(50),region_code  varchar(50),state_id  int,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_mst_village(village_id  int,village_name  varchar(50),state_id  int,region_id  int,district_id  int,cluster_id  int,block_id  int,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_mst_block(block_id  int,block_name  varchar(50),region_id  int,district_id  int,state_id  int,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_mst_cluster(cluster_id  int, cluster_name  varchar(50),block_id  int,district_id  int,state_id  int,region_id  int,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

create table c3_mst_subject_category(subject_category_id  int,subject_category_type  varchar(50), created_on  timestamp with  time zone, updated_on  timestamp with  time zone);

create table c3_mst_district(district_id  int,district_name  varchar(50),district_code  varchar(50),region_id  int,state_id  int,created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

/*c3_mst_student_details*/

create table c3_mst_student_details(student_id  bigint,school_id  bigint,school_student_id  bigint,student_first_name  varchar(30),student_middle_name  varchar(30), student_last_name  varchar(30),student_father_name  varchar(50),student_mother_name  varchar(50),student_guardian_name  varchar(50),student_guardian_relationship  varchar(20),student_gender  smallint,student_dob  date,student_aadhar_number  bigint,student_address_1  text,student_address_2  text,student_area  varchar(50),student_district  smallint,student_city  smallint,student_town  smallint,student_region smallint,student_state  smallint,student_zipcode  smallint,student_primary_contact  bigint,student_secondary_contact  bigint,student_primary_contact_email  varchar(50),created_on  timestamp with  time zone,updated_on  timestamp with  time zone);

/*c3_mst_teacher_details*/

create table c3_mst_teacher_details(teacher_id bigint,teacher_first_name varchar(30),teacher_middle_name varchar(30),teacher_last_name varchar(30),teacher_father_name varchar(30),teacher_mother_name varchar(30),teacher_guardian_name varchar(50),teacher_guardian_relationship varchar(30),teacher_gender smallint,teacher_dob date,teacher_experience smallint,teacher_aadhar_number bigint,teacher_address_1 text,teacher_address_2 text,teacher_area varchar(50),teacher_district smallint,teacher_city smallint,teacher_town smallint,teacher_state smallint,teacher_zipcode smallint,teacher_primary_contact bigint,teacher_secondary_contact bigint,teacher_primary_contact_email varchar(50),created_on timestamp with  time zone,updated_on timestamp with  time zone);


/*c3_mst_school_details*/

create table c3_mst_school_details(school_id bigint,school_name varchar(100),school_established_date date,school_category_id smallint,board_id smallint,school_lowest_class smallint,school_highest_class smallint,school_address_1 text,school_address_2 text,school_area varchar(50),school_state varchar(100),school_district int,school_region int,school_village int,school_zipcode int,school_primary_contact bigint,school_secondary_contact bigint,school_email_contact varchar(50),created_on timestamp with  time zone,updated_on timestamp with  time zone);

/*c3_mst_education_medium*/

create table c3_mst_education_medium(education_medium_id int,education_medium int,created_on timestamp with  time zone,updated_on timestamp with  time zone);

/*c3_mst_school_category*/

create table c3_mst_school_category(school_category_id bigint,school_category_name varchar(30),created_on timestamp with  time zone,updated_on timestamp with  time zone);

/*c3_cr_teacher_school_subject*/

create table c3_cr_teacher_school_subject(serial_number bigint,teacher_id bigint,school_id bigint,subject_id int,subject_category_id bigint);

/*c3_cr_teacher_qualification*/

create table c3_cr_teacher_qualification(serial_numer bigint,teacher_id bigint,qualification_id int,university_id int);

/*c3_mst_teacher_qualification*/

create table c3_mst_teacher_qualification(qualification_id int,qualification_name varchar(30),board_id int,created_on timestamp with  time zone,updated_on timestamp with  time zone);

/*c3_mst_teacher_institute*/

create table c3_mst_teacher_institute(institute_id int,institute_name varchar(100),institute_state int,institute_village int,institute_district int,institute_region int,institute_zipcode int,created_on timestamp with  time zone,updated_on timestamp with  time zone);


