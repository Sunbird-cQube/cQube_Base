class DikshaStacked():
    last_day="""(select 
district_id,district_name,
initcap(user_login_type)as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,
user_login_type,
content_gradelevel,content_subject order by 1,3,4,5)
union 
(select 
district_id,district_name,
'All' as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
content_gradelevel,content_subject order by 1,3,4,5);"""
    last_7_day="""(select 
district_id,district_name,
initcap(user_login_type)as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) 
and (select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
user_login_type,
content_gradelevel,content_subject order by 1,3,4,5)
union 
(select 
district_id,district_name,
'All' as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) 
and (select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
content_gradelevel,content_subject order by 1,3,4,5);"""
    last_30_day="""(select 
district_id,district_name,
initcap(user_login_type)as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
user_login_type,
content_gradelevel,content_subject order by 1,3,4,5)
union 
(select 
district_id,district_name,
'All' as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
content_gradelevel,content_subject order by 1,3,4,5);"""
    all_days="""(select 
district_id,district_name,
initcap(user_login_type)as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name,
user_login_type,
content_gradelevel,content_subject order by 1,3,4,5)
union 
(select 
district_id,district_name,
'All' as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name,
content_gradelevel,content_subject order by 1,3,4,5);"""

    overall_usage_last_day="""select 'All' as district_id,'' as district_name,user_login_type,content_gradelevel,content_subject,sum(Total_content_plays) as Total_content_plays
from ((select 
district_id,district_name,
initcap(user_login_type)as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
user_login_type,
content_gradelevel,content_subject order by 1,3,4,5)
union 
(select 
district_id,district_name,
'All' as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
content_gradelevel,content_subject order by 1,3,4,5))as a
group by user_login_type,content_gradelevel,content_subject;"""
    overall_usage_last_7_days="""select 'All' as district_id,'' as district_name,user_login_type,content_gradelevel,content_subject,sum(Total_content_plays) as Total_content_plays
from ((select 
district_id,district_name,
initcap(user_login_type)as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
user_login_type,
content_gradelevel,content_subject order by 1,3,4,5)
union 
(select 
district_id,district_name,
'All' as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
content_gradelevel,content_subject order by 1,3,4,5))as a
group by user_login_type,content_gradelevel,content_subject;"""
    overall_usage_last_30_days="""select 'All' as district_id,'' as district_name,user_login_type,content_gradelevel,content_subject,sum(Total_content_plays) as Total_content_plays
from ((select 
district_id,district_name,
initcap(user_login_type)as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
user_login_type,
content_gradelevel,content_subject order by 1,3,4,5)
union 
(select 
district_id,district_name,
'All' as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,
content_gradelevel,content_subject order by 1,3,4,5))as a
group by user_login_type,content_gradelevel,content_subject;"""
    overall_usage_all_days="""select 'All' as district_id,'' as district_name,user_login_type,content_gradelevel,content_subject,sum(Total_content_plays) as Total_content_plays
from ((select 
district_id,district_name,
initcap(user_login_type)as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name,
user_login_type,
content_gradelevel,content_subject order by 1,3,4,5)
union 
(select 
district_id,district_name,
'All' as user_login_type,
initcap(content_gradelevel)as content_gradelevel,
initcap(content_subject)as content_subject,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and collection_type ='TextBook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name,
content_gradelevel,content_subject order by 1,3,4,5))as a
group by user_login_type,content_gradelevel,content_subject;"""
