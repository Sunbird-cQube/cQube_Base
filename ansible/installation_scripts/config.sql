/* Insert master infrastructure */

CREATE OR REPLACE FUNCTION insert_infra_master()
RETURNS void AS
$$
BEGIN
insert into infrastructure_master (infrastructure_name,infrastructure_category,status,created_on,updated_on) 
select infrastructure_name,infrastructure_category,status,now(),now() from 
(select replace(trim(LOWER(infrastructure_name)),' ','_') as infrastructure_name,infrastructure_category,status from infrastructure_staging_init except 
	select infrastructure_name,infrastructure_category,status from
infrastructure_master)as a;
insert into infrastructure_staging_score (infrastructure_name,infrastructure_category,score,created_on,updated_on) 
select infrastructure_name,infrastructure_category,score,now(),now() from 
(select infrastructure_name,infrastructure_category,score from infrastructure_master where status=true)as a;
END;
$$
LANGUAGE plpgsql;

select insert_infra_master();

/* Create infra tables */

CREATE OR REPLACE FUNCTION create_infra_table()
RETURNS text AS
$$
DECLARE
infra_query text:='select string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_'')||'' smallint'','','') from infrastructure_master where status = true ';
infra_cols text; 
temp_table text;
transaction_table text;
aggregation_table text;
BEGIN
Execute infra_query into infra_cols;
IF infra_cols <> '' THEN 
temp_table='create table if not exists infrastructure_temp (last_inspection_id bigint, school_id bigint primary key not null,'||infra_cols||','||'created_on timestamp,updated_on timestamp)';
transaction_table='create table if not exists infrastructure_trans (last_inspection_id bigint, school_id bigint primary key not null,'||infra_cols||','||'created_on timestamp,updated_on timestamp)';
aggregation_table='create table if not exists school_infrastructure_score (id serial,inspection_id bigint,year int,month int,school_id bigint primary key not null,school_name varchar(200),school_latitude double precision
,school_longitude double precision,district_id bigint,district_name varchar(100),district_latitude double precision,district_longitude double precision,
block_id bigint,block_name varchar(100),block_latitude double precision,block_longitude double precision,
cluster_id bigint,cluster_name varchar(100),cluster_latitude double precision,cluster_longitude double precision,'||infra_cols||','||'created_on timestamp,updated_on timestamp)';
Execute temp_table;
Execute transaction_table; 
Execute aggregation_table; 
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

select create_infra_table();

/* update score into master */

CREATE OR REPLACE FUNCTION update_infra_score()
RETURNS void AS
$$
BEGIN
update infrastructure_master as a set score=b.score,updated_on=now()
	from (
		select infrastructure_name,infrastructure_category,score 
		from infrastructure_staging_score except select infrastructure_name,infrastructure_category,score from infrastructure_master where status=true
		) as b where a.infrastructure_name=b.infrastructure_name;
END;
$$
LANGUAGE plpgsql;

/* Inserting/updating infrastructure transaction details into trans table*/

CREATE OR REPLACE FUNCTION insert_infra_trans()
RETURNS text AS
$$
DECLARE
infra_query text:='select string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'','') from infrastructure_master where status = true ';
infra_cols text; 
update_query text:='select string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_'')||'' = excluded.''||replace(trim(LOWER(infrastructure_name)),'' '',''_''),'','')from infrastructure_master where status = true';
update_cols text;
transaction_insert text;
BEGIN
Execute infra_query into infra_cols;
Execute update_query into update_cols;
IF infra_cols <> '' THEN 
transaction_insert='insert into infrastructure_trans(school_id,'||infra_cols||',created_on,updated_on) 
select school_id,'||infra_cols||',now(),now() from (select school_id,'||infra_cols||' from infrastructure_temp except select school_id,'||infra_cols||'
 from infrastructure_trans )as a 
on conflict(school_id) do update
set '||update_cols||',updated_on=now()';
Execute transaction_insert; 
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

/* Inserting/updating Aggregated data from trans to aggregation table */

create or replace FUNCTION insert_infra_agg()
RETURNS text AS
$$
DECLARE
infra_trans text:='select string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''*(select score from infrastructure_master where infrastructure_name=''
	||''''''''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''''''''||'') as ''||replace(trim(LOWER(infrastructure_name)),'' '',''_''),'','')
from infrastructure_master where status = true';
infra_trans_cols text; 
select_1 text:= 'select string_agg(''a.''||replace(trim(LOWER(infrastructure_name)),'' '',''_''),'','') from infrastructure_master where status = true order by 1';
select_1_cols text;
select_2 text:= 'select string_agg(''c.''||replace(trim(LOWER(infrastructure_name)),'' '',''_''),'','') from infrastructure_master where status = true 
order by 1';
select_2_cols text;
select_3 text:= 'select string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'','') from infrastructure_master where status = true order by 1';
select_3_cols text;
insert_infra_agg text:= 'select string_agg(column_name,'','') from information_schema.columns WHERE table_name = ''school_infrastructure_score'' and column_name not in 
                         (''created_on'',''updated_on'',''id'',''inspection_id'',''year'',''month'') order by 1';
