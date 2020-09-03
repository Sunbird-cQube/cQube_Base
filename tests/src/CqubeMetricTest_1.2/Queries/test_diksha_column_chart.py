class DikshaColumnChart():
    textbook_lastday="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='textbook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='textbook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,collection_type 
order by 1,3);"""
    textbook_last_7_days="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='textbook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='textbook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_type 
order by 1,3);"""
    textbook_last_30_days="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='textbook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='textbook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_type 
order by 1,3);"""
    textbook_all_days="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='textbook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='textbook'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name,collection_type 
order by 1,3);"""
    course_last_day="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='course'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='course'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,collection_type 
order by 1,3);"""
    course_last_7_days="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='course'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='course'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_type 
order by 1,3);"""
    course_last_30_days="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='course'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='course'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_type 
order by 1,3);"""
    course_all_days="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='course'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null and lower(collection_type) ='course'
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name,collection_type 
order by 1,3);"""
    overall_last_day="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null 
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null 
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date = (select max(content_view_date) from diksha_total_content)
group by district_id,district_name,collection_type 
order by 1,3);"""
    overall_last_7_days="""(select 
district_id,district_name,'all_collections' as type,collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null 
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'all_districts' as type,'All' as collection_name,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null 
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '7 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_type 
order by 1,3);"""
    overall_last_30_days="""(select 
district_id,district_name,collection_name,'all_collections' as type,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null 
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_name,
collection_type order by 1,3)
union
(select 
district_id,district_name,'All' as collection_name,'all_districts' as type,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null 
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
and content_view_date between (select max(content_view_date)-INTERVAL '30 DAY' from diksha_total_content) and 
(select max(content_view_date) from diksha_total_content )
group by district_id,district_name,collection_type 
order by 1,3);"""
    overall_all_days="""(select 
district_id,district_name,collection_name,'all_collections' as type,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null 
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name,collection_name order by 1,3)
union
(select 
district_id,district_name,'All' as collection_name,'all_districts' as type,
sum(total_count) as Total_content_plays 
from diksha_total_content where user_login_type is not null and collection_type is not null 
and user_login_type <> 'NA'and district_name is not null
and district_id is not null
group by district_id,district_name 
order by 1,3);"""

