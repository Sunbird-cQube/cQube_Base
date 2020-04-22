/* from student_attendance_trans to school_student_total_attendance*/

select '1200' as student_attendance_id,ll.year,ll.month,ll.school_id,hr.school_name,
ll.school_latitude,ll.school_longitude,ll.district_id,hr.district_name,ll.district_latitude,
ll.district_longitude,ll.block_id,hr.block_name,'NA' as brc_name,ll.block_latitude,ll.block_longitude,ll.cluster_id,
hr.cluster_name,hr.crc_name,ll.cluster_latitude,ll.cluster_longitude,ll.village_id,hr.village_name,
ll.village_latitude,ll.village_longitude,'24' as state_id,'Gujarat' as state_name,
cast(ll.present_sum as int) as total_present,cast(ll.total_absent as int)as total_absent,cast(ll.working_days as int) as total_working_days,ll.student_count

from (select at.present_sum,at.working_days-at.present_sum as total_absent,at.working_days,at.month,at.year,at.student_count,at.school_id,
sg.school_latitude,sg.school_longitude,sg.district_id,sg.district_latitude,sg.district_longitude,sg.block_id,sg.block_latitude,sg.block_longitude,
sg.cluster_id,sg.cluster_latitude,sg.cluster_longitude,sg.village_id,sg.village_latitude,sg.village_longitude
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
,school_id,month,year,count(distinct(student_id)) as student_count
from student_attendance_trans group by school_id,year,month) as at left join school_geo_master as sg on at.school_id=sg.school_id) as ll left join 
school_hierarchy_details as hr on ll.school_id=hr.school_id


/* from crc location_trans to crc visit frequency */

	select a.crc_location_master_id,a.inspection_id,a.school_id,upper(b.school_name)as school_name,b.district_id,upper(b.district_name)as district_name,b.block_id,
	upper(b.block_name)as block_name,b.cluster_id,
	upper(b.cluster_name)as cluster_name ,upper(b.crc_name)as crc_name,
	a.in_school_location,
	a.created_on as visited_on,now() as created_on,
    cast(substr(cast(a.created_on as varchar(25)),6,2) as int) as month,
    cast(substr(cast(a.created_on as varchar(25)),1,4) as int) as year
	from crc_location_trans as a left join school_hierarchy_details as b on a.school_id=b.school_id
	where a.school_id<>0 and a.inspection_id<>0



/*Aggreation queries attendance */

/* meta data table */

select count(distinct(district_id)) as total_districts, count(distinct(block_id))as total_blocks, count(distinct(cluster_id))as total_clusters,
       count(distinct(village_id)) as total_villagess, count(distinct(school_id))as total_schools, cast(sum(student_count)/count(distinct(month)) as int)as total_students
       ,data_from_date(min(year),min(month)),data_upto_date(max(year),max(month)) from school_student_total_attendance;


--district

select district_id as x_axis,upper(district_name) as district_name,
round(sum(total_present)*100.0/sum(total_working_days),1)as x_value,'latitude' as y_axis,district_latitude as y_value,'longitude' as z_axis,district_longitude as z_value,
sum(student_count) as students_count,count(distinct(school_id)) as total_schools,data_from_date(min(year),
	(select min(month) from school_student_total_attendance group by year having year=min(year))
	),data_upto_date(max(year),
	(select max(month) from school_student_total_attendance group by year having year=max(year))
	) 
from school_student_total_attendance where district_name is not null and school_latitude <>0 and school_latitude is not null
group by district_id,district_latitude,district_longitude,district_name


--block

select block_id as x_axis,upper(block_name) as block_name,district_id,upper(district_name) as district_name,
round(sum(total_present)*100.0/sum(total_working_days),1)as x_value,'latitude' as y_axis,block_latitude as y_value,'longitude' as z_axis,block_longitude as z_value,
sum(student_count) as students_count,count(distinct(school_id)) as total_schools,data_from_date(min(year),
	(select min(month) from school_student_total_attendance group by year having year=min(year))
	),data_upto_date(max(year),
	(select max(month) from school_student_total_attendance group by year having year=max(year))
	) 
from school_student_total_attendance where block_name is not null and block_latitude is not null and block_latitude <> 0 and school_latitude <>0 and school_latitude is not null
group by block_id,block_name,block_latitude,block_longitude,district_id,district_name

--cluster

select cluster_id as x_axis,upper(cluster_name) as cluster_name,upper(crc_name) as crc_name,district_id,upper(district_name) as district_name,block_id,upper(block_name) as block_name,
round(sum(total_present)*100.0/sum(total_working_days),1)as x_value,'latitude' as y_axis,cluster_latitude as y_value,'longitude' as z_axis,cluster_longitude as z_value,
sum(student_count) as students_count,count(distinct(school_id)) as total_schools,data_from_date(min(year),
	(select min(month) from school_student_total_attendance group by year having year=min(year))
	),data_upto_date(max(year),
	(select max(month) from school_student_total_attendance group by year having year=max(year))
	) 
from school_student_total_attendance where cluster_latitude is not null and cluster_latitude <> 0 and crc_name is not null and school_latitude <>0 and school_latitude is not null
group by cluster_id,cluster_name,crc_name,cluster_latitude,cluster_longitude,block_id,block_name,district_id,district_name


--school

select school_id as x_axis,upper(school_name) as school_name,district_id,upper(district_name) as district_name,block_id,upper(block_name)as block_name,cluster_id,
upper(cluster_name) as cluster_name,upper(crc_name)as crc_name,
round(sum(total_present)*100.0/sum(total_working_days),1)as x_value,'latitude' as y_axis,school_latitude as y_value,'longitude' as z_axis,school_longitude as z_value,
sum(student_count) as students_count,data_from_date(min(year),
 (select min(month) from school_student_total_attendance group by year having year=min(year))
 ),data_upto_date(max(year),
 (select max(month) from school_student_total_attendance group by year having year=max(year))
 ) 