insert_infra_agg_cols text;
update_query text:='select string_agg(column_name||'' = excluded.''||column_name,'','') from information_schema.columns WHERE table_name = ''school_infrastructure_score'' 
and column_name not in (''created_on'',''updated_on'',''id'',''inspection_id'',''year'',''month'') order by 1';
update_cols text;
infra_score text;
aggregation_select text;
aggregation_insert text;
BEGIN
Execute infra_trans into infra_trans_cols;
Execute select_1 into select_1_cols;
Execute select_2 into select_2_cols;
Execute select_3 into select_3_cols;
Execute insert_infra_agg into insert_infra_agg_cols;
Execute update_query into update_cols;
IF infra_trans_cols <> '' THEN 
infra_score= '
create or replace view infra_score_view as 
select c.school_id,'||select_2_cols||',initcap(c.school_name) as school_name,c.district_id,
initcap(c.district_name) as district_name,c.block_id,initcap(c.block_name) as block_name,c.cluster_id,initcap(c.cluster_name) as cluster_name,d.school_latitude,d.school_longitude,d.cluster_latitude,
d.cluster_longitude,d.block_latitude,d.block_longitude,d.district_latitude,d.district_longitude from  
(select a.school_id,'||select_1_cols||',b.school_name,b.district_id,b.district_name,b.block_id,b.block_name,b.cluster_id,b.cluster_name
from (select school_id,'||infra_trans_cols||' from infrastructure_trans) as a left join school_hierarchy_details as b on a.school_id=b.school_id
where cluster_name is not null)as c left join school_geo_master as d on c.school_id=d.school_id
WHERE district_name IS NOT NULL AND block_latitude>0 AND cluster_latitude > 0 AND school_latitude >0 AND district_latitude >0 
AND school_name IS NOT NULL and cluster_name is not null AND block_name IS NOT NULL';
Execute infra_score; 
aggregation_select ='create or replace view insert_infra_agg_view as
select c.school_id,'||select_2_cols||',initcap(c.school_name) as school_name,c.district_id,
initcap(c.district_name) as district_name,c.block_id,initcap(c.block_name) as block_name,c.cluster_id,initcap(c.cluster_name) as cluster_name,d.school_latitude,d.school_longitude,d.cluster_latitude,
d.cluster_longitude,d.block_latitude,d.block_longitude,d.district_latitude,d.district_longitude from  
(select a.school_id,'||select_1_cols||',b.school_name,b.district_id,b.district_name,b.block_id,b.block_name,b.cluster_id,b.cluster_name
from (select school_id,'||select_3_cols||' from infrastructure_trans) as a left join school_hierarchy_details as b on a.school_id=b.school_id
where cluster_name is not null)as c left join school_geo_master as d on c.school_id=d.school_id
WHERE district_name IS NOT NULL AND block_latitude>0 AND cluster_latitude > 0 AND school_latitude >0 AND district_latitude >0 
AND school_name IS NOT NULL and cluster_name is not null AND block_name IS NOT NULL';
Execute aggregation_select; 
aggregation_insert ='insert into school_infrastructure_score('||insert_infra_agg_cols||')
select '||insert_infra_agg_cols||' from (select '||insert_infra_agg_cols||' from insert_infra_agg_view except select '||insert_infra_agg_cols||'
 from school_infrastructure_score )as a
 on conflict(school_id) do update
set '||update_cols||',updated_on=now()';
Execute aggregation_insert;
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

/* Visualization */
/*  District - reports (map and table) */

create or replace FUNCTION infra_district_reports(category_1 text,category_2 text)
RETURNS text AS
$$
DECLARE
select_infra_score text:= 'select concat(''round(coalesce(''||''SUM('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),
	'')/count(distinct(school_id)),0),0) as infra_score'') as a from infrastructure_master where status = true order by 1';
select_infra_score_cols text;
select_average_value text:= 'select concat(''sum(case when '',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end + case when '')
||'' =0 then 0 else 1 end)'',''/'',''(select count(infrastructure_name) from infrastructure_master where status=true) as average_value'') 
from infrastructure_master where status = true order by 1';
select_average_value_cols text;
select_average_percent text:= 'select concat(''round((sum(case when '',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end + case when '')||'' =0 then 0 else 1 end)'',''/'',
''(select count(infrastructure_name) from infrastructure_master where status=true))*100.0/count(distinct(school_id)),0) as average_percent'') 
from infrastructure_master where status = true order by 1';
select_average_percent_cols text;
select_infra_value text:= 'select string_agg(concat(''sum(case when '',replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end) as '',
replace(trim(LOWER(infrastructure_name)),'' '',''_''))||''_value'','','') from infrastructure_master where status = true order by 1';
select_infra_value_cols text;
select_infra_percent text:= 'select string_agg(concat(''round(sum(case when '',replace(trim(LOWER(infrastructure_name)),'' '',''_''),
'' =0 then 0 else 1 end)*100.0/count(distinct(school_id)),0)as '',replace(trim(LOWER(infrastructure_name)),'' '',''_''))||''_percent'','','')  
 from infrastructure_master where status = true order by 1';
select_infra_percent_cols text;
select_1 text:='select string_agg(''d.''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_value''||'',''||''d.''
||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent'','','')
 from infrastructure_master where status = true order by 1';
select_1_cols text;
select_2 text:='select string_agg(''d.''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent'','','')
 from infrastructure_master where status = true order by 1';
select_2_cols text;
composite_infra_1 text:='select concat(''round(coalesce(sum('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),'')*100.0/(count(distinct(school_id))* (select sum(score) from infrastructure_master
where infrastructure_category ='''''||category_1||''''') ),0),0) as access_to_'||category_1||'_percent'')
from infrastructure_master where status = true and infrastructure_category ='''||category_1||''' order by 1';
composite_infra_1_cols text;
composite_infra_2 text:='select concat(''round(coalesce(sum('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),'')*100.0/(count(distinct(school_id))* (select sum(score) from infrastructure_master
where infrastructure_category ='''''||category_2||''''') ),0),0) as access_to_'||category_2||'_percent'')
from infrastructure_master where status = true and infrastructure_category ='''||category_2||''' order by 1';
composite_infra_2_cols text;
composite_1 text;
infra_table text;
infra_map text;
BEGIN
Execute select_infra_score into select_infra_score_cols;
Execute select_average_value into select_average_value_cols;
Execute select_average_percent into select_average_percent_cols;
Execute select_infra_value into select_infra_value_cols;
Execute select_infra_percent into select_infra_percent_cols;
Execute composite_infra_1 into composite_infra_1_cols;
Execute composite_infra_2 into composite_infra_2_cols;
Execute select_1 into select_1_cols;
Execute select_2 into select_2_cols;
IF select_infra_score_cols <> '' THEN 
infra_table= 'create or replace view infra_district_table_view as 
select d.district_id,d.total_schools_data_received,c.infra_score,d.average_value,d.average_percent,'||select_1_cols||',
initcap(c.district_name)as district_name,c.total_schools from (
select district_id,count(distinct(school_id)) as total_schools_data_received,'||select_average_value_cols||',
'||select_average_percent_cols||','||select_infra_value_cols||','||select_infra_percent_cols||'
 from school_infrastructure_score group by district_id)as d
