class SemesterException():
    district_wise="""select a.district_latitude,a.district_longitude,a.district_id,a.district_name,b.total_schools,
a.total_schools_not_received as Total_schools_with_missing_data,
round((cast(a.total_schools_not_received as numeric)/cast(b.total_schools as numeric))*100.0,2) as percentage_schools_with_missing_data,a.semester
from 
(select district_id ,district_name,district_latitude,district_longitude,
Count(DISTINCT(school_id)) AS total_schools_not_received,semester
from semester_exception_completion_data
group by district_id,district_name,district_latitude,district_longitude,semester
)as a
join (select district_id,count(distinct(school_id)) as total_schools from school_hierarchy_details group by district_id)as b
on a.district_id=b.district_id;"""

    block_wise="""select a.block_latitude,a.block_longitude,a.district_id,a.district_name,a.block_id,a.block_name,b.total_schools,
a.total_schools_not_received as Total_schools_with_missing_data,
round((cast(a.total_schools_not_received as numeric)/cast(b.total_schools as numeric))*100.0,2) as percentage_schools_with_missing_data,a.semester
from 
(select district_id ,district_name,block_id,block_name,block_latitude,block_longitude,
Count(DISTINCT(school_id)) AS total_schools_not_received,semester
from semester_exception_completion_data
group by district_id,district_name,block_id,block_name,block_latitude,block_longitude,semester
)as a
join (select block_id,count(distinct(school_id)) as total_schools from school_hierarchy_details group by block_id)as b
on a.block_id=b.block_id;"""

    cluster_wise="""select a.cluster_latitude,a.cluster_longitude,a.district_id,a.district_name,a.block_id,a.block_name,a.cluster_id,a.cluster_name,b.total_schools,
a.total_schools_not_received as Total_schools_with_missing_data,
round((cast(a.total_schools_not_received as numeric)/cast(b.total_schools as numeric))*100.0,2) as percentage_schools_with_missing_data,a.semester
from 
(select district_id ,district_name,block_id,block_name,cluster_id,cluster_name,cluster_latitude,cluster_longitude,semester,
Count(DISTINCT(school_id)) AS total_schools_not_received
from semester_exception_completion_data
group by district_id,district_name,block_id,block_name,cluster_id,cluster_name,cluster_latitude,cluster_longitude,semester
)as a
join (select cluster_id,count(distinct(school_id)) as total_schools from school_hierarchy_details group by cluster_id)as b
on a.cluster_id=b.cluster_id;"""

    school_wise="""select school_latitude,school_longitude,district_id,district_name,block_id,block_name,cluster_id,cluster_name,school_id,school_name,Count(DISTINCT(school_id)) AS total_schools_not_received,semester
from semester_exception_completion_data
group by district_id ,district_name,block_id,block_name,cluster_id,cluster_name,school_id,school_name,school_latitude,school_longitude,semester;"""
