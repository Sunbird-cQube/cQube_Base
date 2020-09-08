class DikshaTableReport():
    textbook_last_day="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,
	collection_name as Textbook,content_name as Content_Name,sum(total_count) as Total_content_plays,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='TextBook' and
content_view_date = (select max(content_view_date) from diksha_total_content )
group by district_id,district_name,content_name,collection_name,content_subject,content_gradelevel,object_id,content_medium)
union
(select 'All' as district_id,'' as district_name,collection_name as Textbook,content_name as Content_Name,sum(total_count) as Total_content_plays 
,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='TextBook' and
content_view_date = (select max(content_view_date) from diksha_total_content )
group by content_name,collection_name,content_subject,content_gradelevel,content_medium,object_id);"""
    textbook_last_7_days="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,
	collection_name as Textbook,content_name as Content_Name,sum(total_count) as Total_content_plays,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='TextBook' and
content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content ) and 
(select max(content_view_date) from diksha_total_content)
group by district_id,district_name,content_name,collection_name,content_subject,content_gradelevel,object_id,content_medium)
union
(select 'All' as district_id,'' as district_name,collection_name as Textbook,content_name as Content_Name,sum(total_count) as Total_content_plays
,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium 
from diksha_total_content 
where collection_type='TextBook' and
content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content ) and 
(select max(content_view_date) from diksha_total_content)
group by content_name,collection_name,content_subject,content_gradelevel,content_medium,object_id);"""
    textbook_last_30_days="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,
	collection_name as Textbook,content_name as Content_Name,sum(total_count) as Total_content_plays,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='TextBook' and
content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content)
group by district_id,district_name,content_name,collection_name,content_subject,content_gradelevel,object_id,content_medium)
union
(select 'All' as district_id,'' as district_name,collection_name as Textbook,content_name as Content_Name,sum(total_count) as Total_content_plays
,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium 
from diksha_total_content 
where collection_type='TextBook' and
content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content)
group by content_name,collection_name,content_subject,content_gradelevel,content_medium,object_id);"""
    textbook_all_days="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,
	collection_name as Textbook,content_name as Content_Name,sum(total_count) as Total_content_plays,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='TextBook' 
group by district_id,district_name,content_name,collection_name,content_subject,content_gradelevel,object_id,content_medium)
union
(select 'All' as district_id,'' as district_name,collection_name as Textbook,content_name as Content_Name,sum(total_count) as Total_content_plays 
,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='TextBook' 
group by content_name,collection_name,content_subject,content_gradelevel,content_medium,object_id);"""
    course_last_day="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,
	collection_name as Course,content_name as Content_Name,sum(total_count) as Total_content_plays,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='Course' and
content_view_date = (select max(content_view_date) from diksha_total_content )
group by district_id,district_name,content_name,collection_name,content_subject,content_gradelevel,object_id,content_medium)
union
(select 'All' as district_id,'' as district_name,collection_name as Course,content_name as Content_Name,sum(total_count) as Total_content_plays
,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium 
from diksha_total_content 
where collection_type='Course' and
content_view_date = (select max(content_view_date) from diksha_total_content )
group by content_name,collection_name,content_subject,content_gradelevel,content_medium,object_id);"""
    course_last_7_days="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,
	collection_name as Course,content_name as Content_Name,sum(total_count) as Total_content_plays ,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='Course' and
content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content ) and 
(select max(content_view_date) from diksha_total_content)
group by district_id,district_name,content_name,collection_name,content_subject,content_gradelevel,object_id,content_medium)
union
(select 'All' as district_id,'' as district_name,collection_name as Course,content_name as Content_Name,sum(total_count) as Total_content_plays 
,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='Course' and
content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content ) and 
(select max(content_view_date) from diksha_total_content)
group by content_name,collection_name,content_subject,content_gradelevel,content_medium,object_id)"""
    course_last_30_days="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,
	collection_name as Course,content_name as Content_Name,sum(total_count) as Total_content_plays ,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='Course' and
content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content)
group by district_id,district_name,content_name,collection_name,content_subject,content_gradelevel,object_id,content_medium)
union
(select 'All' as district_id,'' as district_name,collection_name as Course,content_name as Content_Name,sum(total_count) as Total_content_plays 
,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='Course' and
content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content)
group by content_name,collection_name,content_subject,content_gradelevel,content_medium,object_id);"""
    course_all_days="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,
	collection_name as Course,content_name as Content_Name,sum(total_count) as Total_content_plays ,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where collection_type='Course' 
group by district_id,district_name,content_name,collection_name,content_subject,content_gradelevel,object_id,content_medium)
union
(select 'All' as district_id,'' as district_name,collection_name as Course,content_name as Content_Name,sum(total_count) as Total_content_plays
,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium 
from diksha_total_content 
where collection_type='Course' 
group by content_name,collection_name,content_subject,content_gradelevel,content_medium,object_id);"""
    overall_last_day="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,collection_type,collection_name,
	content_name as Content_Name,sum(total_count) as Total_content_plays,
	object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where content_view_date = (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,content_name,collection_name,content_subject,content_gradelevel,collection_type,object_id,content_medium)
union
(select 'All' as  district_id,'' as district_name,collection_type,collection_name,content_name as Content_Name,sum(total_count) as Total_content_plays,
	object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where content_view_date = (select max(content_view_date) from diksha_total_content)
group by content_name,collection_name,content_subject,content_gradelevel,content_medium,collection_type,object_id);"""
    overall_last_7_days="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,collection_type,collection_name,content_name as Content_Name
	,sum(total_count) as Total_content_plays,
	object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium 
from diksha_total_content 
where content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,content_name,collection_name,content_subject,collection_type,content_gradelevel,object_id,content_medium)
union
(select 'All' as  district_id,'' as district_name,collection_type,collection_name,content_name as Content_Name,sum(total_count) as Total_content_plays,
	object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and (select max(content_view_date) from diksha_total_content)
group by content_name,collection_name,content_subject,content_gradelevel,collection_type,content_medium,object_id);"""
    overall_last_30_days="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,collection_type,collection_name,content_name as Content_Name,
	sum(total_count) as Total_content_plays,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium   
from diksha_total_content 
where content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,content_name,collection_name,collection_type,content_subject,content_gradelevel,object_id,content_medium)
union
(select 'All' as  district_id,'' as district_name,collection_type,collection_name,content_name as Content_Name,sum(total_count) as Total_content_plays,
	object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium
from diksha_total_content 
where content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and (select max(content_view_date) from diksha_total_content)
group by content_name,collection_name,content_subject,collection_type,content_gradelevel,content_medium,object_id);"""
    overall_all_days="""(select cast(district_id as text)as district_id,initcap(district_name)as district_name,collection_type,collection_name,content_name as Content_Name,
	sum(total_count) as Total_content_plays,object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium    
from diksha_total_content 
group by district_id,district_name,content_name,collection_type,collection_name,content_subject,content_gradelevel,content_medium,object_id)
union
(select 'All' as  district_id,'' as district_name,collection_type,collection_name,content_name as Content_Name,sum(total_count) as Total_content_plays,
	object_id as content_id,content_subject as Subject,
content_gradelevel as Grade,content_medium as Medium 
from diksha_total_content 
group by content_name,collection_name,collection_type,content_subject,content_gradelevel,content_medium,object_id)"""