inner join 
(select a.district_id,a.district_name,b.total_schools,c.infra_score 
from 
(select district_id,district_name from school_hierarchy_details where cluster_name is not null and block_name is not null and school_name is not null
	group by district_id,district_name)as a 
inner join (select district_id,count(distinct(school_id)) as total_schools from school_hierarchy_details where cluster_name is not null and block_name is not null and school_name is not null
	group by district_id)as b on a.district_id=b.district_id
inner join (select district_id,'||select_infra_score_cols||'
from infra_score_view group by district_id) as c on a.district_id=c.district_id) as c
on d.district_id=c.district_id ';
infra_map= 'create or replace view infra_district_map_view as 
select d.district_id,d.total_schools_data_received,c.infra_score,'||select_2_cols||',c.access_to_'||category_1||'_percent,c.access_to_'||category_2||'_percent,
initcap(c.district_name)as district_name,c.district_latitude,c.district_longitude
 from (
select district_id,count(distinct(school_id)) as total_schools_data_received,'||select_infra_percent_cols||' from school_infrastructure_score group by district_id)as d
inner join 
(select a.district_id,a.district_name,b.district_latitude,b.district_longitude,c.infra_score,c.access_to_'||category_1||'_percent,c.access_to_'||category_2||'_percent
 from 
(select district_id,district_name from school_hierarchy_details where cluster_name is not null and block_name is not null and school_name is not null
	group by district_id,district_name)as a inner join 
(select district_id,district_latitude,district_longitude from school_geo_master where cluster_latitude>0 and block_latitude>0 and school_latitude>0 and district_latitude>0
	group by district_id,district_latitude,district_longitude)as b
 on a.district_id=b.district_id
 inner join (select district_id,'||select_infra_score_cols||','||composite_infra_1_cols||',
 '||composite_infra_2_cols||'
from infra_score_view group by district_id) as c on a.district_id=c.district_id)as c
on d.district_id=c.district_id';
Execute infra_table; 
Execute infra_map;
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

/* Block - reports (map and table) */

create or replace FUNCTION infra_block_reports(category_1 text,category_2 text)
RETURNS text AS
$$
DECLARE
select_infra_score text:= 'select concat(''round(coalesce(''||''SUM('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),
	'')/count(distinct(school_id)),0),0) as infra_score'') as a from infrastructure_master where status = true order by 1';
select_infra_score_cols text;
select_average_value text:= 'select concat(''sum(case when '',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end + case when '')
||'' =0 then 0 else 1 end)'',''/'',''(select count(infrastructure_name) from infrastructure_master where status=true) as average_value'') 
from infrastructure_master where status = true order by 1';
select_average_value_cols text;
select_average_percent text:= 'select concat(''round((sum(case when '',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end + case when '')||'' =0 then 0 else 1 end)'',''/'',
''(select count(infrastructure_name) from infrastructure_master where status=true))*100.0/count(distinct(school_id)),0) as average_percent'') 
from infrastructure_master where status = true order by 1';
select_average_percent_cols text;
select_infra_value text:= 'select string_agg(concat(''sum(case when '',replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end) as '',
replace(trim(LOWER(infrastructure_name)),'' '',''_''))||''_value'','','') from infrastructure_master where status = true order by 1';
select_infra_value_cols text;
select_infra_percent text:= 'select string_agg(concat(''round(sum(case when '',replace(trim(LOWER(infrastructure_name)),'' '',''_''),
'' =0 then 0 else 1 end)*100.0/count(distinct(school_id)),0)as '',replace(trim(LOWER(infrastructure_name)),'' '',''_''))||''_percent'','','')  
 from infrastructure_master where status = true order by 1';
select_infra_percent_cols text;
select_1 text:='select string_agg(''d.''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_value''||'',''||''d.''
||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent'','','')
 from infrastructure_master where status = true order by 1';
select_1_cols text;
select_2 text:='select string_agg(''d.''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent'','','')
 from infrastructure_master where status = true order by 1';
select_2_cols text;
composite_infra_1 text:='select concat(''round(coalesce(sum('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),'')*100.0/(count(distinct(school_id))* (select sum(score) from infrastructure_master
where infrastructure_category ='''''||category_1||''''') ),0),0) as access_to_'||category_1||'_percent'')
from infrastructure_master where status = true and infrastructure_category ='''||category_1||''' order by 1';
composite_infra_1_cols text;
composite_infra_2 text:='select concat(''round(coalesce(sum('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),'')*100.0/(count(distinct(school_id))* (select sum(score) from infrastructure_master
where infrastructure_category ='''''||category_2||''''') ),0),0) as access_to_'||category_2||'_percent'')
from infrastructure_master where status = true and infrastructure_category ='''||category_2||''' order by 1';
composite_infra_2_cols text;
composite_1 text;
infra_table text;
infra_map text;
BEGIN
Execute select_infra_score into select_infra_score_cols;
Execute select_average_value into select_average_value_cols;
Execute select_average_percent into select_average_percent_cols;
Execute select_infra_value into select_infra_value_cols;
Execute select_infra_percent into select_infra_percent_cols;
Execute composite_infra_1 into composite_infra_1_cols;
Execute composite_infra_2 into composite_infra_2_cols;
Execute select_1 into select_1_cols;
Execute select_2 into select_2_cols;
IF select_infra_score_cols <> '' THEN 
infra_table= 'create or replace view infra_block_table_view as 
select d.block_id,d.total_schools_data_received,c.infra_score,d.average_value,d.average_percent,'||select_1_cols||',
initcap(c.block_name)as block_name,c.district_id,initcap(c.district_name)as district_name,c.total_schools
 from (
select block_id,count(distinct(school_id)) as total_schools_data_received,'||select_average_value_cols||',
'||select_average_percent_cols||','||select_infra_value_cols||','||select_infra_percent_cols||'
from school_infrastructure_score group by block_id ) as d
inner join 
(select a.block_id,a.block_name,a.district_id,a.district_name,b.total_schools,c.infra_score from 
(select block_id,block_name,district_id,district_name from school_hierarchy_details where cluster_name is not null and block_name is not null and school_name is not null
	group by block_id,block_name,district_id,district_name)as a inner join 
(select block_id,count(distinct(school_id)) as total_schools from school_hierarchy_details where cluster_name is not null and block_name is not null and school_name is not null
	group by block_id)as b on a.block_id=b.block_id
inner join (select block_id,'||select_infra_score_cols||'
from infra_score_view group by block_id) as c on a.block_id=c.block_id) as c
on d.block_id=c.block_id';
infra_map= 'create or replace view infra_block_map_view as 
select d.block_id,d.total_schools_data_received,c.infra_score,'||select_2_cols||',c.access_to_'||category_1||'_percent,c.access_to_'||category_2||'_percent,
initcap(c.district_name)as district_name,initcap(c.block_name)as block_name,c.district_id,c.block_latitude,c.block_longitude
from 
(select block_id,count(distinct(school_id)) as total_schools_data_received,'||select_infra_percent_cols||' from school_infrastructure_score group by block_id)as d
inner join 
(select a.block_id,a.block_name,a.district_id,a.district_name,b.block_latitude,b.block_longitude,c.infra_score,
	c.access_to_'||category_1||'_percent,c.access_to_'||category_2||'_percent from 
(select block_id,block_name,district_id,district_name from school_hierarchy_details where cluster_name is not null and block_name is not null and school_name is not null
	group by block_id,block_name,district_id,district_name)as a inner join 
(select block_id,block_latitude,block_longitude from school_geo_master where cluster_latitude>0 and block_latitude>0 and school_latitude>0 and district_latitude>0
	group by block_id,block_latitude,block_longitude)as b
 on a.block_id=b.block_id
 inner join (select block_id,'||select_infra_score_cols||','||composite_infra_1_cols||',
 '||composite_infra_2_cols||'
from infra_score_view group by block_id)as c on a.block_id=c.block_id)as c
on d.block_id=c.block_id';
Execute infra_table; 
Execute infra_map;
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

