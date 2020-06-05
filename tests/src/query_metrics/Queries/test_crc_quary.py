
class CRC_Query():
    district_wise_crc ="""select initcap(a.district_name) as districtName,a.district_id as districtId,
	 round(cast(cast(count(distinct a.school_id) as float)/cast(count(distinct a.cluster_id)as float)as numeric),2)as no_of_schools_per_crc,
	 
	 round(cast(cast(sum(a.visit_count) as float)/cast(count(a.school_id) as float)as numeric),2) as visits_per_school,
	
	count(distinct(b.school_id)) as totalSchools
	from crc_visits_frequency as a left join school_hierarchy_details as b
	on a.district_id=b.district_id
	where month=3 and a.crc_name is not null 
	group by a.district_id,a.district_name,a.month;"""

    district_wise_percentage ="""select district_id as districtId,initcap(district_name)as districtName,
round(cast(sum(schools_0)*100/nullif(sum(scount),0)as numeric),2)as visit_0,
round(cast(sum(schools_1_2)*100/nullif(sum(scount),0)as numeric),2)as visit_1_2,
round(cast(sum(schools_3_5)*100/nullif(sum(scount),0)as numeric),2)as visit_3_5,
round(cast(sum(schools_6_10)*100/nullif(sum(scount),0)as numeric),2)as visit_6_10,
round(cast(sum(schools_10)*100/nullif(sum(scount),0)as numeric),2)as visit_10_more
from(
select district_id,district_name,visit_count,count(school_id) scount,
case when visit_count<=0 then count(school_id) end as schools_0,
case when visit_count between 1 and 2 then count(school_id) end as schools_1_2,
case when visit_count between 3 and 5 then count(school_id) end as schools_3_5,
case when visit_count between 6 and 10 then count(school_id) end as schools_6_10,
case when visit_count >=10 then count(school_id) end as schools_10
 from crc_visits_frequency
where month=3 and crc_name is not null
group by district_id,district_name,visit_count
) d group by district_id,district_name;"""
    districtwise_visited = """select a.district_id as districtId,initcap(a.district_name) as districtName,
sum(scount)-sum(schools_0)as visited_schools_count,
sum(visits) as total_visits
from 
(select district_id,district_name,visit_count,count(school_id) scount,
cast(case when visit_count<=0 then count(school_id) else 0 end as int) as schools_0,
cast(case when visit_count between 1 and 2 then count(school_id) else 0 end as int) as schools_1_2,
cast(case when visit_count between 3 and 5 then count(school_id) else 0 end as int) as schools_3_5,
cast(case when visit_count between 6 and 10 then count(school_id) else 0 end as int) as schools_6_10,
cast(case when visit_count >=10 then count(school_id) else 0 end as int) as schools_10,
count(school_id)*visit_count as visits
from crc_visits_frequency
where month=3 and crc_name is not null
group by district_id,district_name,visit_count
)as a
group by a.district_id,a.district_name;"""

    blockwise_crc ="""select initcap(a.block_name) as blockName,a.block_id as blockId,
	 round(cast(cast(count(distinct a.school_id) as float)/cast(count(distinct a.cluster_id)as float)as numeric),2)as no_of_schools_per_crc,
	 
	 round(cast(cast(sum(a.visit_count) as float)/cast(count(a.school_id) as float)as numeric),2) as visits_per_school,
	
	count(distinct(b.school_id)) as totalSchools
	from crc_visits_frequency as a left join school_hierarchy_details as b
	on a.block_id=b.block_id
	where month=3 and a.crc_name is not null 
	group by a.block_id,a.block_name,a.month;"""

    blockwise_percentage ="""select block_id as blockId,initcap(block_name) as blockName,
round(cast(sum(schools_0)*100/nullif(sum(scount),0)as numeric),2)as visit_0,
round(cast(sum(schools_1_2)*100/nullif(sum(scount),0)as numeric),2)as visit_1_2,
round(cast(sum(schools_3_5)*100/nullif(sum(scount),0)as numeric),2)as visit_3_5,
round(cast(sum(schools_6_10)*100/nullif(sum(scount),0)as numeric),2)as visit_6_10,
round(cast(sum(schools_10)*100/nullif(sum(scount),0)as numeric),2)as visit_10_more
from(
select block_id,block_name,visit_count,count(school_id) scount,
case when visit_count<=0 then count(school_id) end as schools_0,
case when visit_count between 1 and 2 then count(school_id) end as schools_1_2,
case when visit_count between 3 and 5 then count(school_id) end as schools_3_5,
case when visit_count between 6 and 10 then count(school_id) end as schools_6_10,
case when visit_count >=10 then count(school_id) end as schools_10
 from crc_visits_frequency
where month=3 and crc_name is not null
group by block_id,block_name,visit_count
) d group by block_id,block_name;"""
    blockwise_visited = """select a.block_id as blockId,initcap(a.block_name) as blockName,
sum(scount)-sum(schools_0)as visited_schools_count,
sum(visits) as total_visits
from 
(select block_id,block_name,visit_count,count(school_id) scount,
cast(case when visit_count<=0 then count(school_id) else 0 end as int) as schools_0,
cast(case when visit_count between 1 and 2 then count(school_id) else 0 end as int) as schools_1_2,
cast(case when visit_count between 3 and 5 then count(school_id) else 0 end as int) as schools_3_5,
cast(case when visit_count between 6 and 10 then count(school_id) else 0 end as int) as schools_6_10,
cast(case when visit_count >=10 then count(school_id) else 0 end as int) as schools_10,
count(school_id)*visit_count as visits
 from crc_visits_frequency
where month=3 and crc_name is not null
group by block_id,block_name,visit_count
)as a
group by a.block_id,a.block_name;"""

    clusterwise_crc = """select initcap(a.cluster_name) as clusterName,a.cluster_id as clusterId, 
	 round(cast(cast(count(distinct a.school_id) as float)/cast(count(distinct a.cluster_id)as float)as numeric),2)as no_of_schools_per_crc,
	 
	 round(cast(cast(sum(a.visit_count) as float)/cast(count(a.school_id) as float)as numeric),2) as visits_per_school,
	
	count(distinct(b.school_id)) as totalSchools
	from crc_visits_frequency as a left join school_hierarchy_details as b
	on a.cluster_id=b.cluster_id
	where month=3 and a.crc_name is not null 
	group by a.cluster_id,a.cluster_name,a.month;"""
    clusterwise_percentage ="""select cluster_id as clusterId,initcap(cluster_name) as clusterName,
round(cast(sum(schools_0)*100/nullif(sum(scount),0)as numeric),2)as visit_0,
round(cast(sum(schools_1_2)*100/nullif(sum(scount),0)as numeric),2)as visit_1_2,
round(cast(sum(schools_3_5)*100/nullif(sum(scount),0)as numeric),2)as visit_3_5,
round(cast(sum(schools_6_10)*100/nullif(sum(scount),0)as numeric),2)as visit_6_10,
round(cast(sum(schools_10)*100/nullif(sum(scount),0)as numeric),2)as visit_10_more
from(
select cluster_id,cluster_name,visit_count,count(school_id) scount,
case when visit_count<=0 then count(school_id) end as schools_0,
case when visit_count between 1 and 2 then count(school_id) end as schools_1_2,
case when visit_count between 3 and 5 then count(school_id) end as schools_3_5,
case when visit_count between 6 and 10 then count(school_id) end as schools_6_10,
case when visit_count >=10 then count(school_id) end as schools_10
 from crc_visits_frequency
where month=3 and crc_name is not null
group by cluster_id,cluster_name,visit_count
) d group by cluster_id,cluster_name;"""

    clusterwise_visited = """select a.cluster_id as clusterId,initcap(a.cluster_name) as clusterName,
sum(scount)-sum(schools_0)as visited_schools_count,
sum(visits) as total_visits
from 
(select cluster_id,cluster_name,visit_count,count(school_id) scount,
cast(case when visit_count<=0 then count(school_id) else 0 end as int) as schools_0,
cast(case when visit_count between 1 and 2 then count(school_id) else 0 end as int) as schools_1_2,
cast(case when visit_count between 3 and 5 then count(school_id) else 0 end as int) as schools_3_5,
cast(case when visit_count between 6 and 10 then count(school_id) else 0 end as int) as schools_6_10,
cast(case when visit_count >=10 then count(school_id) else 0 end as int) as schools_10,
count(school_id)*visit_count as visits
 from crc_visits_frequency
where month=3 and crc_name is not null
group by cluster_id,cluster_name,visit_count
)as a
group by a.cluster_id,a.cluster_name;"""

    schoolwise_crc = """select initcap(a.school_name) as schoolName,a.school_id as schoolId,
	 round(cast(cast(count(distinct a.school_id) as float)/cast(count(distinct a.school_id)as float)as numeric),2)as no_of_schools_per_crc,
	 
	 round(cast(cast(sum(a.visit_count) as float)/cast(count(a.school_id) as float)as numeric),2) as visits_per_school,
	
	count(distinct(b.school_id)) as totalSchools
	from crc_visits_frequency as a left join school_hierarchy_details as b
	on a.school_id=b.school_id
	where month=3 and a.crc_name is not null 
	group by a.school_id,a.school_name,a.month;"""

    schoolwise_percentage = """select school_id as schoolId,initcap(school_name) as schoolName,
round(cast(sum(schools_0)*100/nullif(sum(scount),0)as numeric),2)as visit_0,
round(cast(sum(schools_1_2)*100/nullif(sum(scount),0)as numeric),2)as visit_1_2,
round(cast(sum(schools_3_5)*100/nullif(sum(scount),0)as numeric),2)as visit_3_5,
round(cast(sum(schools_6_10)*100/nullif(sum(scount),0)as numeric),2)as visit_6_10,
round(cast(sum(schools_10)*100/nullif(sum(scount),0)as numeric),2)as visit_10_more
from(
select school_id,school_name,visit_count,count(school_id) scount,
case when visit_count<=0 then count(school_id) end as schools_0,
case when visit_count between 1 and 2 then count(school_id) end as schools_1_2,
case when visit_count between 3 and 5 then count(school_id) end as schools_3_5,
case when visit_count between 6 and 10 then count(school_id) end as schools_6_10,
case when visit_count >=10 then count(school_id) end as schools_10
 from crc_visits_frequency
where month=3 and crc_name is not null
group by school_id,school_name,visit_count
) d group by school_id,school_name;"""

    schoolwise_visited = """select a.school_id as schoolId,initcap(a.school_name) as schoolName,
sum(scount)-sum(schools_0)as visited_schools_count,
sum(visits) as total_visits
from 
(select school_id,school_name,visit_count,count(school_id) scount,
cast(case when visit_count<=0 then count(school_id) else 0 end as int) as schools_0,
cast(case when visit_count between 1 and 2 then count(school_id) else 0 end as int) as schools_1_2,
cast(case when visit_count between 3 and 5 then count(school_id) else 0 end as int) as schools_3_5,
cast(case when visit_count between 6 and 10 then count(school_id) else 0 end as int) as schools_6_10,
cast(case when visit_count >=10 then count(school_id) else 0 end as int) as schools_10,
count(school_id)*visit_count as visits
 from crc_visits_frequency
where month=3 and crc_name is not null
group by school_id,school_name,visit_count
)as a
group by a.school_id,a.school_name;"""