from school_student_total_attendance where school_latitude is not null and school_latitude <> 0 and school_name is not null
group by school_id,school_name,crc_name,school_latitude,school_longitude,year,month,cluster_id,cluster_name,crc_name,block_id,block_name,district_id,district_name


/*Aggreation queries CRC visits */

/* meta data table */

select count(distinct(district_id)) as total_districts, count(distinct(block_id))as total_blocks, count(distinct(cluster_id))as total_clusters,
        count(distinct(school_id))as total_schools, sum(visits)as total_visits
       ,data_from_date(min(year),min(month)),data_upto_date(max(year),max(month)) from crc_visits_frequency;

# crc bar charts freq visits

select b.school_id,a.school_name,a.visits,b.district_id,b.district_name,b.block_id,b.block_name,b.cluster_id,b.cluster_name,b.crc_name
 from
(select school_name,count(in_school_location) as visits
    from crc_visits_frequency where in_school_location='t' and month = 9 and school_name is not null group by school_name)as a
left join school_hierarchy_details as b on a.school_name=b.school_name
order by district_name,block_name,cluster_name





select b.school_id,a.school_name,a.visits,b.district_id,b.district_name,b.block_id,b.block_name,b.cluster_id,b.cluster_name,b.crc_name
 from
(select school_name,count(in_school_location) as visits
    from crc_visits_frequency where in_school_location='t' and month = 9 and school_name is not null group by school_name)as a
left join school_hierarchy_details as b on a.school_name=b.school_name
order by district_name,block_name,cluster_name





------------------------------------------------------------------------------------------------------------
----average and rounding the student count

--- district

select district_id as x_axis,upper(district_name) as district_name,
round(sum(total_present)*100.0/sum(total_working_days),1)as x_value,'latitude' as y_axis,district_latitude as y_value,'longitude' as z_axis,district_longitude as z_value,
cast(sum(student_count)/count(distinct(month)) as int) as students_count,count(distinct(school_id)) as total_schools,data_from_date(min(year),
	(select min(month) from school_student_total_attendance group by year having year=min(year))
	),data_upto_date(max(year),
	(select max(month) from school_student_total_attendance group by year having year=max(year))
	) 
from school_student_total_attendance where district_name is not null and school_latitude <>0 and school_latitude is not null
group by district_id,district_latitude,district_longitude,district_name

--- block

select block_id as x_axis,upper(block_name) as block_name,district_id,upper(district_name) as district_name,
round(sum(total_present)*100.0/sum(total_working_days),1)as x_value,'latitude' as y_axis,block_latitude as y_value,'longitude' as z_axis,block_longitude as z_value,
cast(sum(student_count)/count(distinct(month)) as int) as students_count,count(distinct(school_id)) as total_schools,data_from_date(min(year),
	(select min(month) from school_student_total_attendance group by year having year=min(year))
	),data_upto_date(max(year),
	(select max(month) from school_student_total_attendance group by year having year=max(year))
	) 
from school_student_total_attendance where block_name is not null and block_latitude is not null and block_latitude <> 0 and school_latitude <>0 and school_latitude is not null
group by block_id,block_name,block_latitude,block_longitude,district_id,district_name

--cluster

select cluster_id as x_axis,upper(cluster_name) as cluster_name,upper(crc_name) as crc_name,district_id,upper(district_name) as district_name,block_id,upper(block_name) as block_name,
round(sum(total_present)*100.0/sum(total_working_days),1)as x_value,'latitude' as y_axis,cluster_latitude as y_value,'longitude' as z_axis,cluster_longitude as z_value,
cast(sum(student_count)/count(distinct(month)) as int) as students_count,count(distinct(school_id)) as total_schools,data_from_date(min(year),
	(select min(month) from school_student_total_attendance group by year having year=min(year))
	),data_upto_date(max(year),
	(select max(month) from school_student_total_attendance group by year having year=max(year))
	) 
from school_student_total_attendance where cluster_latitude is not null and cluster_latitude <> 0 and crc_name is not null and school_latitude <>0 and school_latitude is not null
group by cluster_id,cluster_name,crc_name,cluster_latitude,cluster_longitude,block_id,block_name,district_id,district_name


--school

select school_id as x_axis,upper(school_name) as school_name,district_id,upper(district_name) as district_name,block_id,upper(block_name)as block_name,cluster_id,
upper(cluster_name) as cluster_name,upper(crc_name)as crc_name,
round(sum(total_present)*100.0/sum(total_working_days),1)as x_value,'latitude' as y_axis,school_latitude as y_value,'longitude' as z_axis,school_longitude as z_value,
cast(sum(student_count)/count(distinct(month)) as int) as students_count,data_from_date(min(year),
 (select min(month) from school_student_total_attendance group by year having year=min(year))
 ),data_upto_date(max(year),
 (select max(month) from school_student_total_attendance group by year having year=max(year))
 ) 
from school_student_total_attendance where school_latitude is not null and school_latitude <> 0 and school_name is not null
group by school_id,school_name,crc_name,school_latitude,school_longitude,year,month,cluster_id,cluster_name,crc_name,block_id,block_name,district_id,district_name




---- crc

select b.school_id,a.school_name,a.visits,b.district_id,b.district_name,b.block_id,b.block_name,b.cluster_id,b.cluster_name,b.crc_name
 from
(select school_name,count(in_school_location) as visits
    from crc_visits_frequency where in_school_location='t' and month = 9 and school_name is not null group by school_name)as a
left join school_hierarchy_details as b on a.school_name=b.school_name
order by district_name,block_name,cluster_name