/*  Cluster - reports (map and table) */

create or replace FUNCTION infra_cluster_reports(category_1 text,category_2 text)
RETURNS text AS
$$
DECLARE
select_infra_score text:= 'select concat(''round(coalesce(''||''SUM('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),
	'')/count(distinct(school_id)),0),0) as infra_score'') as a from infrastructure_master where status = true order by 1';
select_infra_score_cols text;
select_average_value text:= 'select concat(''sum(case when '',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end + case when '')
||'' =0 then 0 else 1 end)'',''/'',''(select count(infrastructure_name) from infrastructure_master where status=true) as average_value'') 
from infrastructure_master where status = true order by 1';
select_average_value_cols text;
select_average_percent text:= 'select concat(''round((sum(case when '',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end + case when '')||'' =0 then 0 else 1 end)'',''/'',
''(select count(infrastructure_name) from infrastructure_master where status=true))*100.0/count(distinct(school_id)),0) as average_percent'') 
from infrastructure_master where status = true order by 1';
select_average_percent_cols text;
select_infra_value text:= 'select string_agg(concat(''sum(case when '',replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end) as '',
replace(trim(LOWER(infrastructure_name)),'' '',''_''))||''_value'','','') from infrastructure_master where status = true order by 1';
select_infra_value_cols text;
select_infra_percent text:= 'select string_agg(concat(''round(sum(case when '',replace(trim(LOWER(infrastructure_name)),'' '',''_''),
'' =0 then 0 else 1 end)*100.0/count(distinct(school_id)),0)as '',replace(trim(LOWER(infrastructure_name)),'' '',''_''))||''_percent'','','')  
 from infrastructure_master where status = true order by 1';
select_infra_percent_cols text;
select_1 text:='select string_agg(''d.''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_value''||'',''||''d.''
||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent'','','')
 from infrastructure_master where status = true order by 1';
select_1_cols text;
select_2 text:='select string_agg(''d.''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent'','','')
 from infrastructure_master where status = true order by 1';
select_2_cols text;
composite_infra_1 text:='select concat(''round(coalesce(sum('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),'')*100.0/(count(distinct(school_id))* (select sum(score) from infrastructure_master
where infrastructure_category ='''''||category_1||''''') ),0),0) as access_to_'||category_1||'_percent'')
from infrastructure_master where status = true and infrastructure_category ='''||category_1||''' order by 1';
composite_infra_1_cols text;
composite_infra_2 text:='select concat(''round(coalesce(sum('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),'')*100.0/(count(distinct(school_id))* (select sum(score) from infrastructure_master
where infrastructure_category ='''''||category_2||''''') ),0),0) as access_to_'||category_2||'_percent'')
from infrastructure_master where status = true and infrastructure_category ='''||category_2||''' order by 1';
composite_infra_2_cols text;
composite_1 text;
infra_table text;
infra_map text;
BEGIN
Execute select_infra_score into select_infra_score_cols;
Execute select_average_value into select_average_value_cols;
Execute select_average_percent into select_average_percent_cols;
Execute select_infra_value into select_infra_value_cols;
Execute select_infra_percent into select_infra_percent_cols;
Execute composite_infra_1 into composite_infra_1_cols;
Execute composite_infra_2 into composite_infra_2_cols;
Execute select_1 into select_1_cols;
Execute select_2 into select_2_cols;
IF select_infra_score_cols <> '' THEN 
infra_table= 'create or replace view infra_cluster_table_view as 
select d.cluster_id,d.total_schools_data_received,c.infra_score,d.average_value,d.average_percent,'||select_1_cols||',
initcap(c.cluster_name)as cluster_name,c.block_id,initcap(c.block_name)as block_name,c.district_id,initcap(c.district_name)as district_name,c.total_schools from 
(
select cluster_id,count(distinct(school_id)) as total_schools_data_received,'||select_average_value_cols||',
'||select_average_percent_cols||','||select_infra_value_cols||','||select_infra_percent_cols||'
from school_infrastructure_score group by cluster_id ) as d
inner join 
(select a.cluster_id,a.cluster_name,a.block_id,a.block_name,a.district_id,a.district_name,b.total_schools,c.infra_score from 
(select cluster_id,cluster_name,block_id,block_name,district_id,district_name from school_hierarchy_details 
	where cluster_name is not null and block_name is not null and school_name is not null
	group by cluster_id,cluster_name,block_id,block_name,district_id,district_name)as a inner join 
(select cluster_id,count(distinct(school_id)) as total_schools from school_hierarchy_details 
	where cluster_name is not null and block_name is not null and school_name is not null
	group by cluster_id)as b on a.cluster_id=b.cluster_id
inner join (select cluster_id,'||select_infra_score_cols||'
from infra_score_view group by cluster_id) as c on a.cluster_id=c.cluster_id) as c
on d.cluster_id=c.cluster_id';
infra_map= 'create or replace view infra_cluster_map_view as 
select d.cluster_id,d.total_schools_data_received,c.infra_score,'||select_2_cols||',c.access_to_'||category_1||'_percent,c.access_to_'||category_2||'_percent,
initcap(c.district_name)as district_name,initcap(c.cluster_name)as cluster_name,c.block_id,initcap(c.block_name)as block_name,c.district_id,c.cluster_latitude,c.cluster_longitude
from 
(select cluster_id,count(distinct(school_id)) as total_schools_data_received,'||select_infra_percent_cols||' 
 from school_infrastructure_score group by cluster_id)as d
