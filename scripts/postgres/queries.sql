 /* from student_attendance_trans to school_student_total_attendance*/

select ll.year,ll.month,ll.school_id,hr.school_name,
ll.school_latitude,ll.school_longitude,ll.district_id,hr.district_name,ll.district_latitude,
ll.district_longitude,ll.block_id,hr.block_name,'NA' as brc_name,ll.block_latitude,ll.block_longitude,ll.cluster_id,
hr.cluster_name,hr.crc_name,ll.cluster_latitude,ll.cluster_longitude,
cast(ll.present_sum as int) as total_present,cast(ll.working_days as int) as total_working_days,ll.students_count

from (select at.present_sum,at.working_days,at.month,at.year,at.students_count,at.school_id,
sg.school_latitude,sg.school_longitude,sg.district_id,sg.district_latitude,sg.district_longitude,sg.block_id,sg.block_latitude,sg.block_longitude,
sg.cluster_id,sg.cluster_latitude,sg.cluster_longitude
 from (select
sum(cast((case when day_1=1 then 1 else 0 end + case when day_2=1 then 1 else 0 end +
case when day_3=1 then 1 else 0 end +
case when day_4=1 then 1 else 0 end +
case when day_5=1 then 1 else 0 end +
case when day_6=1 then 1 else 0 end +
case when day_7=1 then 1 else 0 end +
case when day_8=1 then 1 else 0 end +
case when day_9=1 then 1 else 0 end +
case when day_10=1 then 1 else 0 end +
case when day_11=1 then 1 else 0 end +
case when day_12=1 then 1 else 0 end +
case when day_13=1 then 1 else 0 end +
case when day_14=1 then 1 else 0 end +
case when day_15=1 then 1 else 0 end +
case when day_16=1 then 1 else 0 end +
case when day_17=1 then 1 else 0 end +
case when day_18=1 then 1 else 0 end +
case when day_19=1 then 1 else 0 end +
case when day_20=1 then 1 else 0 end +
case when day_21=1 then 1 else 0 end +
case when day_22=1 then 1 else 0 end +
case when day_23=1 then 1 else 0 end +
case when day_24=1 then 1 else 0 end +
case when day_25=1 then 1 else 0 end +
case when day_26=1 then 1 else 0 end +
case when day_27=1 then 1 else 0 end +
case when day_28=1 then 1 else 0 end +
case when day_29=1 then 1 else 0 end +
case when day_30=1 then 1 else 0 end +
case when day_31=1 then 1 else 0 end) as float)) as present_sum,
sum(cast((case when day_1=2 or day_1=1 then 1 else 0 end +
case when day_2=2 or day_2=1 then 1 else 0 end +
case when day_3=2 or day_3=1 then 1 else 0 end +
case when day_4=2 or day_4=1 then 1 else 0 end +
case when day_5=2 or day_5=1 then 1 else 0 end +
case when day_6=2 or day_6=1 then 1 else 0 end +
case when day_7=2 or day_7=1 then 1 else 0 end +
case when day_8=2 or day_8=1 then 1 else 0 end +
case when day_9=2 or day_9=1 then 1 else 0 end +
case when day_10=2 or day_10=1 then 1 else 0 end +
case when day_11=2 or day_11=1 then 1 else 0 end +
case when day_12=2 or day_12=1 then 1 else 0 end +
case when day_13=2 or day_13=1 then 1 else 0 end +
case when day_14=2 or day_14=1 then 1 else 0 end +
case when day_15=2 or day_15=1 then 1 else 0 end +
case when day_16=2 or day_16=1 then 1 else 0 end +
case when day_17=2 or day_17=1 then 1 else 0 end +
case when day_18=2 or day_18=1 then 1 else 0 end +
case when day_19=2 or day_19=1 then 1 else 0 end +
case when day_20=2 or day_20=1 then 1 else 0 end +
case when day_21=2 or day_21=1 then 1 else 0 end +
case when day_22=2 or day_22=1 then 1 else 0 end +
case when day_23=2 or day_23=1 then 1 else 0 end +
case when day_24=2 or day_24=1 then 1 else 0 end +
case when day_25=2 or day_25=1 then 1 else 0 end +
case when day_26=2 or day_26=1 then 1 else 0 end +
case when day_27=2 or day_27=1 then 1 else 0 end +
case when day_28=2 or day_28=1 then 1 else 0 end +
case when day_29=2 or day_29=1 then 1 else 0 end +
case when day_30=2 or day_30=1 then 1 else 0 end +
case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days
,school_id,month,year,count(distinct(student_id)) as students_count
from student_attendance_trans group by school_id,year,month) as at left join school_geo_master as sg on at.school_id=sg.school_id) as ll left join
school_hierarchy_details as hr on ll.school_id=hr.school_id


/* from crc location_trans to crc visit frequency */select  a.school_id,INITCAP(b.school_name)as school_name,b.district_id,INITCAP(b.district_name)as district_name,b.block_id,
  INITCAP(b.block_name)as block_name,b.cluster_id,
  INITCAP(b.cluster_name)as cluster_name ,INITCAP(b.crc_name)as crc_name,
  sum(cast((case when lower(in_school_location)='true' or in_school_location='t' then 1 else 0 end ) as int)) as visit_count,
  sum(cast((case when lower(in_school_location)='false' or in_school_location='f' then 1 else 0 end ) as int)) as missed_visit_count,
  now() as created_on,
  now() as updated_on,
    a.month,
    a.year
  from crc_location_trans as a left join school_hierarchy_details as b on a.school_id=b.school_id
  where a.school_id<>0 and a.inspection_id<>0
  group by a.school_id,b.school_name,b.district_id,b.district_name,b.block_id,
  b.block_name,b.cluster_id,b.cluster_name,b.crc_name,a.month,a.year



/*Aggreation queries attendance */

/* meta data table */
select count(distinct(district_id)) as total_districts, count(distinct(block_id))as total_blocks, count(distinct(cluster_id))as total_clusters,
       count(distinct(village_id)) as total_villagess, count(distinct(school_id))as total_schools, cast(sum(student_count)/count(distinct(month)) as int)as total_students
       ,data_from_date(min(year),min(month)),data_upto_date(max(year),max(month)) from school_student_total_attendance;


----------------- Attendance report 

--district 

SELECT district_id AS x_axis,INITCAP(district_name) AS district_name, 
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS x_value,'latitude' AS y_axis,district_latitude AS y_value,'longitude' AS z_axis,district_longitude AS z_value,
Sum(student_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,Data_from_date(Min(year),
  (SELECT Min(month) FROM school_student_total_attendance GROUP BY year HAVING year=Min(year)) 
  ),Data_upto_date(Max(year), 
  (SELECT Max(month) FROM school_student_total_attendance GROUP BY year HAVING year=Max(year)) 
  ) 
FROM school_student_total_attendance WHERE district_name IS NOT NULL AND school_latitude <>0 AND school_latitude IS NOT NULL and month = 9
GROUP BY district_id,district_latitude,district_longitude,district_name 


--block

SELECT block_id AS x_axis,INITCAP(block_name) AS block_name,district_id,INITCAP(district_name) AS district_name,
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS x_value,'latitude' AS y_axis,block_latitude AS y_value,'longitude' AS z_axis,block_longitude AS z_value,
Sum(student_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,Data_from_date(Min(year),
  (SELECT Min(month) FROM school_student_total_attendance GROUP BY year HAVING year=Min(year)) 
  ),Data_upto_date(Max(year), 
  (SELECT Max(month) FROM school_student_total_attendance GROUP BY year HAVING year=Max(year)) 
  ) 
FROM school_student_total_attendance WHERE block_name IS NOT NULL AND block_latitude IS NOT NULL AND block_latitude <> 0 AND school_latitude <>0 AND school_latitude IS NOT NULL and month = 9
GROUP BY block_id,block_name,block_latitude,block_longitude,district_id,district_name 

--cluster

SELECT cluster_id AS x_axis,INITCAP(cluster_name) AS cluster_name,INITCAP(crc_name) AS crc_name,district_id,INITCAP(district_name) AS district_name,block_id,INITCAP(block_name) AS block_name,
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS x_value,'latitude' AS y_axis,cluster_latitude AS y_value,'longitude' AS z_axis,cluster_longitude AS z_value,
Sum(student_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,Data_from_date(Min(year),
  (SELECT Min(month) FROM school_student_total_attendance GROUP BY year HAVING year=Min(year)) 
  ),Data_upto_date(Max(year), 
  (SELECT Max(month) FROM school_student_total_attendance GROUP BY year HAVING year=Max(year)) 
  ) 
FROM school_student_total_attendance WHERE cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND crc_name IS NOT NULL AND school_latitude <>0 AND school_latitude IS NOT NULL and month = 9
GROUP BY cluster_id,cluster_name,crc_name,cluster_latitude,cluster_longitude,block_id,block_name,district_id,district_name


--school

SELECT school_id AS x_axis,INITCAP(school_name) AS school_name,district_id,INITCAP(district_name) AS district_name,block_id,INITCAP(block_name)AS block_name,cluster_id,
INITCAP(cluster_name) AS cluster_name,INITCAP(crc_name)AS crc_name, 
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS x_value,'latitude' AS y_axis,school_latitude AS y_value,'longitude' AS z_axis,school_longitude AS z_value,
Sum(student_count) AS students_count,Data_from_date(Min(year), 
 (SELECT Min(month) FROM school_student_total_attendance GROUP BY year HAVING year=Min(year)) 
 ),Data_upto_date(Max(year), 
 (SELECT Max(month) FROM school_student_total_attendance GROUP BY year HAVING year=Max(year)) 
 ) 
FROM school_student_total_attendance WHERE school_latitude IS NOT NULL AND school_latitude <> 0 AND school_name IS NOT NULL and month = 9
GROUP BY school_id,school_name,crc_name,school_latitude,school_longitude,year,month,cluster_id,cluster_name,crc_name,block_id,block_name,district_id,district_name


--------------- CRC visits frequency all data

# crc bar charts freq visits 

SELECT b.school_id,INITCAP(a.school_name),a.visits,b.district_id,INITCAP(b.district_name),b.block_id,INITCAP(b.block_name),b.cluster_id,INITCAP(b.cluster_name),INITCAP(b.crc_name)
 FROM 
(SELECT school_name,Count(in_school_location) AS visits 
    FROM crc_visits_frequency WHERE in_school_location='t' AND month = 9 AND school_name IS NOT NULL GROUP BY school_name)AS a
LEFT JOIN school_hierarchy_details AS b ON a.school_name=b.school_name 
ORDER BY district_name,block_name,cluster_name


# crc bar table charts freq visits 

SELECT school_id, 
       INITCAP(school_name), 
       cluster_id, 
       INITCAP(cluster_name), 
       INITCAP(crc_name), 
       block_id, 
       INITCAP(block_name), 
       district_id, 
       INITCAP(district_name), 
       visit_count, 
       missed_visit_count, 
       month, 
       year 
FROM   crc_visits_frequency 
WHERE  month = 2 
       AND year = 2020 