inner join 
(select a.cluster_id,a.cluster_name,a.block_id,a.block_name,a.district_id,a.district_name,b.cluster_latitude,b.cluster_longitude,c.infra_score
,c.access_to_'||category_1||'_percent,c.access_to_'||category_2||'_percent from 
(select cluster_id,cluster_name,block_id,block_name,district_id,district_name from school_hierarchy_details 
	where cluster_name is not null and block_name is not null and school_name is not null
	group by cluster_id,cluster_name,block_id,block_name,district_id,district_name)as a inner join 
(select cluster_id,cluster_latitude,cluster_longitude from school_geo_master where cluster_latitude>0 and block_latitude>0 and school_latitude>0 and district_latitude>0
	group by cluster_id,cluster_latitude,cluster_longitude)as b
 on a.cluster_id=b.cluster_id
 inner join (select cluster_id,'||select_infra_score_cols||','||composite_infra_1_cols||',
 '||composite_infra_2_cols||'
from infra_score_view group by cluster_id)as c on a.cluster_id=c.cluster_id)as c
on d.cluster_id=c.cluster_id';
Execute infra_table; 
Execute infra_map;
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

/*  school - reports (map and table) */

create or replace FUNCTION infra_school_reports(category_1 text,category_2 text)
RETURNS text AS
$$
DECLARE
select_infra_score text:= 'select concat(''round(coalesce(''||''SUM('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),
	'')/count(distinct(school_id)),0),0) as infra_score'') as a from infrastructure_master where status = true order by 1';
select_infra_score_cols text;
select_average_value text:= 'select concat(''sum(case when '',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end + case when '')
||'' =0 then 0 else 1 end)'',''/'',''(select count(infrastructure_name) from infrastructure_master where status=true) as average_value'') 
from infrastructure_master where status = true order by 1';
select_average_value_cols text;
select_average_percent text:= 'select concat(''round((sum(case when '',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end + case when '')||'' =0 then 0 else 1 end)'',''/'',
''(select count(infrastructure_name) from infrastructure_master where status=true))*100.0/count(distinct(school_id)),0) as average_percent'') 
from infrastructure_master where status = true order by 1';
select_average_percent_cols text;
select_infra_value text:= 'select string_agg(concat(''sum(case when '',replace(trim(LOWER(infrastructure_name)),'' '',''_''),'' =0 then 0 else 1 end) as '',
replace(trim(LOWER(infrastructure_name)),'' '',''_''))||''_value'','','') from infrastructure_master where status = true order by 1';
select_infra_value_cols text;
select_infra_percent text:= 'select string_agg(concat(''round(sum(case when '',replace(trim(LOWER(infrastructure_name)),'' '',''_''),
'' =0 then 0 else 1 end)*100.0/count(distinct(school_id)),0)as '',replace(trim(LOWER(infrastructure_name)),'' '',''_''))||''_percent'','','')  
 from infrastructure_master where status = true order by 1';
select_infra_percent_cols text;
select_1 text:='select string_agg(''d.''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_value''||'',''||''d.''
||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent'','','')
 from infrastructure_master where status = true order by 1';
select_1_cols text;
select_2 text:='select string_agg(''d.''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent'','','')
 from infrastructure_master where status = true order by 1';
select_2_cols text;
composite_infra_1 text:='select concat(''round(coalesce(sum('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),'')*100.0/(count(distinct(school_id))* (select sum(score) from infrastructure_master
where infrastructure_category ='''''||category_1||''''') ),0),0) as access_to_'||category_1||'_percent'')
from infrastructure_master where status = true and infrastructure_category ='''||category_1||''' order by 1';
composite_infra_1_cols text;
composite_infra_2 text:='select concat(''round(coalesce(sum('',string_agg(replace(trim(LOWER(infrastructure_name)),'' '',''_''),''+''),'')*100.0/(count(distinct(school_id))* (select sum(score) from infrastructure_master
where infrastructure_category ='''''||category_2||''''') ),0),0) as access_to_'||category_2||'_percent'')
from infrastructure_master where status = true and infrastructure_category ='''||category_2||''' order by 1';
composite_infra_2_cols text;
composite_1 text;
infra_table text;
infra_map text;
BEGIN
Execute select_infra_score into select_infra_score_cols;
Execute select_average_value into select_average_value_cols;
Execute select_average_percent into select_average_percent_cols;
Execute select_infra_value into select_infra_value_cols;
Execute select_infra_percent into select_infra_percent_cols;
Execute composite_infra_1 into composite_infra_1_cols;
Execute composite_infra_2 into composite_infra_2_cols;
Execute select_1 into select_1_cols;
Execute select_2 into select_2_cols;
IF select_infra_score_cols <> '' THEN 
infra_table= 'create or replace view infra_school_table_view as 
select d.school_id,d.total_schools_data_received,c.infra_score,d.average_value,d.average_percent,'||select_1_cols||',
initcap(c.school_name)as school_name,c.cluster_id,initcap(c.cluster_name)as cluster_name,c.block_id,
initcap(c.block_name)as block_name,c.district_id,initcap(c.district_name)as district_name,c.total_schools from 
(
	select school_id,count(distinct(school_id)) as total_schools_data_received,'||select_average_value_cols||',
'||select_average_percent_cols||','||select_infra_value_cols||','||select_infra_percent_cols||'
 from school_infrastructure_score group by school_id ) as d
inner join 
(select a.school_id,a.school_name,a.cluster_id,a.cluster_name,a.block_id,a.block_name,a.district_id,a.district_name,b.total_schools,c.infra_score from 
(select school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name from school_hierarchy_details 
	where cluster_name is not null and block_name is not null and school_name is not null
	group by school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name)as a inner join 
(select school_id,count(distinct(school_id)) as total_schools from school_hierarchy_details where cluster_name is not null and block_name is not null and school_name is not null
	group by school_id)as b on a.school_id=b.school_id
inner join (select school_id,'||select_infra_score_cols||'
from infra_score_view group by school_id)as c on a.school_id=c.school_id) as c
on d.school_id=c.school_id';
infra_map= 'create or replace view infra_school_map_view as 
select d.school_id,d.total_schools_data_received,c.infra_score,'||select_2_cols||',c.access_to_'||category_1||'_percent,c.access_to_'||category_2||'_percent,
initcap(c.district_name)as district_name,initcap(c.school_name)as school_name,
c.cluster_id,initcap(c.cluster_name)as cluster_name,c.block_id,initcap(c.block_name)as block_name,c.district_id,c.school_latitude,c.school_longitude
from 
(select school_id,count(distinct(school_id)) as total_schools_data_received,'||select_infra_percent_cols||' 
  from school_infrastructure_score group by school_id)as d
inner join 
(select a.school_id,a.school_name,a.cluster_id,a.cluster_name,a.block_id,a.block_name,a.district_id,a.district_name,b.school_latitude,b.school_longitude,c.infra_score 
	,c.access_to_'||category_1||'_percent,c.access_to_'||category_2||'_percent from 
(select school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name from school_hierarchy_details 
	where cluster_name is not null and block_name is not null and school_name is not null
	group by school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name)as a inner join 
(select school_id,school_latitude,school_longitude from school_geo_master where cluster_latitude>0 and block_latitude>0 and school_latitude>0 and district_latitude>0
	group by school_id,school_latitude,school_longitude)as b
 on a.school_id=b.school_id
 inner join (select school_id,'||select_infra_score_cols||','||composite_infra_1_cols||',
 '||composite_infra_2_cols||'
from infra_score_view group by school_id)as c on a.school_id=c.school_id)as c
on d.school_id=c.school_id';
Execute infra_table; 
Execute infra_map;
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

/* JOLT spec dynamic */
-- old and current jolt structure

create or replace function Infra_jolt_spec(category_1 text,category_2 text)
    RETURNS text AS
    $$
    declare
infra_table_value text:='select string_agg(''"''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_value": "[&1].''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''.value"'','','')
 from infrastructure_master where status = true';
infra_table_value_cols text;
infra_table_percent text:='select string_agg(''"''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent": "[&1].''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''.percent"'','','')
 from infrastructure_master where status = true';   
infra_table_percent_cols text;
jolt_table_query text;
infra_map_percent text:='select string_agg(''"''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent": "data.[&1].''||
 replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent"'','','')
from infrastructure_master where status = true;';   
infra_map_percent_cols text;

composite_infra_1 text:='select string_agg(''"access_to_'||category_1||'_percent": "data.[&1].access_to_'||category_1||'_percent"'','','')';
composite_infra_1_cols text;
composite_infra_2 text:='select string_agg(''"access_to_'||category_2||'_percent": "data.[&1].access_to_'||category_2||'_percent"'','','')';
composite_infra_2_cols text;


jolt_map_query text;
BEGIN
execute infra_table_value into infra_table_value_cols;
execute infra_table_percent into infra_table_percent_cols;
execute composite_infra_2 into composite_infra_2_cols;
execute composite_infra_1 into composite_infra_1_cols;
execute infra_map_percent into infra_map_percent_cols;
IF infra_table_value_cols <> '' THEN 
jolt_table_query = '
create or replace view Infra_jolt_district_table as 
select ''[
    {
      "operation": "shift",
      "spec": {
        "*": {
          "district_id": "[&1].district.id",
          "district_name": "[&1].district.value",
          "total_schools": "[&1].total_schools.value",
          "total_schools_data_received": "[&1].total_schools_data_received.value",
          "infra_score": "[&1].infra_score.value",
          "average_value": "[&1].average.value",
          "average_percent": "[&1].average.percent",
'||infra_table_value_cols||','||infra_table_percent_cols||'         
        }
      }
    }
  ]
''as jolt_spec;
create or replace view Infra_jolt_block_table
as select ''
[
    {
      "operation": "shift",
      "spec": {
        "*": {
          "district_id": "[&1].district.id",
          "district_name": "[&1].district.value",
          "block_name" : "[&1].block.value",
          "block_id" : "[&1].block.id",
          "total_schools": "[&1].total_schools.value",
          "total_schools_data_received": "[&1].total_schools_data_received.value",
          "infra_score": "[&1].infra_score.value",
          "average_value": "[&1].average.value",
          "average_percent": "[&1].average.percent",
'||infra_table_value_cols||','||infra_table_percent_cols||'
        }
      }
    }
  ]

'' as jolt_spec;
create or replace view Infra_jolt_cluster_table
as select ''
[
    {
      "operation": "shift",
      "spec": {
        "*": {
          "district_id": "[&1].district.id",
          "district_name": "[&1].district.value",
          "block_id" : "[&1].block.id",
          "block_name" : "[&1].block.value",
          "cluster_id" : "[&1].cluster.id",
          "cluster_name" : "[&1].cluster.value",
          "total_schools": "[&1].total_schools.value",
          "total_schools_data_received": "[&1].total_schools_data_received.value",
          "infra_score": "[&1].infra_score.value",
          "average_value": "[&1].average.value",
          "average_percent": "[&1].average.percent",
'||infra_table_value_cols||','||infra_table_percent_cols||'
        }
      }
    }
  ]

''as jolt_spec;
create or replace view Infra_jolt_school_table
as select ''
[
    {
      "operation": "shift",
      "spec": {
        "*": {          
          "district_id": "[&1].district.id",
          "district_name": "[&1].district.value",
          "block_id" : "[&1].block.id",
          "block_name" : "[&1].block.value",
          "cluster_id" : "[&1].cluster.id",
          "cluster_name" : "[&1].cluster.value",
          "school_id" : "[&1].school.id",
          "school_name" : "[&1].school.value",
          "total_schools": "[&1].total_schools.value",
          "total_schools_data_received": "[&1].total_schools_data_received.value",
          "infra_score": "[&1].infra_score.value",
          "average_value": "[&1].average.value",
          "average_percent": "[&1].average.percent",
'||infra_table_value_cols||','||infra_table_percent_cols||'        }
      }
    }
  ]
''as jolt_spec;
    ';
Execute jolt_table_query;
jolt_map_query = '
create or replace view Infra_jolt_district_map as 
select ''
[{
		"operation": "shift",
		"spec": {
			"*": {
				"district_id": "data.[&1].district_id",
				"district_name": "data.[&1].district_name",
              "district_latitude": "data.[&1].district_latitude",
              "district_longitude": "data.[&1].district_longitude",
              "infra_score": "data.[&1].infra_score",
			'||infra_map_percent_cols||','||composite_infra_1_cols||','||composite_infra_2_cols||',
              
              "@total_schools_data_received": "data.[&1].total_schools_data_received",
			  "total_schools_data_received": "allDistrictsFooter.totalSchools[]"
			}
		}
	}, {
		"operation": "modify-overwrite-beta",
		"spec": {
			"*": {
				
				"totalSchools": "=intSum(@(1,totalSchools))"
			}
		}
	}
]                                       

''as jolt_spec;
create or replace view Infra_jolt_block_map
as select ''
[{
   "operation": "shift",
   "spec": {
     "*": {
       
       "district_id": "data.[&1].district_id",		
        "district_name": "data.[&1].district_name",
       "block_id": "data.[&1].block_id",
       "block_name": "data.[&1].block_name",
         "block_latitude": "data.[&1].block_latitude",
         "block_longitude": "data.[&1].block_longitude",
         
                            "infra_score": "data.[&1].infra_score",
              "average_value": "data.[&1].average_value",
              "average_percent": "data.[&1].average_percent",
              '||infra_map_percent_cols||','||composite_infra_1_cols||','||composite_infra_2_cols||',
               "total_schools": "data.[&1].total_schools",
              
              
              "@total_schools_data_received": "data.[&1].total_schools_data_received",
		"total_schools_data_received": "footer.@(1,district_id).totalSchools[]"
       
     }
   }
},
 
 {
   "operation": "modify-overwrite-beta",
   "spec": {
     "footer": {
       "*": {
         "totalSchools": "=intSum(@(1,totalSchools))"
       }
     }
   }
 },
 {
   "operation": "shift",
   "spec": {
     "data": {
       "*": {
         "district_id": "data.[&1].district_id",
				"district_name": "data.[&1].district_name",
       "block_id": "data.[&1].block_id",
         "block_name": "data.[&1].block_name",
         "block_latitude": "data.[&1].block_latitude",
         "block_longitude": "data.[&1].block_longitude",
                            "infra_score": "data.[&1].infra_score",
              "average_value": "data.[&1].average_value",
              "average_percent": "data.[&1].average_percent",

'||infra_map_percent_cols||','||composite_infra_1_cols||','||composite_infra_2_cols||',
         
         
               "total_schools": "data.[&1].total_schools",
              
              
                    "@total_schools_data_received": "data.[&1].total_schools_data_received",
		"total_schools_data_received": "allBlocksFooter.totalSchools[]"
       }
     },
     "footer": "&"
   }
 },
 {
   "operation": "modify-overwrite-beta",
   "spec": {
     "*": {
       "totalSchools": "=intSum(@(1,totalSchools))"
     }
   }
 } 
]
'' as jolt_spec;
create or replace view Infra_jolt_cluster_map
as select ''
[{
		"operation": "shift",
		"spec": {
			"*": {

				"district_id": "data.[&1].district_id",
				"district_name": "data.[&1].district_name",
				"block_id": "data.[&1].block_id",
				"block_name": "data.[&1].block_name",
				
              "cluster_id": "data.[&1].cluster_id",
              "cluster_name": "data.[&1].cluster_name",
              "cluster_latitude": "data.[&1].cluster_latitude",
				"cluster_longitude": "data.[&1].cluster_longitude",

				"infra_score": "data.[&1].infra_score",
				"average_value": "data.[&1].average_value",
				"average_percent": "data.[&1].average_percent",

'||infra_map_percent_cols||','||composite_infra_1_cols||','||composite_infra_2_cols||',
				"total_schools": "data.[&1].total_schools",


				"@total_schools_data_received": "data.[&1].total_schools_data_received",
				"total_schools_data_received": "footer.@(1,block_id).totalSchools[]"

			}
		}
	},

	{
		"operation": "modify-overwrite-beta",
		"spec": {
			"footer": {
				"*": {
					"totalSchools": "=intSum(@(1,totalSchools))"
				}
			}
		}
	}, {
		"operation": "shift",
		"spec": {
			"data": {
				"*": {
					"district_id": "data.[&1].district_id",
					"district_name": "data.[&1].district_name",
					"block_id": "data.[&1].block_id",
					"block_name": "data.[&1].block_name",
					"cluster_id": "data.[&1].cluster_id",
              "cluster_name": "data.[&1].cluster_name",
              "cluster_latitude": "data.[&1].cluster_latitude",
				"cluster_longitude": "data.[&1].cluster_longitude",
                  
					"infra_score": "data.[&1].infra_score",
					"average_value": "data.[&1].average_value",
					"average_percent": "data.[&1].average_percent",

'||infra_map_percent_cols||','||composite_infra_1_cols||','||composite_infra_2_cols||',


					"total_schools": "data.[&1].total_schools",


					"@total_schools_data_received": "data.[&1].total_schools_data_received",
					"total_schools_data_received": "allClustersFooter.totalSchools[]"
				}
			},
			"footer": "&"
		}
	}, {
		"operation": "modify-overwrite-beta",
		"spec": {
			"*": {
				"totalSchools": "=intSum(@(1,totalSchools))"
			}
		}
	}
]
''as jolt_spec;
create or replace view Infra_jolt_school_map
as select ''
[{
		"operation": "modify-overwrite-beta",
		"spec": {
			"*": {
				"cluster_id": ["=toString", null]

			}
		}
	},

	{
		"operation": "shift",
		"spec": {
			"*": {

				"district_id": "data.[&1].district_id",
				"district_name": "data.[&1].district_name",
				"block_id": "data.[&1].block_id",
				"block_name": "data.[&1].block_name",

				"cluster_id": "data.[&1].cluster_id",
				"cluster_name": "data.[&1].cluster_name",
				"school_id": "data.[&1].school_id",
				"school_name": "data.[&1].school_name",

				"school_latitude": "data.[&1].school_latitude",

				"school_longitude": "data.[&1].school_longitude",

				"infra_score": "data.[&1].infra_score",
				"average_value": "data.[&1].average_value",
				"average_percent": "data.[&1].average_percent",

'||infra_map_percent_cols||','||composite_infra_1_cols||','||composite_infra_2_cols||',
				"total_schools": "data.[&1].total_schools",


				"@total_schools_data_received": "data.[&1].total_schools_data_received",
				"total_schools_data_received": "footer.@(1,cluster_id).totalSchools[]"

			}
		}
	},

	{
		"operation": "modify-overwrite-beta",
		"spec": {
			"footer": {
				"*": {
					"totalSchools": "=intSum(@(1,totalSchools))"
				}
			}
		}
	}, {
		"operation": "shift",
		"spec": {
			"data": {
				"*": {
					"district_id": "data.[&1].district_id",
					"district_name": "data.[&1].district_name",
					"block_id": "data.[&1].block_id",
					"block_name": "data.[&1].block_name",
					"cluster_id": "data.[&1].cluster_id",
					"cluster_name": "data.[&1].cluster_name",
					"school_id": "data.[&1].school_id",
					"school_name": "data.[&1].school_name",

					"school_latitude": "data.[&1].school_latitude",

					"school_longitude": "data.[&1].school_longitude",


					"infra_score": "data.[&1].infra_score",
					"average_value": "data.[&1].average_value",
					"average_percent": "data.[&1].average_percent",

'||infra_map_percent_cols||','||composite_infra_1_cols||','||composite_infra_2_cols||',


					"total_schools": "data.[&1].total_schools",


					"@total_schools_data_received": "data.[&1].total_schools_data_received",
					"total_schools_data_received": "allSchoolsFooter.totalSchools[]"
				}
			},
			"footer": "&"
		}
	}, {
		"operation": "modify-overwrite-beta",
		"spec": {
			"*": {
				"totalSchools": "=intSum(@(1,totalSchools))"
			}
		}
	}
]
''as jolt_spec;';
Execute jolt_map_query;
END IF;
return 0;
END;
$$
LANGUAGE plpgsql;

/*Create jolt spec for Infra reports*/

select Infra_jolt_spec('water','toilet');

/*config semester with no school information*/

create or replace FUNCTION semester_no_schools(semester int)
RETURNS text AS
$$
DECLARE
semester_no_schools text;
BEGIN
semester_no_schools= 'create or replace view semester_exception_completion_data as 
select distinct a.school_id,a.school_name,a.cluster_id,a.cluster_name,a.block_id,a.block_name,a.district_id,a.district_name
,b.school_latitude,b.school_longitude,b.cluster_latitude,b.cluster_longitude,b.block_latitude,b.block_longitude,'||semester||' as semester,
 b.district_latitude,b.district_longitude from school_hierarchy_details as a
 	inner join school_geo_master as b on a.school_id=b.school_id
where a.school_id not in 
(select distinct school_id from student_semester_trans where semester='||semester||')
and cluster_name is not null';
Execute semester_no_schools; 
return 0;
END;
$$LANGUAGE plpgsql;


/*Diksha config script*/

CREATE OR REPLACE FUNCTION insert_diksha_trans()
RETURNS text AS
$$
DECLARE
transaction_insert text;
BEGIN
transaction_insert='insert into diksha_content_trans(content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent,created_on,updated_on) 
select content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent
,now(),now() from diksha_content_temp except select content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent,now(),now() from diksha_content_trans';
Execute transaction_insert; 
return 0;
END;
$$LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION insert_diksha_agg()
RETURNS text AS
$$
DECLARE
diksha_view text;
agg_insert text;
BEGIN
diksha_view='create or replace view insert_diksha_trans_view as
select b.district_id,b.district_latitude,b.district_longitude,Initcap(b.district_name) as district_name,
	   a.content_view_date,a.dimensions_pdata_id,a.dimensions_pdata_pid,a.content_name,a.content_board,a.content_mimetype,a.content_medium,a.content_gradelevel,a.content_subject,
	   a.content_created_for,a.object_id,a.object_rollup_l1,a.derived_loc_state,a.derived_loc_district,a.user_signin_type,a.user_login_type,a.collection_name,a.collection_board,
	   a.collection_type,a.collection_medium,a.collection_gradelevel,a.collection_subject,a.collection_created_for,a.total_count,a.total_time_spent
        from (select case when replace(upper(derived_loc_district),'' '','''') in (''CHHOTAUDEPUR'',''CHHOTAUDAIPUR'') then ''CHHOTAUDEPUR'' 
       when replace(upper(derived_loc_district),'' '','''') in (''DOHAD'',''DAHOD'') then ''DOHAD''																									
       when replace(upper(derived_loc_district),'' '','''') in (''PANCHMAHALS'',''PANCHMAHAL'') then ''DOHAD'' 
       when replace(upper(derived_loc_district),'' '','''') in (''MAHESANA'',''MEHSANA'') then ''MAHESANA''
       when replace(upper(derived_loc_district),'' '','''') in (''THEDANGS'',''DANG'',''DANGS'') then ''THEDANGS'' 
       else replace(upper(derived_loc_district),'' '','''') end as district_name,
content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,
case when content_gradelevel like ''[%'' then ''Multi_Grade'' else content_gradelevel end as content_gradelevel,
case when content_subject like ''[%'' then ''Multi_Subject'' else content_subject end as content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent
from diksha_content_trans ) as a left join         
        (select distinct a.district_id,a.district_name,b.district_latitude,b.district_longitude from 
(select district_id,replace(upper(district_name),'' '','''') as district_name from school_hierarchy_details
group by district_id,district_name
) as a left join school_geo_master as b on a.district_id=b.district_id) as b on a.district_name=b.district_name
where a.district_name is not null';
Execute diksha_view;
agg_insert='insert into diksha_total_content(district_id,district_latitude,district_longitude,district_name,
content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent,created_on,updated_on
) select district_id,district_latitude,district_longitude,district_name,
content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent,now(),now()
from insert_diksha_trans_view  
except select district_id,district_latitude,district_longitude,district_name,
content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent,now(),now() from diksha_total_content';
Execute agg_insert; 
return 0;
END;
$$LANGUAGE plpgsql;
