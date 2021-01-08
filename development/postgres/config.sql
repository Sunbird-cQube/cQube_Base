/*update infrastructure names*/

update infrastructure_master set infrastructure_name=lower(replace(infrastructure_name,' ','_'));

/*Drop functions if exists*/

drop function IF exists insert_infra_master;
drop function IF exists create_infra_table;
drop function IF exists update_infra_score;
drop function IF exists insert_infra_trans;
drop function IF exists insert_infra_agg;
drop function IF exists infra_district_reports;
drop function IF exists infra_block_reports;
drop function IF exists infra_cluster_reports;
drop function IF exists infra_school_reports;
drop function IF exists Infra_jolt_spec;
drop function IF exists semester_no_schools;
drop function IF exists insert_diksha_trans;
drop function IF exists insert_diksha_agg;

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

select insert_infra_agg();

/* Visualization */
/*  District - reports (map and table) */

drop view if exists infra_district_table_view cascade;

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
select d.district_id,
initcap(c.district_name)as district_name,c.total_schools,d.total_schools_data_received,c.infra_score,
d.average_value,d.average_percent,'||select_1_cols||' from (
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

select infra_district_reports('water','toilet');

/* Block - reports (map and table) */

drop view if exists infra_block_table_view cascade;

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
select d.block_id,
initcap(c.block_name)as block_name,c.district_id,initcap(c.district_name)as district_name,c.total_schools,
d.total_schools_data_received,c.infra_score,d.average_value,d.average_percent,'||select_1_cols||'
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

select infra_block_reports('water','toilet');

/*  Cluster - reports (map and table) */

drop view if exists infra_cluster_table_view cascade;

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
select d.cluster_id,
initcap(c.cluster_name)as cluster_name,c.block_id,initcap(c.block_name)as block_name,
c.district_id,initcap(c.district_name)as district_name,c.total_schools,d.total_schools_data_received,
c.infra_score,d.average_value,d.average_percent,'||select_1_cols||' from 
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

select infra_cluster_reports('water','toilet');

/*  school - reports (map and table) */

drop view if exists infra_school_table_view cascade;

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
select d.school_id,
initcap(c.school_name)as school_name,c.cluster_id,initcap(c.cluster_name)as cluster_name,c.block_id,
initcap(c.block_name)as block_name,c.district_id,initcap(c.district_name)as district_name,c.total_schools
,d.total_schools_data_received,c.infra_score,d.average_value,d.average_percent,'||select_1_cols||' from 
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

select infra_school_reports('water','toilet');

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
infra_map_percent text:='select string_agg(''"''||replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent": "data.[&1].metrics.''||
 replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent"'','','')
from infrastructure_master where status = true;';   
infra_map_percent_cols text;

composite_infra_1 text:='select string_agg(''"access_to_'||category_1||'_percent": "data.[&1].access_to_'||category_1||'_percent"'','','')';
composite_infra_1_cols text;
composite_infra_2 text:='select string_agg(''"access_to_'||category_2||'_percent": "data.[&1].access_to_'||category_2||'_percent"'','','')';
composite_infra_2_cols text;

composite_inframap_1 text:='select string_agg(''"access_to_'||category_1||'_percent": "data.[&1].metrics.access_to_'||category_1||'_percent"'','','')';
composite_inframap_1_cols text;
composite_inframap_2 text:='select string_agg(''"access_to_'||category_2||'_percent": "data.[&1].metrics.access_to_'||category_2||'_percent"'','','')';
composite_inframap_2_cols text;

jolt_map_query text;
BEGIN
execute infra_table_value into infra_table_value_cols;
execute infra_table_percent into infra_table_percent_cols;
execute composite_infra_2 into composite_infra_2_cols;
execute composite_infra_1 into composite_infra_1_cols;
execute infra_map_percent into infra_map_percent_cols;
execute composite_inframap_2 into composite_inframap_2_cols;
execute composite_inframap_1 into composite_inframap_1_cols;
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
				"district_id": "data.[&1].details.district_id",
			   "district_latitude": "data.[&1].details.latitude",
              "district_longitude": "data.[&1].details.longitude",
              "district_name": "data.[&1].details.district_name",
              "infra_score": "data.[&1].details.infrastructure_score",

			'||infra_map_percent_cols||','||composite_inframap_1_cols||','||composite_inframap_2_cols||',
              
              "@total_schools_data_received": "data.[&1].details.total_schools_data_received",
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
        "district_id": "data.[&1].details.district_id",
        "block_id": "data.[&1].details.block_id",
        "block_latitude": "data.[&1].details.latitude",
        "block_longitude": "data.[&1].details.longitude",
        "district_name": "data.[&1].details.district_name",
        "block_name": "data.[&1].details.block_name",
        "infra_score": "data.[&1].details.infrastructure_score",
        "average_value": "data.[&1].details.average_value",
        "average_percent": "data.[&1].details.average_percent",

              '||infra_map_percent_cols||','||composite_inframap_1_cols||','||composite_inframap_2_cols||',
        "total_schools": "data.[&1].total_schools",
        "@total_schools_data_received": "data.[&1].details.total_schools_data_received",
        "total_schools_data_received": "footer.@(1,district_id).totalSchools[]"
      }
    }
	},
  {
    "operation": "shift",
    "spec": {
      "data": {
        "*": {
          "details": "data.[&1].&",
          "metrics": "data.[&1].&",
          "@details.total_schools_data_received": "allBlocksFooter.totalSchools[]"
        }
      },
      "footer": "&"
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
	}
, {
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
        "district_id": "data.[&1].details.district_id",
        "block_id": "data.[&1].details.block_id",
        "cluster_id": "data.[&1].details.cluster_id",
        "cluster_latitude": "data.[&1].details.latitude",
        "cluster_longitude": "data.[&1].details.longitude",
        "district_name": "data.[&1].details.district_name",
        "block_name": "data.[&1].details.block_name",
        "cluster_name": "data.[&1].details.cluster_name",
        "infra_score": "data.[&1].details.infrastructure_score",
        "average_value": "data.[&1].details.average_value",
        "average_percent": "data.[&1].details.average_percent",
'||infra_map_percent_cols||','||composite_inframap_1_cols||','||composite_inframap_2_cols||',
        "total_schools": "data.[&1].total_schools",
        "@total_schools_data_received": "data.[&1].details.total_schools_data_received",
        "total_schools_data_received": "footer.@(1,block_id).totalSchools[]"
      }
    }
	},
  {
    "operation": "shift",
    "spec": {
      "data": {
        "*": {
          "details": "data.[&1].&",
          "metrics": "data.[&1].&",
          "@details.total_schools_data_received": "allClustersFooter.totalSchools[]"
        }
      },
      "footer": "&"
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
	}
, {
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
				"district_id": "data.[&1].details.district_id",
				"block_id": "data.[&1].details.block_id",
				"cluster_id": "data.[&1].details.cluster_id",
              "school_id": "data.[&1].details.school_id",
				"school_latitude": "data.[&1].details.latitude",
				"school_longitude": "data.[&1].details.longitude",
				"district_name": "data.[&1].details.district_name",
				"block_name": "data.[&1].details.block_name",
				"cluster_name": "data.[&1].details.cluster_name",
              "school_name": "data.[&1].details.school_name",
				"infra_score": "data.[&1].details.infrastructure_score",
				"average_value": "data.[&1].details.average_value",
				"average_percent": "data.[&1].details.average_percent",

'||infra_map_percent_cols||','||composite_inframap_1_cols||','||composite_inframap_2_cols||',
				"total_schools": "data.[&1].total_schools",
				"@total_schools_data_received": "data.[&1].details.total_schools_data_received",
				"total_schools_data_received": "footer.@(1,cluster_id).totalSchools[]"
			}
		}
	}, {
		"operation": "shift",
		"spec": {
			"data": {
				"*": {
					"details": "data.[&1].&",
					"metrics": "data.[&1].&",
					"@details.total_schools_data_received": "allSchoolsFooter.totalSchools[]"
				}
			},
			"footer": "&"
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
select distinct a.school_id,initcap(a.school_name)as school_name,a.cluster_id,initcap(a.cluster_name)as cluster_name,a.block_id,
initcap(a.block_name)as block_name,a.district_id,initcap(a.district_name)as district_name
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

drop view if exists semester_exception_completion_data;

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
select data.*,now(),now() from
((select content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,
content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,
collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,
total_time_spent from diksha_content_temp) except (select content_view_date,dimensions_pdata_id,
	dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,
	content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,
collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,
total_time_spent from diksha_content_trans))as data';
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
	   a.content_view_date,a.dimensions_pdata_id,a.dimensions_pdata_pid,a.content_name,a.content_board,a.content_mimetype,a.content_medium,
	   ltrim(rtrim(a.content_gradelevel)) as content_gradelevel,regexp_replace(ltrim(rtrim(a.content_subject)),
	   ''([a-z])([A-Z])'', ''\1 \2'',''g'') as content_subject,
	   a.content_created_for,a.object_id,a.object_rollup_l1,a.derived_loc_state,a.derived_loc_district,a.user_signin_type,a.user_login_type,
	   case when a.collection_name is null then ''Other'' else a.collection_name end as collection_name,
	   a.collection_board,
	   a.collection_type,a.collection_medium,a.collection_gradelevel,a.collection_subject,a.collection_created_for,a.total_count,a.total_time_spent
        from (select case when replace(upper(derived_loc_district),'' '','''') in (''CHHOTAUDEPUR'',''CHHOTAUDAIPUR'') then ''CHHOTAUDEPUR'' 
       when replace(upper(derived_loc_district),'' '','''') in (''DOHAD'',''DAHOD'') then ''DOHAD''																									
       when replace(upper(derived_loc_district),'' '','''') in (''PANCHMAHALS'',''PANCHMAHAL'') then ''PANCH MAHALS'' 
       when replace(upper(derived_loc_district),'' '','''') in (''MAHESANA'',''MEHSANA'') then ''MAHESANA''
       when replace(upper(derived_loc_district),'' '','''') in (''THEDANGS'',''DANG'',''DANGS'') then ''THEDANGS'' 
       else replace(upper(derived_loc_district),'' '','''') end as district_name,
content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,
case when content_gradelevel like ''[%'' then ''Multi Grade'' else initcap(ltrim(rtrim(content_gradelevel))) end as content_gradelevel,
case when content_subject like ''[%'' then ''Multi Subject'' when initcap(ltrim(rtrim(content_subject)))=''Maths'' then ''Mathematics''
else initcap(ltrim(rtrim(content_subject))) end as content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent
from diksha_content_trans ) as a left join         
        (select distinct a.district_id,a.district_name,b.district_latitude,b.district_longitude from 
(select district_id,replace(upper(district_name),'' '','''') as district_name from school_hierarchy_details
group by district_id,district_name
) as a left join school_geo_master as b on a.district_id=b.district_id) as b on a.district_name=b.district_name
where a.district_name is not null and b.district_id is not null';
Execute diksha_view;
agg_insert='insert into diksha_total_content(district_id,district_latitude,district_longitude,district_name,
content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent,created_on,updated_on
) select data.*,now(),now() from
((select district_id,district_latitude,district_longitude,district_name,
content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,
total_time_spent
from insert_diksha_trans_view where content_subject is not null and content_subject <> '''') 
except (select district_id,district_latitude,district_longitude,district_name,
content_view_date,dimensions_pdata_id,dimensions_pdata_pid,content_name,content_board,content_mimetype,content_medium,content_gradelevel,content_subject,
content_created_for,object_id,object_rollup_l1,derived_loc_state,derived_loc_district,user_signin_type,user_login_type,collection_name,collection_board,
collection_type,collection_medium,collection_gradelevel,collection_subject,collection_created_for,total_count,total_time_spent 
from diksha_total_content))as data';
Execute agg_insert; 
return 0;
END;
$$LANGUAGE plpgsql;

/*truncate infra init tables*/

truncate table infrastructure_staging_init;

/*--------------------------------------------------------------Udise configuration stage-------------------------------------------------------------------------------*/


CREATE OR REPLACE FUNCTION insert_udise_trans()
RETURNS text AS
$$
DECLARE
transaction_insert text;
BEGIN
transaction_insert='insert into udise_school_metrics_trans(udise_school_id,academic_year,no_of_students,no_students_boys,no_students_girls,
classrooms_good_condition,no_of_boys_func_toilet,no_of_girls_func_toilet,no_boys_func_urinals,no_girls_func_urinals,
medchk_yn,dewormtab_yn,irontab_yn,laptop_fun,tablets_fun,desktop_fun,server_fun,projector_fun,led_fun,printer_fun,
scanner_fun,webcam_fun,generator_fun,phy_lab_yn,chem_lab_yn,bio_lab_yn,math_lab_yn,language_room,geography_room,science_room,
psychology_room,cwsn_students,students_applied_class10,students_passed_class10,students_applied_class12,students_passed_class12,
repeaters_students,no_cwsn_students_rec_incentive,no_gen_students_rec_incentive,no_cat_students_rec_incentive,no_students_received_incentives,
students_got_placement_class10,students_got_placement_class12,no_of_teachers,tch_avg_years_service,trn_crc,trn_brc,trn_diet,trn_other,
trained_cwsn,trained_comp,cwsn_sch_yn,is_students_counselling,students_pre_primary_boys,students_pre_primary_girls,anganwadi_boys,anganwadi_girls,
avg_instruct_days,avg_scl_hours_childrens,avg_work_hours_teachers,cce_yn_pri,cce_yn_upr,cce_yn_sec,cce_yn_hsec,students_enrolled_rte,
is_txtbk_pre_pri,is_txtbk_pri,is_txtbk_upr,is_txtbk_sec,is_txtbk_hsec,is_tle_pre_pri,is_tle_pri,is_tle_upr,is_tle_sec,is_tle_hsec,
is_playmat_pre_pri,is_playmat_pri,is_playmat_upr,is_playmat_sec,is_playmat_hsec,no_visit_crc,no_visit_brc,no_visit_dis,total_male_smc_members,
total_female_smc_members,total_male_smc_trained,total_female_smc_trained,total_meetings_smc,is_smdc_school,is_training_oosc,anganwadi_yn,tch_atndnc_yn,stu_atndnc_yn,
sdmp_plan_yn,cctv_cam_yn,fire_ext_yn,nodal_tch_yn,slfdef_grt_yn,slfdef_trained,
dev_grt_e,maint_grt_e,tlm_grt_e,cw_grt_e,anl_grt_e,minrep_grt_e,labrep_grt_e,book_grt_e,elec_grt_e,oth_grt_e,
compo_grt_e,lib_grt_e,sport_grt_e,media_grt_e,smc_grt_e,presch_grt_e,
dev_grt_r,maint_grt_r,tlm_grt_r,cw_grt_r,anl_grt_r,minrep_grt_r,labrep_grt_r,book_grt_r,elec_grt_r,oth_grt_r,
compo_grt_r,lib_grt_r,sport_grt_r,media_grt_r,smc_grt_r,presch_grt_r,
nsqf_yn,voc_course_yn,students_applied_class8,students_passed_class8,students_scored_above60_c8,
no_of_newadm_kids,no_of_newadm_boy_kids,no_of_newadm_girl_kids,students_opt_placement_class12 ,students_opt_voc_fields_class12 ,
students_opt_non_voc_fields_class12 ,no_of_students_self_employed_class12,total_nsqf_class_conducted,students_applied_class5,students_passed_class5,
students_scored_above60_c5,students_opt_placement_class10,students_opt_voc_fields_class10,students_opt_non_voc_fields_class10,
no_of_students_self_employed_class10,total_blocks,total_blocks_pucca,total_classrooms,total_classrooms_instructional,
land_available_expansion,have_toilet,no_of_boys_toilet,no_of_girls_toilet,no_of_boys_cwsn_toilet,no_of_boys_cwsn_func_toilet,no_of_girls_cwsn_toilet,
no_of_girls_cwsn_func_toilet,no_of_boys_urinals,no_of_girls_urinals,handwash_available,incinerator_girls_toilet,drinking_water,no_of_hand_pumps,
no_of_func_hand_pumps,no_of_well,no_of_func_well,no_of_tap_water,no_of_func_tap_water,no_of_bottle_water,no_of_func_bottle_water,
water_purifier,electricity_available,solar_panel_available,library_available,no_of_library_books,playground,playground_alt,ramps,hand_rail,
no_of_students_hv_furniture,integrated_science_lab,library_room,computer_lab,tinkering_lab,science_kit,maths_kit,laptop_available,no_of_laptop,
tablets_available,no_of_tablets,desktop_available,no_of_desktops,integrated_pc_tld,no_of_integrated_pc_tld,no_of_func_integrated_pc_tld,
digital_boards_with_cms,no_of_digital_boards_with_cms,no_of_func_digital_boards_with_cms,server_available,no_of_servers,projectors_available,
no_of_projectors,led_available,no_of_led,printer_available,no_of_printers,scanner_available,no_of_scanners,web_cam_available,no_of_web_cams,
generator_available,no_of_generators,internet_available,dth_available,digital_resources,tech_based_sol_cwsn,ict_for_teaching,
no_of_fresh_students_enrolled,nontch_days,no_of_sections_class0,no_of_sections_class1,no_of_sections_class2,
no_of_sections_class3,no_of_sections_class4,no_of_sections_class5,no_of_sections_class6,no_of_sections_class7,no_of_sections_class8,
no_of_sections_class9,no_of_sections_class10,no_of_sections_class11,no_of_sections_class12,school_established_age,shift_sch_yn,
resi_sch_yn,boarding_pri_yn,boarding_pri_b,boarding_pri_g,boarding_upr_yn,boarding_upr_b,boarding_upr_g,boarding_sec_yn,boarding_sec_b,
boarding_sec_g,boarding_hsec_yn,boarding_hsec_b,boarding_hsec_g,minority_yn,mtongue_pri,prevoc_yn,anganwadi_tch_trained,no_of_hsec_boys_rte,
no_of_hsec_girls_rte,no_of_hsec_boys_rte_facility,no_of_hsec_girls_rte_facility,no_of_ews_hs_boys_rte_enr,no_of_ews_hs_girls_rte_enr,spltrg_cy_prov_b,
spltrg_cy_prov_g,spltrg_py_enrol_b,spltrg_py_enrol_g,spltrg_py_prov_b,spltrg_py_prov_g,remedial_tch_enrol,no_inspect,smc_par_m,smc_par_f,
smc_par_sc,smc_par_st,smc_par_ews,smc_par_min,smc_lgb_m,smc_lgb_f,smc_tch_m,smc_tch_f,smdc_mem_m,smdc_mem_f,smdc_par_m,smdc_par_f,
smdc_par_ews_m,smdc_par_ews_f,smdc_lgb_m,smdc_lgb_f,smdc_ebmc_m,smdc_ebmc_f,smdc_women_f,smdc_scst_m,smdc_scst_f,smdc_deo_m,
smdc_deo_f,smdc_audit_m,smdc_audit_f,smdc_subexp_m,smdc_subexp_f,smdc_tch_m,smdc_tch_f,smdc_trained_m,smdc_trained_f,smdc_meetings,smdc_sdp_yn,
smdc_pta_meeting,tch_regular,tch_contract,tch_part_time,nontch_accnt,nontch_lib_asst,nontch_lab_asst,nontch_udc,nontch_ldc,
nontch_peon,nontch_watchman,nsqf_tch_industry_exp,nsqf_tch_training_exp,sch_eval_yn,improv_plan_yn,sch_pfms_yn,struct_safaud_yn,
nonstr_safaud_yn,safty_trng_yn,dismgmt_taug_yn,ngo_asst_yn,psu_asst_yn,comm_asst_yn,oth_asst_yn,ict_reg_yn,sport_reg_yn,lib_reg_yn,
created_on,updated_on)
select a.school_id,b.ac_year as academic_year,enr.no_of_students,enr.no_students_boys,enr.no_students_girls,
b.classrooms_good_condition,b.no_of_boys_func_toilet,b.no_of_girls_func_toilet,b.no_boys_func_urinals,b.no_girls_func_urinals,
b.medchk_yn,b.dewormtab_yn,b.irontab_yn,b.laptop_fun,b.tablets_fun,b.desktop_fun,b.server_fun,b.projector_fun,b.led_fun,b.printer_fun,
b.scanner_fun,b.webcam_fun,b.generator_fun,b.phy_lab_yn,b.chem_lab_yn,b.bio_lab_yn,b.math_lab_yn,b.language_room,b.geography_room,b.science_room,
b.psychology_room,c.cwsn_students,d.students_applied_class10,d.students_passed_class10,e.students_applied_class12,e.students_passed_class12,
f.repeaters_students,g.no_cwsn_students_rec_incentive,h.no_gen_students_rec_incentive,h.no_cat_students_rec_incentive,h.no_students_received_incentives,
i.students_got_placement_class10,j.students_got_placement_class12,k.no_of_teachers,k.tch_avg_years_service,k.trn_crc,k.trn_brc,k.trn_diet,k.trn_other,
k.trained_cwsn,k.trained_comp,l.cwsn_sch_yn,l.is_students_counselling,l.students_pre_primary_boys,l.students_pre_primary_girls,l.anganwadi_boys,l.anganwadi_girls,
l.avg_instruct_days,l.avg_scl_hours_childrens,l.avg_work_hours_teachers,l.cce_yn_pri,l.cce_yn_upr,l.cce_yn_sec,l.cce_yn_hsec,l.students_enrolled_rte,
l.is_txtbk_pre_pri,l.is_txtbk_pri,l.is_txtbk_upr,l.is_txtbk_sec,l.is_txtbk_hsec,l.is_tle_pre_pri,l.is_tle_pri,l.is_tle_upr,l.is_tle_sec,l.is_tle_hsec,
l.is_playmat_pre_pri,l.is_playmat_pri,l.is_playmat_upr,l.is_playmat_sec,l.is_playmat_hsec,l.no_visit_crc,l.no_visit_brc,l.no_visit_dis,l.total_male_smc_members,
l.total_female_smc_members,l.total_male_smc_trained,l.total_female_smc_trained,l.total_meetings_smc,l.is_smdc_school,l.is_training_oosc,l.anganwadi_yn,
m.tch_atndnc_yn,m.stu_atndnc_yn,
n.sdmp_plan_yn,n.cctv_cam_yn,n.fire_ext_yn,n.nodal_tch_yn,n.slfdef_grt_yn,n.slfdef_trained,
o.dev_grt_e,o.maint_grt_e,o.tlm_grt_e,o.cw_grt_e,o.anl_grt_e,o.minrep_grt_e,o.labrep_grt_e,o.book_grt_e,o.elec_grt_e,o.oth_grt_e,
o.compo_grt_e,o.lib_grt_e,o.sport_grt_e,o.media_grt_e,o.smc_grt_e,o.presch_grt_e,
o.dev_grt_r,o.maint_grt_r,o.tlm_grt_r,o.cw_grt_r,o.anl_grt_r,o.minrep_grt_r,o.labrep_grt_r,o.book_grt_r,o.elec_grt_r,o.oth_grt_r,
o.compo_grt_r,o.lib_grt_r,o.sport_grt_r,o.media_grt_r,o.smc_grt_r,o.presch_grt_r,
p.nsqf_yn,p.voc_course_yn,q.students_applied_class8,q.students_passed_class8,q.students_scored_above60_c8,
r.no_of_newadm_kids,r.no_of_newadm_boy_kids,r.no_of_newadm_girl_kids,j.students_opt_placement_class12 ,j.students_opt_voc_fields_class12 ,
j.students_opt_non_voc_fields_class12 ,j.no_of_students_self_employed_class12,s.total_nsqf_class_conducted,t.students_applied_class5,t.students_passed_class5,
t.students_scored_above60_c5,i.students_opt_placement_class10,i.students_opt_voc_fields_class10,i.students_opt_non_voc_fields_class10,
i.no_of_students_self_employed_class10,b.total_blocks,b.total_blocks_pucca,b.total_classrooms,b.total_classrooms_instructional,
b.land_available_expansion,b.have_toilet,b.no_of_boys_toilet,b.no_of_girls_toilet,b.no_of_boys_cwsn_toilet,b.no_of_boys_cwsn_func_toilet,b.no_of_girls_cwsn_toilet,
b.no_of_girls_cwsn_func_toilet,b.no_of_boys_urinals,b.no_of_girls_urinals,b.handwash_available,b.incinerator_girls_toilet,b.drinking_water,b.no_of_hand_pumps,
b.no_of_func_hand_pumps,b.no_of_well,b.no_of_func_well,b.no_of_tap_water,b.no_of_func_tap_water,b.no_of_bottle_water,b.no_of_func_bottle_water,
b.water_purifier,b.electricity_available,b.solar_panel_available,b.library_available,b.no_of_library_books,b.playground,b.playground_alt,b.ramps,b.hand_rail,
b.no_of_students_hv_furniture,b.integrated_science_lab,b.library_room,b.computer_lab,b.tinkering_lab,b.science_kit,b.maths_kit,b.laptop_available,b.no_of_laptop,
b.tablets_available,b.no_of_tablets,b.desktop_available,b.no_of_desktops,b.integrated_pc_tld,b.no_of_integrated_pc_tld,b.no_of_func_integrated_pc_tld,
b.digital_boards_with_cms,b.no_of_digital_boards_with_cms,b.no_of_func_digital_boards_with_cms,b.server_available,b.no_of_servers,b.projectors_available,
b.no_of_projectors,b.led_available,b.no_of_led,b.printer_available,b.no_of_printers,b.scanner_available,b.no_of_scanners,b.web_cam_available,b.no_of_web_cams,
b.generator_available,b.no_of_generators,b.internet_available,b.dth_available,b.digital_resources,b.tech_based_sol_cwsn,b.ict_for_teaching,
u.no_of_fresh_students_enrolled,k.nontch_days,l.no_of_sections_class0,l.no_of_sections_class1,l.no_of_sections_class2,
l.no_of_sections_class3,l.no_of_sections_class4,l.no_of_sections_class5,l.no_of_sections_class6,l.no_of_sections_class7,l.no_of_sections_class8,
l.no_of_sections_class9,l.no_of_sections_class10,l.no_of_sections_class11,l.no_of_sections_class12,l.school_established_age,l.shift_sch_yn,
l.resi_sch_yn,l.boarding_pri_yn,l.boarding_pri_b,l.boarding_pri_g,l.boarding_upr_yn,l.boarding_upr_b,l.boarding_upr_g,l.boarding_sec_yn,l.boarding_sec_b,
l.boarding_sec_g,l.boarding_hsec_yn,l.boarding_hsec_b,l.boarding_hsec_g,l.minority_yn,l.mtongue_pri,l.prevoc_yn,l.anganwadi_tch_trained,l.no_of_hsec_boys_rte,
l.no_of_hsec_girls_rte,l.no_of_hsec_boys_rte_facility,l.no_of_hsec_girls_rte_facility,l.no_of_ews_hs_boys_rte_enr,l.no_of_ews_hs_girls_rte_enr,l.spltrg_cy_prov_b,
l.spltrg_cy_prov_g,l.spltrg_py_enrol_b,l.spltrg_py_enrol_g,l.spltrg_py_prov_b,l.spltrg_py_prov_g,l.remedial_tch_enrol,l.no_inspect,l.smc_par_m,l.smc_par_f,
l.smc_par_sc,l.smc_par_st,l.smc_par_ews,l.smc_par_min,l.smc_lgb_m,l.smc_lgb_f,l.smc_tch_m,l.smc_tch_f,l.smdc_mem_m,l.smdc_mem_f,l.smdc_par_m,l.smdc_par_f,
l.smdc_par_ews_m,l.smdc_par_ews_f,l.smdc_lgb_m,l.smdc_lgb_f,l.smdc_ebmc_m,l.smdc_ebmc_f,l.smdc_women_f,l.smdc_scst_m,l.smdc_scst_f,l.smdc_deo_m,
l.smdc_deo_f,l.smdc_audit_m,l.smdc_audit_f,l.smdc_subexp_m,l.smdc_subexp_f,l.smdc_tch_m,l.smdc_tch_f,l.smdc_trained_m,l.smdc_trained_f,l.smdc_meetings,l.smdc_sdp_yn,
l.smdc_pta_meeting,v.tch_regular,v.tch_contract,v.tch_part_time,v.nontch_accnt,v.nontch_lib_asst,v.nontch_lab_asst,v.nontch_udc,v.nontch_ldc,
v.nontch_peon,v.nontch_watchman,w.nsqf_tch_industry_exp,w.nsqf_tch_training_exp,m.sch_eval_yn,m.improv_plan_yn,m.sch_pfms_yn,n.struct_safaud_yn,
n.nonstr_safaud_yn,n.safty_trng_yn,n.dismgmt_taug_yn,o.ngo_asst_yn,o.psu_asst_yn,o.comm_asst_yn,o.oth_asst_yn,o.ict_reg_yn,o.sport_reg_yn,o.lib_reg_yn,
now(),now()
from
(select distinct(school_id)as school_id
from school_hierarchy_details )as a
left join
(select udise_sch_code,
sum(COALESCE(c1_b,0)+COALESCE(c1_g,0)+COALESCE(c2_b,0)+COALESCE(c2_g,0)+COALESCE(c3_b,0)+COALESCE(c3_g,0)+COALESCE(c4_b,0)+COALESCE(c4_g,0)+
	COALESCE(c5_b,0)+COALESCE(c5_g,0)+COALESCE(c6_b,0)+COALESCE(c6_g,0)+COALESCE(c7_b,0)+COALESCE(c7_g,0)+COALESCE(c8_b,0)+COALESCE(c8_g,0)
	+COALESCE(c9_b,0)+COALESCE(c9_g,0)+COALESCE(c10_b,0)+COALESCE(c10_g,0)+COALESCE(c11_b,0)+COALESCE(c11_g,0)+
	COALESCE(c12_b,0)+COALESCE(c12_g,0)) as no_of_students,
sum(COALESCE(c1_b,0)+COALESCE(c2_b,0)+COALESCE(c3_b,0)+COALESCE(c4_b,0)+COALESCE(c5_b,0)+COALESCE(c6_b,0)+COALESCE(c7_b,0)+COALESCE(c8_b,0)+
	COALESCE(c9_b,0)+COALESCE(c10_b,0)+COALESCE(c11_b,0)+COALESCE(c12_b,0)) as no_students_boys,
sum(COALESCE(c1_g,0)+COALESCE(c2_g,0)+COALESCE(c3_g,0)+COALESCE(c4_g,0)+COALESCE(c5_g,0)+COALESCE(c6_g,0)+COALESCE(c7_g,0)+COALESCE(c8_g,0)+
	COALESCE(c9_g,0)+COALESCE(c10_g,0)+COALESCE(c11_g,0)+COALESCE(c12_g,0)) as no_students_girls 
from udise_sch_enr_age group by udise_sch_code,ac_year)as enr
on a.school_id=enr.udise_sch_code
left join
(select udise_sch_code,ac_year,
sum(COALESCE(clsrms_gd,0)+COALESCE(clsrms_gd_ppu,0)+COALESCE(clsrms_gd_tnt,0)+COALESCE(clsrms_gd_kuc,0)) as classrooms_good_condition,
sum(COALESCE(toiletb_fun,0)) as no_of_boys_func_toilet,
sum(COALESCE(toiletg_fun,0)) as no_of_girls_func_toilet,
sum(COALESCE(urinalsb_fun,0)) as no_boys_func_urinals,
sum(COALESCE(urinalsg_fun,0)) as no_girls_func_urinals,
cast(case when medchk_yn=1 then ''1'' else ''0'' end as boolean) as medchk_yn,
cast(case when dewormtab_yn=1 then ''1'' else ''0'' end as boolean) as dewormtab_yn,
cast(case when irontab_yn=1 then ''1'' else ''0'' end as boolean) as irontab_yn,
sum(COALESCE(laptop_fun,0)) as laptop_fun,
sum(COALESCE(tablets_fun,0)) as tablets_fun,
sum(COALESCE(desktop_fun,0)) as desktop_fun,
sum(COALESCE(server_fun,0)) as server_fun,
sum(COALESCE(projector_fun,0)) as projector_fun,
sum(COALESCE(led_fun,0)) as led_fun,
sum(COALESCE(printer_fun,0)) as printer_fun,
sum(COALESCE(scanner_fun,0)) as scanner_fun,
sum(COALESCE(webcam_fun,0)) as webcam_fun,
sum(COALESCE(generator_fun,0)) as generator_fun,
cast(case when phy_lab_yn=1 then ''1'' else ''0'' end as boolean) as phy_lab_yn,
cast(case when chem_lab_yn=1 then ''1'' else ''0'' end as boolean) as chem_lab_yn,
cast(case when boi_lab_yn=1 then ''1'' else ''0'' end as boolean) as bio_lab_yn,
cast(case when math_lab_yn=1 then ''1'' else ''0'' end as boolean) as math_lab_yn,
cast(case when lang_lab_yn=1 then ''1'' else ''0'' end as boolean) as language_room,
cast(case when geo_lab_yn=1 then ''1'' else ''0'' end as boolean) as geography_room,
cast(case when homesc_lab_yn=1 then ''1'' else ''0'' end as boolean) as science_room,
cast(case when psycho_lab_yn=1 then ''1'' else ''0'' end as boolean) as psychology_room,
sum(COALESCE(bld_blk_tot,0)) as total_blocks,
sum(COALESCE(bld_blk,0)) as total_blocks_pucca,
sum(COALESCE(clsrms_inst,0)+COALESCE(clsrms_und_cons,0)+COALESCE(clsrms_dptd,0)) as total_classrooms,
sum(COALESCE(clsrms_inst,0)) as total_classrooms_instructional,
cast(case when land_avl_yn=1 then 1 else 0 end as smallint) as land_available_expansion,
cast(case when toilet_yn=1 then 1 else 0 end as smallint) as have_toilet,
sum(COALESCE(toiletb,0)) as no_of_boys_toilet,
sum(COALESCE(toiletg,0)) as no_of_girls_toilet,
sum(COALESCE(toiletb_cwsn,0)) as no_of_boys_cwsn_toilet,
sum(COALESCE(toiletb_cwsn_fun,0)) as no_of_boys_cwsn_func_toilet,
sum(COALESCE(toiletg_cwsn,0)) as no_of_girls_cwsn_toilet,
sum(COALESCE(toiletg_cwsn_fun,0)) as no_of_girls_cwsn_func_toilet,
sum(COALESCE(urinalsb,0)) as no_of_boys_urinals,
sum(COALESCE(urinalsg,0)) as no_of_girls_urinals,
cast(case when handwash_yn=1 then 1 else 0 end as smallint) as handwash_available,
cast(case when incinerator_yn=1 then 1 else 0 end as smallint) as incinerator_girls_toilet,
cast(case when drink_water_yn=1 then 1 else 0 end as smallint) as drinking_water,
sum(COALESCE(hand_pump_tot,0)) as no_of_hand_pumps,
sum(COALESCE(hand_pump_fun,0)) as no_of_func_hand_pumps,
sum(COALESCE(well_prot_tot,0)) as no_of_well,
sum(COALESCE(well_prot_fun,0)) as no_of_func_well,
sum(COALESCE(tap_tot,0)) as no_of_tap_water,
sum(COALESCE(tap_fun,0)) as no_of_func_tap_water,
sum(COALESCE(pack_water,0)) as no_of_bottle_water,
sum(COALESCE(pack_water_fun,0)) as no_of_func_bottle_water,
cast(case when water_purifier_yn=1 then 1 else 0 end as smallint) as water_purifier,
cast(case when electricity_yn=1 then 1 else 0 end as smallint) as electricity_available,
cast(case when solarpanel_yn=1 then 1 else 0 end as smallint) as solar_panel_available,
cast(case when library_yn=1 then 1 else 0 end as smallint) as library_available,
sum(COALESCE(lib_books,0)) as no_of_library_books,
cast(case when playground_yn=1 then 1 else 0 end as smallint) as playground,
cast(case when playground_alt_yn=1 then 1 else 0 end as smallint) as playground_alt,
cast(case when ramps_yn=1 then 1 else 0 end as smallint) as ramps,
cast(case when handrails_yn=1 then 1 else 0 end as smallint) as hand_rail,
sum(COALESCE(stus_hv_furnt,0)) as no_of_students_hv_furniture,
cast(case when library_room_yn=1 then 1 else 0 end as smallint) as library_room,
cast(case when comp_room_yn=1 then 1 else 0 end as smallint) as computer_lab,
cast(case when tinkering_lab_yn=1 then 1 else 0 end as smallint) as tinkering_lab,
cast(case when sciencekit_yn=1 then 1 else 0 end as smallint) as science_kit,
cast(case when mathkit_yn=1 then 1 else 0 end as smallint) as maths_kit,
cast(case when laptop_yn=1 then 1 else 0 end as smallint) as laptop_available,
cast(case when integrated_lab_yn=1 then 1 else 0 end as smallint) as integrated_science_lab,
sum(COALESCE(laptop_tot,0)) as no_of_laptop,
cast(case when tablets_yn=1 then 1 else 0 end as smallint) as tablets_available,
sum(COALESCE(tablets_tot,0)) as no_of_tablets,
cast(case when desktop_yn=1 then 1 else 0 end as smallint) as desktop_available,
sum(COALESCE(desktop_tot,0)) as no_of_desktops,
cast(case when teachdev_yn=1 then 1 else 0 end as smallint) as integrated_pc_tld,
sum(COALESCE(teachdev_tot,0)) as no_of_integrated_pc_tld,
sum(COALESCE(teachdev_fun,0)) as no_of_func_integrated_pc_tld,
cast(case when digi_board_yn=1 then 1 else 0 end as smallint) as digital_boards_with_cms,
sum(COALESCE(digi_board_tot,0)) as no_of_digital_boards_with_cms,
sum(COALESCE(digi_board_fun,0)) as no_of_func_digital_boards_with_cms,
cast(case when server_yn=1 then 1 else 0 end as smallint) as server_available,
sum(COALESCE(server_tot,0)) as no_of_servers,
cast(case when projector_yn=1 then 1 else 0 end as smallint) as projectors_available,
sum(COALESCE(projector_tot,0)) as no_of_projectors,
cast(case when led_yn=1 then 1 else 0 end as smallint) as led_available,
sum(COALESCE(led_tot,0)) as no_of_led,
cast(case when printer_yn=1 then 1 else 0 end as smallint) as printer_available,
sum(COALESCE(printer_tot,0)) as no_of_printers,
cast(case when scanner_yn=1 then 1 else 0 end as smallint) as scanner_available,
sum(COALESCE(scanner_tot,0)) as no_of_scanners,
cast(case when webcam_yn=1 then 1 else 0 end as smallint) as web_cam_available,
sum(COALESCE(webcam_tot,0)) as no_of_web_cams,
cast(case when generator_yn=1 then 1 else 0 end as smallint) as generator_available,
sum(COALESCE(generator_tot,0)) as no_of_generators,
cast(case when internet_yn=1 then 1 else 0 end as smallint) as internet_available,
cast(case when dth_yn=1 then 1 else 0 end as smallint) as dth_available,
cast(case when digi_res_yn=1 then 1 else 0 end as smallint) as digital_resources,
cast(case when tech_soln_yn=1 then 1 else 0 end as smallint) as tech_based_sol_cwsn,
cast(case when ict_tools_yn=1 then 1 else 0 end as smallint) as ict_for_teaching
from udise_sch_facility group by udise_sch_code) as b
on a.school_id=b.udise_sch_code
left join (select udise_sch_code,
sum(COALESCE(c1_b,0)+COALESCE(c1_g,0)+COALESCE(c2_b,0)+COALESCE(c2_g,0)+COALESCE(c3_b,0)+COALESCE(c3_g,0)+COALESCE(c4_b,0)+COALESCE(c4_g,0)+
	COALESCE(c5_b,0)+COALESCE(c5_g,0)+COALESCE(c6_b,0)+COALESCE(c6_g,0)+COALESCE(c7_b,0)+COALESCE(c7_g,0)+COALESCE(c8_b,0)+COALESCE(c8_g,0)
	+COALESCE(c9_b,0)+COALESCE(c9_g,0)+COALESCE(c10_b,0)+COALESCE(c10_g,0)+COALESCE(c11_b,0)+COALESCE(c11_g,0)+
	COALESCE(c12_b,0)+COALESCE(c12_g,0)) as  cwsn_students
from udise_sch_enr_cwsn group by udise_sch_code)as c 
on a.school_id=c.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(gen_app_b,0)+COALESCE(gen_app_g,0)+COALESCE(obc_app_b,0)+COALESCE(obc_app_g,0)+COALESCE(sc_app_b,0)+COALESCE(sc_app_g,0)+COALESCE(st_app_b,0)+
	COALESCE(st_app_g,0)) as  students_applied_class10,
sum(COALESCE(gen_pass_b,0)+COALESCE(gen_pass_g,0)+COALESCE(obc_pass_b,0)+COALESCE(obc_pass_g,0)+COALESCE(sc_pass_b,0)+COALESCE(sc_pass_g,0)+
	COALESCE(st_pass_b,0)+COALESCE(st_pass_g,0)) as  students_passed_class10
from udise_sch_exmres_c10 group by udise_sch_code)as d
on a.school_id=d.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(gen_app_b,0)+COALESCE(gen_app_g,0)+COALESCE(obc_app_b,0)+COALESCE(obc_app_g,0)+COALESCE(sc_app_b,0)+COALESCE(sc_app_g,0)+COALESCE(st_app_b,0)+
	COALESCE(st_app_g,0)) as  students_applied_class12,
sum(COALESCE(gen_pass_b,0)+COALESCE(gen_pass_g,0)+COALESCE(obc_pass_b,0)+COALESCE(obc_pass_g,0)+COALESCE(sc_pass_b,0)+COALESCE(sc_pass_g,0)+
	COALESCE(st_pass_b,0)+COALESCE(st_pass_g,0)) as  students_passed_class12
from udise_sch_exmres_c12 group by udise_sch_code)as e
on a.school_id=e.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(c1_b,0)+COALESCE(c1_g,0)+COALESCE(c2_b,0)+COALESCE(c2_g,0)+COALESCE(c3_b,0)+COALESCE(c3_g,0)+COALESCE(c4_b,0)+COALESCE(c4_g,0)+
	COALESCE(c5_b,0)+COALESCE(c5_g,0)+COALESCE(c6_b,0)+COALESCE(c6_g,0)+COALESCE(c7_b,0)+COALESCE(c7_g,0)+COALESCE(c8_b,0)+COALESCE(c8_g,0)
	+COALESCE(c9_b,0)+COALESCE(c9_g,0)+COALESCE(c10_b,0)+COALESCE(c10_g,0)+COALESCE(c11_b,0)+COALESCE(c11_g,0)+
	COALESCE(c12_b,0)+COALESCE(c12_g,0)) as repeaters_students
from udise_sch_enr_reptr group by udise_sch_code)as f
on a.school_id=f.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(tot_sec_b,0)+COALESCE(tot_sec_g,0)+COALESCE(tot_hsec_b,0)+COALESCE(tot_hsec_g,0)+COALESCE(tot_pry_b,0)+COALESCE(tot_pry_g,0)+
	COALESCE(tot_upr_b,0)+COALESCE(tot_upr_g,0)+COALESCE(tot_pre_pri_b,0)+COALESCE(tot_pre_pri_g,0)) as no_cwsn_students_rec_incentive
from udise_sch_incen_cwsn group by udise_sch_code)as g
on a.school_id=g.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(gen_b,0)+COALESCE(gen_g,0)) as no_gen_students_rec_incentive,
sum(COALESCE(sc_b,0)+COALESCE(sc_g,0)+COALESCE(st_b,0)+COALESCE(st_g,0)+COALESCE(obc_b,0)+COALESCE(obc_g,0)+COALESCE(min_muslim_b,0)+COALESCE(min_muslim_g,0)+
	COALESCE(min_oth_b,0)+COALESCE(min_oth_g,0)) as no_cat_students_rec_incentive,
sum(COALESCE(sc_b,0)+COALESCE(sc_g,0)+COALESCE(st_b,0)+COALESCE(st_g,0)+COALESCE(obc_b,0)+COALESCE(obc_g,0)+COALESCE(min_muslim_b,0)+COALESCE(min_muslim_g,0)+
	COALESCE(min_oth_b,0)+COALESCE(min_oth_g,0)+COALESCE(gen_b,0)+COALESCE(gen_g,0)) as no_students_received_incentives
from udise_sch_incentives group by udise_sch_code)as h
on a.school_id=h.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(placed_b,0)+coalesce(placed_g,0)) as  students_got_placement_class10,
sum(COALESCE(opt_plcmnt_b,0)+coalesce(opt_plcmnt_g,0)) as  students_opt_placement_class10 ,
sum(COALESCE(voc_hs_b,0)+coalesce(voc_hs_g,0)) as  students_opt_voc_fields_class10 ,
sum(COALESCE(nonvoc_hs_b,0)+coalesce(nonvoc_hs_g,0)) as  students_opt_non_voc_fields_class10 ,
sum(COALESCE(self_emp_b,0)+coalesce(self_emp_g,0)) as  no_of_students_self_employed_class10   
from udise_nsqf_plcmnt_c10 group by udise_sch_code)as i
on a.school_id=i.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(placed_b,0)+coalesce(placed_g,0)) as  students_got_placement_class12,
sum(COALESCE(opt_plcmnt_b,0)+coalesce(opt_plcmnt_g,0)) as  students_opt_placement_class12 ,
sum(COALESCE(voc_hs_b,0)+coalesce(voc_hs_g,0)) as  students_opt_voc_fields_class12 ,
sum(COALESCE(nonvoc_hs_b,0)+coalesce(nonvoc_hs_g,0)) as  students_opt_non_voc_fields_class12 ,
sum(COALESCE(self_emp_b,0)+coalesce(self_emp_g,0)) as  no_of_students_self_employed_class12   
from udise_nsqf_plcmnt_c12 group by udise_sch_code)as j
on a.school_id=j.udise_sch_code
left join
(select udise_sch_code,
count(tch_code) as no_of_teachers,
(sum(date_part(''year'',now())-date_part(''year'',doj_service))/count(tch_code)) as tch_avg_years_service,
sum(case when trn_brc = 0 then 0 else 1 end) as trn_brc,
sum(case when trn_crc = 0 then 0 else 1 end) as trn_crc,
sum(case when trn_diet = 0 then 0 else 1 end) as trn_diet,
sum(case when trn_other = 0 then 0 else 1 end) as trn_other,
sum(case when trained_cwsn=1 then 1 else 0 end) as trained_cwsn,
sum(case when trained_comp=1 then 1 else 0 end) as trained_comp,
sum(case when nontch_days=1 then 1 else 0 end) as nontch_days
from udise_tch_profile group by udise_sch_code)as k
on a.school_id=k.udise_sch_code
left join
(select udise_sch_code,
cast(case when cwsn_sch_yn=1 then ''1'' else ''0'' end as boolean) as cwsn_sch_yn, 
cast(case when eduvoc_yn=1 then ''1'' else ''0'' end as boolean) as is_students_counselling, 
sum(COALESCE(ppstu_lkg_b,0) + COALESCE(ppstu_ukg_b,0)) as students_pre_primary_boys,
sum(COALESCE(ppstu_lkg_g,0) + COALESCE(ppstu_ukg_g,0)) as students_pre_primary_girls,
sum(COALESCE(anganwadi_stu_b,0)) as anganwadi_boys, 
sum(COALESCE(anganwadi_stu_g,0)) as anganwadi_girls,
SUM(COALESCE(workdays_pre_pri,0) + COALESCE(workdays_pri,0) + COALESCE(workdays_upr,0) + COALESCE(workdays_sec,0) + COALESCE(workdays_hsec,0))/5 as avg_instruct_days,
SUM(COALESCE(sch_hrs_stu_pre_pri,0) +COALESCE(sch_hrs_stu_pri,0)+COALESCE(sch_hrs_stu_upr,0)+COALESCE(sch_hrs_stu_sec,0)+COALESCE(sch_hrs_stu_hsec,0))/5 as avg_scl_hours_childrens,
SUM(COALESCE(sch_hrs_tch_pre_pri,0)+COALESCE(sch_hrs_tch_pri,0)+COALESCE(sch_hrs_tch_upr,0)+COALESCE(sch_hrs_tch_sec,0)+COALESCE(sch_hrs_tch_hsec,0))/5 as avg_work_hours_teachers,
cast(case when cce_yn_pri=1 then 1 else 0 end as smallint) as cce_yn_pri, 
cast(case when cce_yn_upr=1 then 1 else 0 end as smallint) as cce_yn_upr,
cast(case when cce_yn_sec=1 then 1 else 0 end as smallint) as cce_yn_sec,
cast(case when cce_yn_hsec=1 then 1 else 0 end as smallint) as cce_yn_hsec,
sum(COALESCE(rte_25p_applied,0)) as students_enrolled_rte,
cast(case when txtbk_pre_pri_yn=1 then 1 else 0 end as smallint) as is_txtbk_pre_pri,
cast(case when txtbk_pri_yn=1 then 1 else 0 end as smallint) as is_txtbk_pri, 
cast(case when txtbk_upr_yn=1 then 1 else 0 end as smallint) as is_txtbk_upr,
cast(case when txtbk_sec_yn=1 then 1 else 0 end as smallint) as is_txtbk_sec,
cast(case when txtbk_hsec_yn=1 then 1 else 0 end as smallint) as is_txtbk_hsec,
cast(case when tle_pre_pri_yn=1 then 1 else 0 end as smallint) as is_tle_pre_pri,
cast(case when tle_pri_yn=1 then 1 else 0 end as smallint) as is_tle_pri, 
cast(case when tle_upr_yn=1 then 1 else 0 end as smallint) as is_tle_upr,
cast(case when tle_sec_yn=1 then 1 else 0 end as smallint) as is_tle_sec,
cast(case when tle_hsec_yn=1 then 1 else 0 end as smallint) as is_tle_hsec,
cast(case when playmat_pre_pri_yn=1 then 1 else 0 end as smallint) as is_playmat_pre_pri,
cast(case when playmat_pri_yn=1 then 1 else 0 end as smallint) as is_playmat_pri, 
cast(case when playmat_upr_yn=1 then 1 else 0 end as smallint) as is_playmat_upr,
cast(case when playmat_sec_yn=1 then 1 else 0 end as smallint) as is_playmat_sec,
cast(case when playmat_hsec_yn=1 then 1 else 0 end as smallint) as is_playmat_hsec,
sum(COALESCE(no_visit_crc,0)) as no_visit_crc,
sum(COALESCE(no_visit_brc,0)) as no_visit_brc,
sum(COALESCE(no_visit_dis,0)) as no_visit_dis,
sum(COALESCE(smc_mem_m,0))as total_male_smc_members,
sum(COALESCE(smc_mem_f,0))as total_female_smc_members,
sum(COALESCE(smc_trained_m,0)) as total_male_smc_trained,
sum(COALESCE(smc_trained_f,0)) as total_female_smc_trained,
sum(COALESCE(smc_meetings,0)) as total_meetings_smc,
cast(case when smdc_yn=1 then ''1'' else ''0'' end as boolean) as is_smdc_school,
cast(case when spltrg_yn=1 then ''1'' else ''0'' end as boolean) as is_training_oosc,
CAST(case when anganwadi_yn=1 then ''1'' else ''0'' end as boolean) as anganwadi_yn,
sum(COALESCE(c0_sec,0)) as no_of_sections_class0,
sum(COALESCE(c1_sec,0)) as no_of_sections_class1,
sum(COALESCE(c2_sec,0)) as no_of_sections_class2,
sum(COALESCE(c3_sec,0))as no_of_sections_class3,
sum(COALESCE(c4_sec,0))as no_of_sections_class4,
sum(COALESCE(c5_sec,0)) as no_of_sections_class5,
sum(COALESCE(c6_sec,0)) as no_of_sections_class6,
sum(COALESCE(c7_sec,0)) as no_of_sections_class7,
sum(COALESCE(c8_sec,0)) as no_of_sections_class8,
sum(COALESCE(c9_sec,0)) as no_of_sections_class9,
sum(COALESCE(c10_sec,0))as no_of_sections_class10,
sum(COALESCE(c11_sec,0))as no_of_sections_class11,
sum(COALESCE(c12_sec,0)) as no_of_sections_class12,
sum(COALESCE(date_part(''year'',now())-cast(estd_year as int),0)) as school_established_age,
cast(case when shift_sch_yn=1 then 1 else 0 end as smallint) as shift_sch_yn,
cast(case when resi_sch_yn=1 then 1 else 0 end as smallint) as resi_sch_yn, 
cast(case when boarding_pri_yn=1 then 1 else 0 end as smallint) as boarding_pri_yn,
cast(case when boarding_pri_b=1 then 1 else 0 end as smallint) as boarding_pri_b,
cast(case when boarding_pri_g=1 then 1 else 0 end as smallint) as boarding_pri_g,
cast(case when boarding_upr_yn=1 then 1 else 0 end as smallint) as boarding_upr_yn,
cast(case when boarding_upr_b=1 then 1 else 0 end as smallint) as boarding_upr_b, 
cast(case when boarding_upr_g=1 then 1 else 0 end as smallint) as boarding_upr_g,
cast(case when boarding_sec_yn=1 then 1 else 0 end as smallint) as boarding_sec_yn,
cast(case when boarding_sec_b=1 then 1 else 0 end as smallint) as boarding_sec_b,
cast(case when boarding_sec_g=1 then 1 else 0 end as smallint) as boarding_sec_g,
cast(case when boarding_hsec_yn=1 then 1 else 0 end as smallint) as boarding_hsec_yn, 
cast(case when boarding_hsec_b=1 then 1 else 0 end as smallint) as boarding_hsec_b,
cast(case when boarding_hsec_g=1 then 1 else 0 end as smallint) as boarding_hsec_g,
cast(case when minority_yn=1 then 1 else 0 end as smallint) as minority_yn,
cast(case when mtongue_pri=1 then 1 else 0 end as smallint) as mtongue_pri,
cast(case when prevoc_yn=1 then 1 else 0 end as smallint) as prevoc_yn,
cast(case when anganwadi_tch_trained=1 then 1 else 0 end as smallint) as anganwadi_tch_trained,
sum(COALESCE(rte_pvt_c0_b,0)+COALESCE(rte_pvt_c1_b,0)+COALESCE(rte_pvt_c2_b,0)+COALESCE(rte_pvt_c3_b,0)
+COALESCE(rte_pvt_c4_b,0)+COALESCE(rte_pvt_c5_b,0)+COALESCE(rte_pvt_c6_b,0)+COALESCE(rte_pvt_c7_b,0)+COALESCE(rte_pvt_c8_b,0)) as no_of_hsec_boys_rte,
sum(COALESCE(rte_pvt_c0_g,0)+COALESCE(rte_pvt_c1_g,0)+COALESCE(rte_pvt_c2_g,0)+COALESCE(rte_pvt_c3_g,0)
+COALESCE(rte_pvt_c4_g,0)+COALESCE(rte_pvt_c5_g,0)+COALESCE(rte_pvt_c6_g,0)+COALESCE(rte_pvt_c7_g,0)+COALESCE(rte_pvt_c8_g,0)) as no_of_hsec_girls_rte,
sum(COALESCE(rte_bld_c0_b,0)+COALESCE(rte_bld_c1_b,0)+COALESCE(rte_bld_c2_b,0)+COALESCE(rte_bld_c3_b,0)
+COALESCE(rte_bld_c4_b,0)+COALESCE(rte_bld_c5_b,0)+COALESCE(rte_bld_c6_b,0)+COALESCE(rte_bld_c7_b,0)+COALESCE(rte_bld_c8_b,0)) as no_of_hsec_boys_rte_facility,
sum(COALESCE(rte_bld_c0_g,0)+COALESCE(rte_bld_c1_g,0)+COALESCE(rte_bld_c2_g,0)+COALESCE(rte_bld_c3_g,0)
+COALESCE(rte_bld_c4_g,0)+COALESCE(rte_bld_c5_g,0)+COALESCE(rte_bld_c6_g,0)+COALESCE(rte_bld_c7_g,0)+COALESCE(rte_bld_c8_g,0)) as no_of_hsec_girls_rte_facility,
sum(COALESCE(rte_ews_c9_b,0)+COALESCE(rte_ews_c10_b,0)+COALESCE(rte_ews_c11_b,0)+COALESCE(rte_ews_c12_b,0)) as no_of_ews_hs_boys_rte_enr,
sum(COALESCE(rte_ews_c9_g,0)+COALESCE(rte_ews_c10_g,0)+COALESCE(rte_ews_c11_g,0)+COALESCE(rte_ews_c12_g,0)) as no_of_ews_hs_girls_rte_enr,
sum(COALESCE(no_inspect,0))as no_inspect,
sum(COALESCE(spltrg_cy_prov_b,0)) as spltrg_cy_prov_b,
sum(COALESCE(spltrg_cy_prov_g,0)) as spltrg_cy_prov_g,
sum(COALESCE(spltrg_py_enrol_b,0)) as spltrg_py_enrol_b,
sum(COALESCE(spltrg_py_enrol_g,0)) as spltrg_py_enrol_g,
sum(COALESCE(spltrg_py_prov_b,0)) as spltrg_py_prov_b,
sum(COALESCE(spltrg_py_prov_g,0))as spltrg_py_prov_g,
sum(COALESCE(remedial_tch_enrol,0))as remedial_tch_enrol,
sum(COALESCE(smc_par_m,0))as smc_par_m,
sum(COALESCE(smc_par_f,0)) as smc_par_f,
sum(COALESCE(smc_par_sc,0)) as smc_par_sc,
sum(COALESCE(smc_par_st,0)) as smc_par_st,
sum(COALESCE(smc_par_ews,0)) as smc_par_ews,
sum(COALESCE(smc_par_min,0)) as smc_par_min,
sum(COALESCE(smc_lgb_m,0))as smc_lgb_m,
sum(COALESCE(smc_lgb_f,0))as smc_lgb_f,
sum(COALESCE(smc_tch_m,0))as smc_tch_m,
sum(COALESCE(smc_tch_f,0)) as smc_tch_f,
sum(COALESCE(smdc_mem_m,0)) as smdc_mem_m,
sum(COALESCE(smdc_mem_f,0)) as smdc_mem_f,
sum(COALESCE(smdc_par_m,0)) as smdc_par_m,
sum(COALESCE(smdc_par_f,0)) as smdc_par_f,
sum(COALESCE(smdc_par_ews_m,0))as smdc_par_ews_m,
sum(COALESCE(smdc_par_ews_f,0))as smdc_par_ews_f,
sum(COALESCE(smdc_lgb_m,0))as smdc_lgb_m,
sum(COALESCE(smdc_lgb_f,0)) as smdc_lgb_f,
sum(COALESCE(smdc_ebmc_m,0)) as smdc_ebmc_m,
sum(COALESCE(smdc_ebmc_f,0)) as smdc_ebmc_f,
sum(COALESCE(smdc_women_f,0)) as smdc_women_f,
sum(COALESCE(smdc_scst_m,0)) as smdc_scst_m,
sum(COALESCE(smdc_scst_f,0))as smdc_scst_f,
sum(COALESCE(smdc_deo_m,0))as smdc_deo_m,
sum(COALESCE(smdc_deo_f,0))as smdc_deo_f,
sum(COALESCE(smdc_audit_m,0)) as smdc_audit_m,
sum(COALESCE(smdc_audit_f,0)) as smdc_audit_f,
sum(COALESCE(smdc_subexp_m,0)) as smdc_subexp_m,
sum(COALESCE(smdc_subexp_f,0)) as smdc_subexp_f,
sum(COALESCE(smdc_tch_m,0)) as smdc_tch_m,
sum(COALESCE(smdc_tch_f,0))as smdc_tch_f,
sum(COALESCE(smdc_trained_m,0))as smdc_trained_m,
sum(COALESCE(smdc_trained_f,0))as smdc_trained_f,
sum(COALESCE(smdc_meetings,0))as smdc_meetings,
cast(case when smdc_sdp_yn=1 then 1 else 0 end as smallint) as smdc_sdp_yn,
sum(COALESCE(smdc_pta_meeting,0))as smdc_pta_meeting
from udise_sch_profile group by udise_sch_code)as l
on a.school_id=l.udise_sch_code
left join
(select udise_sch_code,
cast(case when stu_atndnc_yn=1 then ''1'' else ''0'' end as boolean) as stu_atndnc_yn,
cast(case when tch_atndnc_yn=1 then ''1'' else ''0'' end as boolean) as tch_atndnc_yn,
cast(case when sch_eval_yn=1 then 1 else 0 end as smallint) as sch_eval_yn,
cast(case when improv_plan_yn=1 then 1 else 0 end as smallint) as improv_plan_yn,
cast(case when sch_pfms_yn=1 then 1 else 0 end as smallint) as sch_pfms_yn
from udise_sch_pgi_details group by udise_sch_code)as m
on a.school_id=m.udise_sch_code
left join
(select udise_sch_code,
cast(case when sdmp_plan_yn=1 then ''1'' else ''0'' end as boolean) as sdmp_plan_yn,
cast(case when cctv_cam_yn=1 then ''1'' else ''0'' end as boolean) as cctv_cam_yn,
cast(case when fire_ext_yn=1 then ''1'' else ''0'' end as boolean) as fire_ext_yn,
cast(case when nodal_tch_yn=1 then ''1'' else ''0'' end as boolean) as nodal_tch_yn,
cast(case when slfdef_grt_yn=1 then ''1'' else ''0'' end as boolean) as slfdef_grt_yn,
sum(COALESCE(slfdef_trained,0)) as slfdef_trained,
cast(case when struct_safaud_yn=1 then 1 else 0 end as smallint) as struct_safaud_yn,
cast(case when nonstr_safaud_yn=1 then 1 else 0 end as smallint) as nonstr_safaud_yn,
cast(case when safty_trng_yn=1 then 1 else 0 end as smallint) as safty_trng_yn,
cast(case when dismgmt_taug_yn=1 then 1 else 0 end as smallint) as dismgmt_taug_yn
from udise_sch_safety group by udise_sch_code)as n
on a.school_id=n.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(dev_grt_r,0))as dev_grt_r,sum(COALESCE(dev_grt_e,0))as dev_grt_e,
sum(COALESCE(maint_grt_r,0))as maint_grt_r,sum(COALESCE(maint_grt_e,0))as maint_grt_e,
sum(COALESCE(tlm_grt_r,0))as tlm_grt_r,sum(COALESCE(tlm_grt_e,0))as tlm_grt_e,
sum(COALESCE(cw_grt_r,0))as cw_grt_r,sum(COALESCE(cw_grt_e,0))as cw_grt_e,
sum(COALESCE(anl_grt_r,0))as anl_grt_r,sum(COALESCE(anl_grt_e,0))as anl_grt_e,
sum(COALESCE(minrep_grt_r,0))as minrep_grt_r,sum(COALESCE(minrep_grt_e,0))as minrep_grt_e,
sum(COALESCE(labrep_grt_r,0))as labrep_grt_r,sum(COALESCE(labrep_grt_e,0))as labrep_grt_e,
sum(COALESCE(book_grt_r,0))as book_grt_r,sum(COALESCE(book_grt_e,0))as book_grt_e,
sum(COALESCE(elec_grt_r,0))as elec_grt_r,sum(COALESCE(elec_grt_e,0))as elec_grt_e,
sum(COALESCE(oth_grt_r,0))as oth_grt_r,sum(COALESCE(oth_grt_e,0))as oth_grt_e,
sum(COALESCE(compo_grt_r,0))as compo_grt_r,sum(COALESCE(compo_grt_e,0))as compo_grt_e,
sum(COALESCE(lib_grt_r,0))as lib_grt_r,sum(COALESCE(lib_grt_e,0))as lib_grt_e,
sum(COALESCE(sport_grt_r,0))as sport_grt_r,sum(COALESCE(sport_grt_e,0))as sport_grt_e,
sum(COALESCE(media_grt_r,0))as media_grt_r,sum(COALESCE(media_grt_e,0))as media_grt_e,
sum(COALESCE(smc_grt_r,0))as smc_grt_r,sum(COALESCE(smc_grt_e,0))as smc_grt_e,
sum(COALESCE(presch_grt_r,0))as presch_grt_r,sum(COALESCE(presch_grt_e,0))as presch_grt_e,
cast(case when ngo_asst_yn=1 then 1 else 0 end as smallint) as ngo_asst_yn,
cast(case when psu_asst_yn=1 then 1 else 0 end as smallint) as psu_asst_yn,
cast(case when comm_asst_yn=1 then 1 else 0 end as smallint) as comm_asst_yn,
cast(case when oth_asst_yn=1 then 1 else 0 end as smallint) as oth_asst_yn,
cast(case when ict_reg_yn=1 then 1 else 0 end as smallint) as ict_reg_yn,
cast(case when sport_reg_yn=1 then 1 else 0 end as smallint) as sport_reg_yn,
cast(case when lib_reg_yn=1 then 1 else 0 end as smallint) as lib_reg_yn
from udise_sch_recp_exp group by udise_sch_code)as o
on a.school_id=o.udise_sch_code
left join
(select udise_sch_code,
cast(case when nsqf_yn=1 then ''1'' else ''0'' end as boolean) as nsqf_yn,
cast(case when voc_course_yn=1 then ''1'' else ''0'' end as boolean) as voc_course_yn
from udise_nsqf_basic_info group by udise_sch_code)as p
on a.school_id=p.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(gen_app_b,0)+COALESCE(gen_app_g,0)+COALESCE(obc_app_b,0)+COALESCE(obc_app_g,0)+COALESCE(sc_app_b,0)+COALESCE(sc_app_g,0)+COALESCE(st_app_b,0)+
	COALESCE(st_app_g,0)) as  students_applied_class8,
sum(COALESCE(gen_pass_b,0)+COALESCE(gen_pass_g,0)+COALESCE(obc_pass_b,0)+COALESCE(obc_pass_g,0)+COALESCE(sc_pass_b,0)+COALESCE(sc_pass_g,0)+
	COALESCE(st_pass_b,0)+COALESCE(st_pass_g,0)) as  students_passed_class8,
sum(COALESCE(gen_60p_b,0)+COALESCE(gen_60p_g,0)+COALESCE(obc_60p_b,0)+COALESCE(obc_60p_g,0)+COALESCE(sc_60p_b,0)+COALESCE(sc_60p_g,0)+
	COALESCE(st_60p_b,0)+COALESCE(st_60p_g,0)) as  students_scored_above60_c8
from udise_sch_exmres_c8 group by udise_sch_code
)as q
on a.school_id=q.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(age4_b,0)+COALESCE(age5_b,0)+COALESCE(age6_b,0)+COALESCE(age7_b,0)+COALESCE(age8_b,0)) as  no_of_newadm_boy_kids,
sum(COALESCE(age4_g,0)+COALESCE(age5_g,0)+COALESCE(age6_g,0)+COALESCE(age7_g,0)+COALESCE(age8_g,0)) as  no_of_newadm_girl_kids,
sum(COALESCE(age4_b,0)+COALESCE(age5_b,0)+COALESCE(age6_b,0)+COALESCE(age7_b,0)+COALESCE(age8_b,0)+
COALESCE(age4_g,0)+COALESCE(age5_g,0)+COALESCE(age6_g,0)+COALESCE(age7_g,0)+COALESCE(age8_g,0)) as  no_of_newadm_kids
from udise_sch_enr_newadm group by udise_sch_code
)as r
on a.school_id=r.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(c9,0)+COALESCE(c10,0)+COALESCE(c11,0)+COALESCE(c12,0)) as total_nsqf_class_conducted
from udise_nsqf_class_cond group by udise_sch_code
)as s
on a.school_id=s.udise_sch_code
left join
(select udise_sch_code,
sum(COALESCE(gen_app_b,0)+COALESCE(gen_app_g,0)+COALESCE(obc_app_b,0)+COALESCE(obc_app_g,0)+COALESCE(sc_app_b,0)+COALESCE(sc_app_g,0)+COALESCE(st_app_b,0)+
	COALESCE(st_app_g,0)) as  students_applied_class5,
sum(COALESCE(gen_pass_b,0)+COALESCE(gen_pass_g,0)+COALESCE(obc_pass_b,0)+COALESCE(obc_pass_g,0)+COALESCE(sc_pass_b,0)+COALESCE(sc_pass_g,0)+
	COALESCE(st_pass_b,0)+COALESCE(st_pass_g,0)) as  students_passed_class5,
sum(COALESCE(gen_60p_b,0)+COALESCE(gen_60p_g,0)+COALESCE(obc_60p_b,0)+COALESCE(obc_60p_g,0)+COALESCE(sc_60p_b,0)+COALESCE(sc_60p_g,0)+
	COALESCE(st_60p_b,0)+COALESCE(st_60p_g,0)) as  students_scored_above60_c5
from udise_sch_exmres_c5 group by udise_sch_code
)as t
on a.school_id=t.udise_sch_code
left join
(select udise_sch_code,sum(COALESCE(c1_b,0)+COALESCE(c1_g,0)+COALESCE(c2_b,0)+COALESCE(c2_g,0)+COALESCE(c3_b,0)+COALESCE(c3_g,0)+COALESCE(c4_b,0)+COALESCE(c4_g,0)+
	COALESCE(c5_b,0)+COALESCE(c5_g,0)+COALESCE(c6_b,0)+COALESCE(c6_g,0)+COALESCE(c7_b,0)+COALESCE(c7_g,0)+COALESCE(c8_b,0)+COALESCE(c8_g,0)
	+COALESCE(c9_b,0)+COALESCE(c9_g,0)+COALESCE(c10_b,0)+COALESCE(c10_g,0)+COALESCE(c11_b,0)+COALESCE(c11_g,0)+
	COALESCE(c12_b,0)+COALESCE(c12_g,0)) as no_of_fresh_students_enrolled
from udise_sch_enr_fresh group by udise_sch_code
)as u
on a.school_id=u.udise_sch_code
left join
(select udise_sch_code,
	sum(COALESCE(tch_regular,0)) as tch_regular,sum(COALESCE(tch_contract,0)) as tch_contract,
	sum(COALESCE(tch_part_time,0)) as tch_part_time,sum(COALESCE(nontch_accnt,0)) as nontch_accnt,
	sum(COALESCE(nontch_lib_asst,0)) as nontch_lib_asst,sum(COALESCE(nontch_lab_asst,0)) as nontch_lab_asst,
	sum(COALESCE(nontch_udc,0)) as nontch_udc,sum(COALESCE(nontch_ldc,0)) as nontch_ldc,
	sum(COALESCE(nontch_peon,0)) as nontch_peon,sum(COALESCE(nontch_watchman,0)) as nontch_watchman
	from udise_sch_staff_posn group by udise_sch_code
)as v
on a.school_id=v.udise_sch_code
left join
(select udise_sch_code,
	sum(COALESCE(industry_exp,0)) as nsqf_tch_industry_exp,sum(COALESCE(training_exp,0)) as nsqf_tch_training_exp
	from udise_nsqf_faculty group by udise_sch_code
)as w
on a.school_id=w.udise_sch_code
on conflict (udise_school_id)
do update set 
academic_year=excluded.academic_year,no_of_students=excluded.no_of_students,no_students_boys=excluded.no_students_boys,no_students_girls=excluded.no_students_girls,
classrooms_good_condition=excluded.classrooms_good_condition,no_of_boys_func_toilet=excluded.no_of_boys_func_toilet,no_of_girls_func_toilet=excluded.no_of_girls_func_toilet,
no_boys_func_urinals=excluded.no_boys_func_urinals,no_girls_func_urinals=excluded.no_girls_func_urinals,medchk_yn=excluded.medchk_yn,dewormtab_yn=excluded.dewormtab_yn,
irontab_yn=excluded.irontab_yn,laptop_fun=excluded.laptop_fun,tablets_fun=excluded.tablets_fun,desktop_fun=excluded.desktop_fun,server_fun=excluded.server_fun,
projector_fun=excluded.projector_fun,led_fun=excluded.led_fun,printer_fun=excluded.printer_fun,scanner_fun=excluded.scanner_fun,webcam_fun=excluded.webcam_fun,
generator_fun=excluded.generator_fun,phy_lab_yn=excluded.phy_lab_yn,chem_lab_yn=excluded.chem_lab_yn,bio_lab_yn=excluded.bio_lab_yn,math_lab_yn=excluded.math_lab_yn,
language_room=excluded.language_room,geography_room=excluded.geography_room,science_room=excluded.science_room,psychology_room=excluded.psychology_room,cwsn_students=excluded.cwsn_students,
students_applied_class10=excluded.students_applied_class10,students_passed_class10=excluded.students_passed_class10,students_applied_class12=excluded.students_applied_class12,
students_passed_class12=excluded.students_passed_class12,repeaters_students=excluded.repeaters_students,no_cwsn_students_rec_incentive=excluded.no_cwsn_students_rec_incentive,
no_gen_students_rec_incentive=excluded.no_gen_students_rec_incentive,no_cat_students_rec_incentive=excluded.no_cat_students_rec_incentive,
no_students_received_incentives=excluded.no_students_received_incentives,students_got_placement_class10=excluded.students_got_placement_class10,
students_got_placement_class12=excluded.students_got_placement_class12,no_of_teachers=excluded.no_of_teachers,tch_avg_years_service=excluded.tch_avg_years_service,
trn_crc=excluded.trn_crc,trn_brc=excluded.trn_brc,trn_diet=excluded.trn_diet,trn_other=excluded.trn_other,trained_cwsn=excluded.trained_cwsn,trained_comp=excluded.trained_comp,
cwsn_sch_yn=excluded.cwsn_sch_yn,is_students_counselling=excluded.is_students_counselling,students_pre_primary_boys=excluded.students_pre_primary_boys,
students_pre_primary_girls=excluded.students_pre_primary_girls,anganwadi_boys=excluded.anganwadi_boys,anganwadi_girls=excluded.anganwadi_girls,
avg_instruct_days=excluded.avg_instruct_days,avg_scl_hours_childrens=excluded.avg_scl_hours_childrens,avg_work_hours_teachers=excluded.avg_work_hours_teachers,cce_yn_pri=excluded.cce_yn_pri,
cce_yn_upr=excluded.cce_yn_upr,cce_yn_sec=excluded.cce_yn_sec,cce_yn_hsec=excluded.cce_yn_hsec,students_enrolled_rte=excluded.students_enrolled_rte,
is_txtbk_pre_pri=excluded.is_txtbk_pre_pri,is_txtbk_pri=excluded.is_txtbk_pri,is_txtbk_upr=excluded.is_txtbk_upr,is_txtbk_sec=excluded.is_txtbk_sec,
is_txtbk_hsec=excluded.is_txtbk_hsec,is_tle_pre_pri=excluded.is_tle_pre_pri,is_tle_pri=excluded.is_tle_pri,is_tle_upr=excluded.is_tle_upr,is_tle_sec=excluded.is_tle_sec,
is_tle_hsec=excluded.is_tle_hsec,is_playmat_pre_pri=excluded.is_playmat_pre_pri,is_playmat_pri=excluded.is_playmat_pri,is_playmat_upr=excluded.is_playmat_upr,
is_playmat_sec=excluded.is_playmat_sec,is_playmat_hsec=excluded.is_playmat_hsec,no_visit_crc=excluded.no_visit_crc,no_visit_brc=excluded.no_visit_brc,no_visit_dis=excluded.no_visit_dis,
total_male_smc_members=excluded.total_male_smc_members,total_female_smc_members=excluded.total_female_smc_members,total_male_smc_trained=excluded.total_male_smc_trained,
total_female_smc_trained=excluded.total_female_smc_trained,total_meetings_smc=excluded.total_meetings_smc,is_smdc_school=excluded.is_smdc_school,is_training_oosc=excluded.is_training_oosc,
anganwadi_yn=excluded.anganwadi_yn,tch_atndnc_yn=excluded.tch_atndnc_yn,stu_atndnc_yn=excluded.stu_atndnc_yn,sdmp_plan_yn=excluded.sdmp_plan_yn,cctv_cam_yn=excluded.cctv_cam_yn,
fire_ext_yn=excluded.fire_ext_yn,nodal_tch_yn=excluded.nodal_tch_yn,slfdef_grt_yn=excluded.slfdef_grt_yn,slfdef_trained=excluded.slfdef_trained,dev_grt_e=excluded.dev_grt_e,
maint_grt_e=excluded.maint_grt_e,tlm_grt_e=excluded.tlm_grt_e,cw_grt_e=excluded.cw_grt_e,anl_grt_e=excluded.anl_grt_e,minrep_grt_e=excluded.minrep_grt_e,labrep_grt_e=excluded.labrep_grt_e,
book_grt_e=excluded.book_grt_e,elec_grt_e=excluded.elec_grt_e,oth_grt_e=excluded.oth_grt_e,compo_grt_e=excluded.compo_grt_e,lib_grt_e=excluded.lib_grt_e,sport_grt_e=excluded.sport_grt_e,
media_grt_e=excluded.media_grt_e,smc_grt_e=excluded.smc_grt_e,presch_grt_e=excluded.presch_grt_e,dev_grt_r=excluded.dev_grt_r,
maint_grt_r=excluded.maint_grt_r,tlm_grt_r=excluded.tlm_grt_r,cw_grt_r=excluded.cw_grt_r,anl_grt_r=excluded.anl_grt_r,minrep_grt_r=excluded.minrep_grt_r,labrep_grt_r=excluded.labrep_grt_r,
book_grt_r=excluded.book_grt_r,elec_grt_r=excluded.elec_grt_r,oth_grt_r=excluded.oth_grt_r,compo_grt_r=excluded.compo_grt_r,lib_grt_r=excluded.lib_grt_r,sport_grt_r=excluded.sport_grt_r,
media_grt_r=excluded.media_grt_r,smc_grt_r=excluded.smc_grt_r,presch_grt_r=excluded.presch_grt_r,nsqf_yn=excluded.nsqf_yn,voc_course_yn=excluded.voc_course_yn,
students_applied_class8=excluded.students_applied_class8,students_passed_class8=excluded.students_passed_class8,students_scored_above60_c8=excluded.students_scored_above60_c8,
no_of_newadm_kids=excluded.no_of_newadm_kids,no_of_newadm_boy_kids=excluded.no_of_newadm_boy_kids,no_of_newadm_girl_kids=excluded.no_of_newadm_girl_kids,
students_opt_placement_class12 =excluded.students_opt_placement_class12 ,students_opt_voc_fields_class12 =excluded.students_opt_voc_fields_class12 ,
students_opt_non_voc_fields_class12 =excluded.students_opt_non_voc_fields_class12 ,no_of_students_self_employed_class12=excluded.no_of_students_self_employed_class12,
total_nsqf_class_conducted=excluded.total_nsqf_class_conducted,students_applied_class5=excluded.students_applied_class5,students_passed_class5=excluded.students_passed_class5,
students_scored_above60_c5=excluded.students_scored_above60_c5,students_opt_placement_class10=excluded.students_opt_placement_class10,
students_opt_voc_fields_class10=excluded.students_opt_voc_fields_class10,students_opt_non_voc_fields_class10=excluded.students_opt_non_voc_fields_class10,
no_of_students_self_employed_class10=excluded.no_of_students_self_employed_class10,total_blocks=excluded.total_blocks,total_blocks_pucca=excluded.total_blocks_pucca,
total_classrooms=excluded.total_classrooms,total_classrooms_instructional=excluded.total_classrooms_instructional,land_available_expansion=excluded.land_available_expansion,
have_toilet=excluded.have_toilet,no_of_boys_toilet=excluded.no_of_boys_toilet,no_of_girls_toilet=excluded.no_of_girls_toilet,no_of_boys_cwsn_toilet=excluded.no_of_boys_cwsn_toilet,
no_of_boys_cwsn_func_toilet=excluded.no_of_boys_cwsn_func_toilet,no_of_girls_cwsn_toilet=excluded.no_of_girls_cwsn_toilet,no_of_girls_cwsn_func_toilet=excluded.no_of_girls_cwsn_func_toilet,
no_of_boys_urinals=excluded.no_of_boys_urinals,no_of_girls_urinals=excluded.no_of_girls_urinals,handwash_available=excluded.handwash_available,
incinerator_girls_toilet=excluded.incinerator_girls_toilet,drinking_water=excluded.drinking_water,no_of_hand_pumps=excluded.no_of_hand_pumps,
no_of_func_hand_pumps=excluded.no_of_func_hand_pumps,no_of_well=excluded.no_of_well,no_of_func_well=excluded.no_of_func_well,no_of_tap_water=excluded.no_of_tap_water,
no_of_func_tap_water=excluded.no_of_func_tap_water,no_of_bottle_water=excluded.no_of_bottle_water,no_of_func_bottle_water=excluded.no_of_func_bottle_water,
water_purifier=excluded.water_purifier,electricity_available=excluded.electricity_available,solar_panel_available=excluded.solar_panel_available,library_available=excluded.library_available,
no_of_library_books=excluded.no_of_library_books,playground=excluded.playground,playground_alt=excluded.playground_alt,ramps=excluded.ramps,hand_rail=excluded.hand_rail,
no_of_students_hv_furniture=excluded.no_of_students_hv_furniture,integrated_science_lab=excluded.integrated_science_lab,library_room=excluded.library_room,computer_lab=excluded.computer_lab,
tinkering_lab=excluded.tinkering_lab,science_kit=excluded.science_kit,maths_kit=excluded.maths_kit,laptop_available=excluded.laptop_available,no_of_laptop=excluded.no_of_laptop,
tablets_available=excluded.tablets_available,no_of_tablets=excluded.no_of_tablets,desktop_available=excluded.desktop_available,no_of_desktops=excluded.no_of_desktops,
integrated_pc_tld=excluded.integrated_pc_tld,no_of_integrated_pc_tld=excluded.no_of_integrated_pc_tld,no_of_func_integrated_pc_tld=excluded.no_of_func_integrated_pc_tld,
digital_boards_with_cms=excluded.digital_boards_with_cms,no_of_digital_boards_with_cms=excluded.no_of_digital_boards_with_cms,
no_of_func_digital_boards_with_cms=excluded.no_of_func_digital_boards_with_cms,server_available=excluded.server_available,no_of_servers=excluded.no_of_servers,
projectors_available=excluded.projectors_available,no_of_projectors=excluded.no_of_projectors,led_available=excluded.led_available,no_of_led=excluded.no_of_led,
printer_available=excluded.printer_available,no_of_printers=excluded.no_of_printers,scanner_available=excluded.scanner_available,no_of_scanners=excluded.no_of_scanners,
web_cam_available=excluded.web_cam_available,no_of_web_cams=excluded.no_of_web_cams,generator_available=excluded.generator_available,no_of_generators=excluded.no_of_generators,
internet_available=excluded.internet_available,dth_available=excluded.dth_available,digital_resources=excluded.digital_resources,tech_based_sol_cwsn=excluded.tech_based_sol_cwsn,
ict_for_teaching=excluded.ict_for_teaching,no_of_fresh_students_enrolled=excluded.no_of_fresh_students_enrolled,nontch_days=excluded.nontch_days,
no_of_sections_class0=excluded.no_of_sections_class0,no_of_sections_class1=excluded.no_of_sections_class1,no_of_sections_class2=excluded.no_of_sections_class2,
no_of_sections_class3=excluded.no_of_sections_class3,no_of_sections_class4=excluded.no_of_sections_class4,no_of_sections_class5=excluded.no_of_sections_class5,
no_of_sections_class6=excluded.no_of_sections_class6,no_of_sections_class7=excluded.no_of_sections_class7,no_of_sections_class8=excluded.no_of_sections_class8,
no_of_sections_class9=excluded.no_of_sections_class9,no_of_sections_class10=excluded.no_of_sections_class10,no_of_sections_class11=excluded.no_of_sections_class11,
no_of_sections_class12=excluded.no_of_sections_class12,school_established_age=excluded.school_established_age,shift_sch_yn=excluded.shift_sch_yn,resi_sch_yn=excluded.resi_sch_yn,
boarding_pri_yn=excluded.boarding_pri_yn,boarding_pri_b=excluded.boarding_pri_b,boarding_pri_g=excluded.boarding_pri_g,boarding_upr_yn=excluded.boarding_upr_yn,
boarding_upr_b=excluded.boarding_upr_b,boarding_upr_g=excluded.boarding_upr_g,boarding_sec_yn=excluded.boarding_sec_yn,boarding_sec_b=excluded.boarding_sec_b,
boarding_sec_g=excluded.boarding_sec_g,boarding_hsec_yn=excluded.boarding_hsec_yn,boarding_hsec_b=excluded.boarding_hsec_b,boarding_hsec_g=excluded.boarding_hsec_g,
minority_yn=excluded.minority_yn,mtongue_pri=excluded.mtongue_pri,prevoc_yn=excluded.prevoc_yn,anganwadi_tch_trained=excluded.anganwadi_tch_trained,
no_of_hsec_boys_rte=excluded.no_of_hsec_boys_rte,no_of_hsec_girls_rte=excluded.no_of_hsec_girls_rte,no_of_hsec_boys_rte_facility=excluded.no_of_hsec_boys_rte_facility,
no_of_hsec_girls_rte_facility=excluded.no_of_hsec_girls_rte_facility,no_of_ews_hs_boys_rte_enr=excluded.no_of_ews_hs_boys_rte_enr,no_of_ews_hs_girls_rte_enr=excluded.no_of_ews_hs_girls_rte_enr,
spltrg_cy_prov_b=excluded.spltrg_cy_prov_b,spltrg_cy_prov_g=excluded.spltrg_cy_prov_g,spltrg_py_enrol_b=excluded.spltrg_py_enrol_b,spltrg_py_enrol_g=excluded.spltrg_py_enrol_g,
spltrg_py_prov_b=excluded.spltrg_py_prov_b,spltrg_py_prov_g=excluded.spltrg_py_prov_g,remedial_tch_enrol=excluded.remedial_tch_enrol,no_inspect=excluded.no_inspect,
smc_par_m=excluded.smc_par_m,smc_par_f=excluded.smc_par_f,smc_par_sc=excluded.smc_par_sc,smc_par_st=excluded.smc_par_st,smc_par_ews=excluded.smc_par_ews,
smc_par_min=excluded.smc_par_min,smc_lgb_m=excluded.smc_lgb_m,smc_lgb_f=excluded.smc_lgb_f,smc_tch_m=excluded.smc_tch_m,smc_tch_f=excluded.smc_tch_f,smdc_mem_m=excluded.smdc_mem_m,
smdc_mem_f=excluded.smdc_mem_f,smdc_par_m=excluded.smdc_par_m,smdc_par_f=excluded.smdc_par_f,smdc_par_ews_m=excluded.smdc_par_ews_m,smdc_par_ews_f=excluded.smdc_par_ews_f,
smdc_lgb_m=excluded.smdc_lgb_m,smdc_lgb_f=excluded.smdc_lgb_f,smdc_ebmc_m=excluded.smdc_ebmc_m,smdc_ebmc_f=excluded.smdc_ebmc_f,smdc_women_f=excluded.smdc_women_f,
smdc_scst_m=excluded.smdc_scst_m,smdc_scst_f=excluded.smdc_scst_f,smdc_deo_m=excluded.smdc_deo_m,smdc_deo_f=excluded.smdc_deo_f,smdc_audit_m=excluded.smdc_audit_m,
smdc_audit_f=excluded.smdc_audit_f,smdc_subexp_m=excluded.smdc_subexp_m,smdc_subexp_f=excluded.smdc_subexp_f,smdc_tch_m=excluded.smdc_tch_m,smdc_tch_f=excluded.smdc_tch_f,
smdc_trained_m=excluded.smdc_trained_m,smdc_trained_f=excluded.smdc_trained_f,smdc_meetings=excluded.smdc_meetings,smdc_sdp_yn=excluded.smdc_sdp_yn,
smdc_pta_meeting=excluded.smdc_pta_meeting,tch_regular=excluded.tch_regular,tch_contract=excluded.tch_contract,tch_part_time=excluded.tch_part_time,
nontch_accnt=excluded.nontch_accnt,nontch_lib_asst=excluded.nontch_lib_asst,nontch_lab_asst=excluded.nontch_lab_asst,nontch_udc=excluded.nontch_udc,nontch_ldc=excluded.nontch_ldc,
nontch_peon=excluded.nontch_peon,nontch_watchman=excluded.nontch_watchman,nsqf_tch_industry_exp=excluded.nsqf_tch_industry_exp,nsqf_tch_training_exp=excluded.nsqf_tch_training_exp,
sch_eval_yn=excluded.sch_eval_yn,improv_plan_yn=excluded.improv_plan_yn,sch_pfms_yn=excluded.sch_pfms_yn,struct_safaud_yn=excluded.struct_safaud_yn,
nonstr_safaud_yn=excluded.nonstr_safaud_yn,safty_trng_yn=excluded.safty_trng_yn,dismgmt_taug_yn=excluded.dismgmt_taug_yn,ngo_asst_yn=excluded.ngo_asst_yn,
psu_asst_yn=excluded.psu_asst_yn,comm_asst_yn=excluded.comm_asst_yn,oth_asst_yn=excluded.oth_asst_yn,ict_reg_yn=excluded.ict_reg_yn,sport_reg_yn=excluded.sport_reg_yn,
lib_reg_yn=excluded.lib_reg_yn,updated_on=now()';
Execute transaction_insert; 
return 0;
END;
$$LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_udise_table()
RETURNS text AS
$$
DECLARE
udise_query text:='select string_agg(replace(trim(LOWER(column_name)),'' '',''_'')||'' numeric default 0'','','') from udise_config where status = true
and type=''metric''';
udise_cols text; 
temp_table text;
aggregation_table text;
BEGIN
Execute udise_query into udise_cols;
IF udise_cols <> '' THEN 
temp_table='create table if not exists udise_school_metrics_temp (academic_year text,udise_school_id bigint,'||udise_cols||',
created_on timestamp,updated_on timestamp
,primary key(udise_school_id))';
Execute temp_table; 
aggregation_table='create table if not exists udise_school_metrics_agg (academic_year text,udise_school_id bigint,school_name varchar(200),school_latitude double precision
,school_longitude double precision,district_id bigint,district_name varchar(100),district_latitude double precision,district_longitude double precision,
block_id bigint,block_name varchar(100),block_latitude double precision,block_longitude double precision,
cluster_id bigint,cluster_name varchar(100),cluster_latitude double precision,cluster_longitude double precision,'||udise_cols||',
created_on timestamp,updated_on timestamp
,primary key(udise_school_id))';
Execute aggregation_table; 
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

update udise_config set metric_config ='static' where metric_config in ('') or metric_config is null;
select create_udise_table();

CREATE OR REPLACE FUNCTION insert_udise_temp()
RETURNS text AS
$$
DECLARE
temp_insert text;
st_select text:='select string_agg(lower(column_name),'','') from udise_config where status = true
and lower(type)=''metric''';
st_select_cols text;
ex_agg text:='select string_agg(''((COALESCE(''||replace(trans_columns,'','','',0)+COALESCE('')||'',0))/''||
	array_length(regexp_split_to_array(trans_columns,'',''),1)||'') as ''||lower(column_name),'','') from udise_config where status = true
and lower(type)=''metric'' and lower(metric_config)=''created''';
ex_agg_cols text;
st_update text:='select string_agg(lower(column_name)||''=excluded.''||lower(column_name),'','') from udise_config where status = true
and lower(type)=''metric''';
st_update_cols text;
BEGIN
EXECUTE st_select into st_select_cols;
EXECUTE ex_agg into ex_agg_cols;
EXECUTE st_update into st_update_cols;
IF ex_agg_cols <>'' then 
temp_insert='insert into udise_school_metrics_temp(
  udise_school_id,academic_year,'||st_select_cols||')
select udise_school_id,academic_year,'||st_select_cols||' from 
(select udise_school_id,academic_year,
round(cast(sum(no_cwsn_students_rec_incentive) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as adm_cwsn_students_incentives,
round(cast(sum(no_gen_students_rec_incentive) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as adm_general_students_incentives,
round(cast(sum(no_cat_students_rec_incentive) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as adm_category_students_incentives,
sum(case when is_students_counselling = ''1'' then 1 else 0 end) as  adm_students_counselling,
sum(avg_instruct_days) as adm_instruct_days,
sum(avg_scl_hours_childrens) as adm_avg_school_hours_childrens,
sum(avg_work_hours_teachers) as adm_avg_working_hours_teachers,
sum(case when is_training_oosc= ''1'' then 1 else 0 end) as adm_training_oosc,
sum(case when stu_atndnc_yn= ''1'' then 1 else 0 end) as adm_student_attendance_electronic,
sum(case when tch_atndnc_yn= ''1'' then 1 else 0 end) as adm_teacher_attendance_electronic,
sum(case when nodal_tch_yn= ''1'' then 1 else 0 end) as adm_nodal_teacher,
round(NULLIF(cast(sum(no_of_students) as numeric),0)/NULLIF(cast(SUM(is_txtbk_pre_pri+is_txtbk_pri+is_txtbk_upr+is_txtbk_sec+is_txtbk_hsec) as numeric),0),2) as adm_free_textbook_score,
round(NULLIF(cast(sum(no_of_students) as numeric),0)/NULLIF(cast(SUM(is_tle_pre_pri+is_tle_pri+is_tle_upr+is_tle_sec+is_tle_hsec) as numeric),0),2) as adm_tech_education_score,
round(NULLIF(cast(sum(no_of_students) as numeric),0)/NULLIF(cast(SUM(is_playmat_pre_pri+is_playmat_pri+is_playmat_upr+is_playmat_sec+is_playmat_hsec) as numeric),0),2) as adm_sports_equipments_score,
sum(case when language_room= ''1'' then 1 else 0 end) as artlab_language_room,
sum(case when geography_room= ''1'' then 1 else 0 end) as artlab_geography_room,
sum(case when science_room= ''1'' then 1 else 0 end) as artlab_home_science_room,
sum(case when psychology_room= ''1'' then 1 else 0 end) as artlab_psychology_room,
round(cast(SUM(total_male_smc_trained+total_female_smc_trained) as numeric)/
  NULLIF(cast(SUM(total_male_smc_members +total_female_smc_members) as numeric),0),2)*100.0 as cp_smc_members_training_provided,
sum(total_meetings_smc)as cp_total_meetings_held_smc,
sum(case when is_smdc_school= ''1'' then 1 else 0 end) as cp_smdc_school,
round(cast(sum(cwsn_students) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as enr_cwsn_students,
round(cast(sum(repeaters_students) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as enr_repeaters_students,
round(cast(sum(no_students_girls) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as enr_girls_students,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100.0 as enr_pupil_teacher_ratio,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(classrooms_good_condition) as numeric),0),2)*100 as enr_students_per_classroom,
round(cast(sum(dev_grt_e) as numeric)/NULLIF(cast(sum(dev_grt_r) as numeric),0),2)*100 as ge_spent_school_development,
round(cast(sum(maint_grt_e) as numeric)/NULLIF(cast(sum(maint_grt_r) as numeric),0),2)*100 as ge_spent_school_maintenance,
round(cast(sum(tlm_grt_e) as numeric)/NULLIF(cast(sum(tlm_grt_r) as numeric),0),2)*100 as ge_spent_for_teachers,
round(cast(sum(cw_grt_e) as numeric)/NULLIF(cast(sum(cw_grt_r) as numeric),0),2)*100 as ge_spent_civil_works,
round(cast(sum(anl_grt_e) as numeric)/NULLIF(cast(sum(anl_grt_r) as numeric),0),2)*100 as ge_spent_annual_school,
round(cast(sum(minrep_grt_e) as numeric)/NULLIF(cast(sum(minrep_grt_r) as numeric),0),2)*100 as ge_spent_minor_repair,
round(cast(sum(labrep_grt_e) as numeric)/NULLIF(cast(sum(labrep_grt_r) as numeric),0),2)*100 as ge_spent_lab_repair,
round(cast(sum(book_grt_e) as numeric)/NULLIF(cast(sum(book_grt_r) as numeric),0),2)*100 as ge_spent_books_purchase,
round(cast(sum(elec_grt_e) as numeric)/NULLIF(cast(sum(elec_grt_r) as numeric),0),2)*100 as ge_spent_on_wte,
round(cast(sum(oth_grt_e) as numeric)/NULLIF(cast(sum(oth_grt_r) as numeric),0),2)*100 as ge_spent_others,
round(cast(sum(compo_grt_e) as numeric)/NULLIF(cast(sum(compo_grt_r) as numeric),0),2)*100 as ge_school_grants,
round(cast(sum(lib_grt_e) as numeric)/NULLIF(cast(sum(lib_grt_r) as numeric),0),2)*100 as ge_spent_library,
round(cast(sum(sport_grt_e) as numeric)/NULLIF(cast(sum(sport_grt_r) as numeric),0),2)*100 as ge_spent_physical_educ,
round(cast(sum(media_grt_e) as numeric)/NULLIF(cast(sum(media_grt_r) as numeric),0),2)*100 as ge_spent_media,
round(cast(sum(smc_grt_e) as numeric)/NULLIF(cast(sum(smc_grt_r) as numeric),0),2)*100 as ge_spent_smc_smdc,
round(cast(sum(presch_grt_e) as numeric)/NULLIF(cast(sum(presch_grt_r) as numeric),0),2)*100 as ge_spent_pre_school,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(laptop_fun) as numeric),0),2) as ict_func_laptop_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(tablets_fun) as numeric),0),2) as ict_func_tablets_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(desktop_fun) as numeric),0),2) as ict_func_desktop_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(server_fun) as numeric),0),2) as ict_func_servers_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(projector_fun) as numeric),0),2) as ict_func_projector_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(led_fun) as numeric),0),2) as ict_func_led_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(webcam_fun) as numeric),0),2) as ict_func_webcam_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(generator_fun) as numeric),0),2) as ict_func_pwrbkp_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(printer_fun) as numeric),0),2) as ict_func_printer_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(scanner_fun) as numeric),0),2) as ict_func_scanner_per_student,
sum(case when medchk_yn= ''1'' then 1 else 0 end) as med_checkup_conducted,
sum(case when dewormtab_yn= ''1'' then 1 else 0 end) as med_dewoming_tablets,
sum(case when irontab_yn= ''1'' then 1 else 0 end) as med_iron_tablets,
round(cast(sum(students_got_placement_class10) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100 as nsqf_placement_class_10_placed,
round(cast(sum(students_got_placement_class12) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100 as nsqf_placement_class_12_placed,
round(cast(sum(no_students_received_incentives) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100 as nsqf_students_incentives,
round(cast(SUM(
  case when cce_yn_pri = ''1'' then 1 else 0 end+ case when cce_yn_upr = ''1'' then 1 else 0 end+
  case when  cce_yn_sec = ''1'' then 1 else 0 end+ case when cce_yn_hsec = ''1'' then 1 else 0 end
  ) as numeric)/4,2) as pi_cce,
round(cast(sum(students_enrolled_rte) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100 as pi_enrolled_rte,
sum(case when sdmp_plan_yn= ''1'' then 1 else 0 end) as safety_sdmp,
sum(case when cctv_cam_yn= ''1'' then 1 else 0 end) as safety_cctv,
sum(case when fire_ext_yn= ''1'' then 1 else 0 end) as safety_fire_extinguisher,
sum(case when slfdef_grt_yn= ''1'' then 1 else 0 end) as safety_is_girls_trained_defense,
round(cast(sum(slfdef_trained) as numeric)/NULLIF(cast(sum(no_students_girls) as numeric),0),2)*100 as safety_girls_trained_defense,
round(cast(sum(no_students_boys) as numeric)/NULLIF(cast(sum(no_of_boys_func_toilet) as numeric),0),2) as infra_boys_per_func_toilet,
round(cast(sum(no_students_girls) as numeric)/NULLIF(cast(sum(no_of_girls_func_toilet) as numeric),0),2) as infra_girls_per_func_toilet,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(SUM(no_boys_func_urinals+no_girls_func_urinals) as numeric),0),2)as infra_students_per_urinals,
sum(case when cwsn_sch_yn= ''1'' then 1 else 0 end) as infra_cwsn_school,
sum(case when anganwadi_yn= ''1'' then 1 else 0 end) as infra_anganwadi,
sum(case when voc_course_yn= ''1'' then 1 else 0 end) as infra_vocational_course,
sum(case when nsqf_yn= ''1'' then 1 else 0 end) as infra_nsqf,
sum(no_visit_crc) as insp_crc,
sum(no_visit_brc)as insp_brc,
sum(no_visit_dis)as insp_dis,
round(cast(sum(students_passed_class10) as numeric)/NULLIF(cast(sum(students_applied_class10) as numeric),0),2)*100 as perf_class_10_passed,
round(cast(sum(students_passed_class12) as numeric)/NULLIF(cast(sum(students_applied_class12) as numeric),0),2)*100 as perf_class_12_passed,
sum(case when phy_lab_yn= ''1'' then 1 else 0 end) as sclab_physics_room,
sum(case when chem_lab_yn= ''1'' then 1 else 0 end) as sclab_chemistry_room,
sum(case when bio_lab_yn= ''1'' then 1 else 0 end) as sclab_biology_room,
sum(case when math_lab_yn= ''1'' then 1 else 0 end) as sclab_maths_room,
sum(tch_avg_years_service) as tch_experience,
round(cast(sum(trn_brc) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_trained_brc,
round(cast(sum(trn_crc) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_trained_crc,
round(cast(sum(trn_diet) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_trained_diet,
round(cast(sum(trn_other) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_trained_other,
round(cast(sum(trained_cwsn) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_teaching_cwsn,
round(cast(sum(trained_comp) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_teaching_use_computer
,'||ex_agg_cols||'
from udise_school_metrics_trans group by udise_school_id,academic_year)as s
on conflict(udise_school_id)
do update set 
academic_year=excluded.academic_year,'||st_update_cols||',updated_on=now()';
else 
temp_insert='insert into udise_school_metrics_temp(
  udise_school_id,academic_year,'||st_select_cols||')
select udise_school_id,academic_year,'||st_select_cols||' from 
(select udise_school_id,academic_year,
round(cast(sum(no_cwsn_students_rec_incentive) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as adm_cwsn_students_incentives,
round(cast(sum(no_gen_students_rec_incentive) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as adm_general_students_incentives,
round(cast(sum(no_cat_students_rec_incentive) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as adm_category_students_incentives,
sum(case when is_students_counselling = ''1'' then 1 else 0 end) as  adm_students_counselling,
sum(avg_instruct_days) as adm_instruct_days,
sum(avg_scl_hours_childrens) as adm_avg_school_hours_childrens,
sum(avg_work_hours_teachers) as adm_avg_working_hours_teachers,
sum(case when is_training_oosc= ''1'' then 1 else 0 end) as adm_training_oosc,
sum(case when stu_atndnc_yn= ''1'' then 1 else 0 end) as adm_student_attendance_electronic,
sum(case when tch_atndnc_yn= ''1'' then 1 else 0 end) as adm_teacher_attendance_electronic,
sum(case when nodal_tch_yn= ''1'' then 1 else 0 end) as adm_nodal_teacher,
round(NULLIF(cast(sum(no_of_students) as numeric),0)/NULLIF(cast(SUM(is_txtbk_pre_pri+is_txtbk_pri+is_txtbk_upr+is_txtbk_sec+is_txtbk_hsec) as numeric),0),2) as adm_free_textbook_score,
round(NULLIF(cast(sum(no_of_students) as numeric),0)/NULLIF(cast(SUM(is_tle_pre_pri+is_tle_pri+is_tle_upr+is_tle_sec+is_tle_hsec) as numeric),0),2) as adm_tech_education_score,
round(NULLIF(cast(sum(no_of_students) as numeric),0)/NULLIF(cast(SUM(is_playmat_pre_pri+is_playmat_pri+is_playmat_upr+is_playmat_sec+is_playmat_hsec) as numeric),0),2) as adm_sports_equipments_score,
sum(case when language_room= ''1'' then 1 else 0 end) as artlab_language_room,
sum(case when geography_room= ''1'' then 1 else 0 end) as artlab_geography_room,
sum(case when science_room= ''1'' then 1 else 0 end) as artlab_home_science_room,
sum(case when psychology_room= ''1'' then 1 else 0 end) as artlab_psychology_room,
round(cast(SUM(total_male_smc_trained+total_female_smc_trained) as numeric)/
  NULLIF(cast(SUM(total_male_smc_members +total_female_smc_members) as numeric),0),2)*100.0 as cp_smc_members_training_provided,
sum(total_meetings_smc)as cp_total_meetings_held_smc,
sum(case when is_smdc_school= ''1'' then 1 else 0 end) as cp_smdc_school,
round(cast(sum(cwsn_students) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as enr_cwsn_students,
round(cast(sum(repeaters_students) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as enr_repeaters_students,
round(cast(sum(no_students_girls) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100.0 as enr_girls_students,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100.0 as enr_pupil_teacher_ratio,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(classrooms_good_condition) as numeric),0),2)*100 as enr_students_per_classroom,
round(cast(sum(dev_grt_e) as numeric)/NULLIF(cast(sum(dev_grt_r) as numeric),0),2)*100 as ge_spent_school_development,
round(cast(sum(maint_grt_e) as numeric)/NULLIF(cast(sum(maint_grt_r) as numeric),0),2)*100 as ge_spent_school_maintenance,
round(cast(sum(tlm_grt_e) as numeric)/NULLIF(cast(sum(tlm_grt_r) as numeric),0),2)*100 as ge_spent_for_teachers,
round(cast(sum(cw_grt_e) as numeric)/NULLIF(cast(sum(cw_grt_r) as numeric),0),2)*100 as ge_spent_civil_works,
round(cast(sum(anl_grt_e) as numeric)/NULLIF(cast(sum(anl_grt_r) as numeric),0),2)*100 as ge_spent_annual_school,
round(cast(sum(minrep_grt_e) as numeric)/NULLIF(cast(sum(minrep_grt_r) as numeric),0),2)*100 as ge_spent_minor_repair,
round(cast(sum(labrep_grt_e) as numeric)/NULLIF(cast(sum(labrep_grt_r) as numeric),0),2)*100 as ge_spent_lab_repair,
round(cast(sum(book_grt_e) as numeric)/NULLIF(cast(sum(book_grt_r) as numeric),0),2)*100 as ge_spent_books_purchase,
round(cast(sum(elec_grt_e) as numeric)/NULLIF(cast(sum(elec_grt_r) as numeric),0),2)*100 as ge_spent_on_wte,
round(cast(sum(oth_grt_e) as numeric)/NULLIF(cast(sum(oth_grt_r) as numeric),0),2)*100 as ge_spent_others,
round(cast(sum(compo_grt_e) as numeric)/NULLIF(cast(sum(compo_grt_r) as numeric),0),2)*100 as ge_school_grants,
round(cast(sum(lib_grt_e) as numeric)/NULLIF(cast(sum(lib_grt_r) as numeric),0),2)*100 as ge_spent_library,
round(cast(sum(sport_grt_e) as numeric)/NULLIF(cast(sum(sport_grt_r) as numeric),0),2)*100 as ge_spent_physical_educ,
round(cast(sum(media_grt_e) as numeric)/NULLIF(cast(sum(media_grt_r) as numeric),0),2)*100 as ge_spent_media,
round(cast(sum(smc_grt_e) as numeric)/NULLIF(cast(sum(smc_grt_r) as numeric),0),2)*100 as ge_spent_smc_smdc,
round(cast(sum(presch_grt_e) as numeric)/NULLIF(cast(sum(presch_grt_r) as numeric),0),2)*100 as ge_spent_pre_school,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(laptop_fun) as numeric),0),2) as ict_func_laptop_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(tablets_fun) as numeric),0),2) as ict_func_tablets_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(desktop_fun) as numeric),0),2) as ict_func_desktop_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(server_fun) as numeric),0),2) as ict_func_servers_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(projector_fun) as numeric),0),2) as ict_func_projector_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(led_fun) as numeric),0),2) as ict_func_led_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(webcam_fun) as numeric),0),2) as ict_func_webcam_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(generator_fun) as numeric),0),2) as ict_func_pwrbkp_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(printer_fun) as numeric),0),2) as ict_func_printer_per_student,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(sum(scanner_fun) as numeric),0),2) as ict_func_scanner_per_student,
sum(case when medchk_yn= ''1'' then 1 else 0 end) as med_checkup_conducted,
sum(case when dewormtab_yn= ''1'' then 1 else 0 end) as med_dewoming_tablets,
sum(case when irontab_yn= ''1'' then 1 else 0 end) as med_iron_tablets,
round(cast(sum(students_got_placement_class10) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100 as nsqf_placement_class_10_placed,
round(cast(sum(students_got_placement_class12) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100 as nsqf_placement_class_12_placed,
round(cast(sum(no_students_received_incentives) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100 as nsqf_students_incentives,
round(cast(SUM(
  case when cce_yn_pri = ''1'' then 1 else 0 end+ case when cce_yn_upr = ''1'' then 1 else 0 end+
  case when  cce_yn_sec = ''1'' then 1 else 0 end+ case when cce_yn_hsec = ''1'' then 1 else 0 end
  ) as numeric)/4,2) as pi_cce,
round(cast(sum(students_enrolled_rte) as numeric)/NULLIF(cast(sum(no_of_students) as numeric),0),2)*100 as pi_enrolled_rte,
sum(case when sdmp_plan_yn= ''1'' then 1 else 0 end) as safety_sdmp,
sum(case when cctv_cam_yn= ''1'' then 1 else 0 end) as safety_cctv,
sum(case when fire_ext_yn= ''1'' then 1 else 0 end) as safety_fire_extinguisher,
sum(case when slfdef_grt_yn= ''1'' then 1 else 0 end) as safety_is_girls_trained_defense,
round(cast(sum(slfdef_trained) as numeric)/NULLIF(cast(sum(no_students_girls) as numeric),0),2)*100 as safety_girls_trained_defense,
round(cast(sum(no_students_boys) as numeric)/NULLIF(cast(sum(no_of_boys_func_toilet) as numeric),0),2) as infra_boys_per_func_toilet,
round(cast(sum(no_students_girls) as numeric)/NULLIF(cast(sum(no_of_girls_func_toilet) as numeric),0),2) as infra_girls_per_func_toilet,
round(cast(sum(no_of_students) as numeric)/NULLIF(cast(SUM(no_boys_func_urinals+no_girls_func_urinals) as numeric),0),2)as infra_students_per_urinals,
sum(case when cwsn_sch_yn= ''1'' then 1 else 0 end) as infra_cwsn_school,
sum(case when anganwadi_yn= ''1'' then 1 else 0 end) as infra_anganwadi,
sum(case when voc_course_yn= ''1'' then 1 else 0 end) as infra_vocational_course,
sum(case when nsqf_yn= ''1'' then 1 else 0 end) as infra_nsqf,
sum(no_visit_crc) as insp_crc,
sum(no_visit_brc)as insp_brc,
sum(no_visit_dis)as insp_dis,
round(cast(sum(students_passed_class10) as numeric)/NULLIF(cast(sum(students_applied_class10) as numeric),0),2)*100 as perf_class_10_passed,
round(cast(sum(students_passed_class12) as numeric)/NULLIF(cast(sum(students_applied_class12) as numeric),0),2)*100 as perf_class_12_passed,
sum(case when phy_lab_yn= ''1'' then 1 else 0 end) as sclab_physics_room,
sum(case when chem_lab_yn= ''1'' then 1 else 0 end) as sclab_chemistry_room,
sum(case when bio_lab_yn= ''1'' then 1 else 0 end) as sclab_biology_room,
sum(case when math_lab_yn= ''1'' then 1 else 0 end) as sclab_maths_room,
sum(tch_avg_years_service) as tch_experience,
round(cast(sum(trn_brc) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_trained_brc,
round(cast(sum(trn_crc) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_trained_crc,
round(cast(sum(trn_diet) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_trained_diet,
round(cast(sum(trn_other) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_trained_other,
round(cast(sum(trained_cwsn) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_teaching_cwsn,
round(cast(sum(trained_comp) as numeric)/NULLIF(cast(sum(no_of_teachers) as numeric),0),2)*100 as tch_teaching_use_computer
from udise_school_metrics_trans group by udise_school_id,academic_year)as s
on conflict(udise_school_id)
do update set 
academic_year=excluded.academic_year,'||st_update_cols||',updated_on=now()';
END IF;
EXECUTE temp_insert;
return 0;
END;
$$LANGUAGE plpgsql;

/*udise range update*/

CREATE OR REPLACE FUNCTION udise_metrics_range()
RETURNS text AS
$$
DECLARE
update_range text;
BEGIN
update_range='insert into udise_metrics_range(metric_name,direction,created_on,updated_on)
select column_name,case when column_name in (''enr_repeaters_students'',''enr_pupil_teacher_ratio'',''enr_students_per_classroom'',''ict_func_laptop_per_student'',''ict_func_tablets_per_student'',
''ict_func_desktop_per_student'',''ict_func_servers_per_student'',''ict_func_projector_per_student'',''ict_func_led_per_student'',''ict_func_webcam_per_student'',
''ict_func_pwrbkp_per_student'',''ict_func_printer_per_student'',''ict_func_scanner_per_student'',''infra_boys_per_func_toilet'',''infra_girls_per_func_toilet'',
''infra_students_per_urinals'',
''adm_free_textbook_score'',''adm_tech_education_score'',''adm_sports_equipments_score'') then 
''backward'' 
when column_name in (''adm_cwsn_students_incentives'',''adm_general_students_incentives'',''adm_category_students_incentives'',
''adm_instruct_days'',''adm_avg_school_hours_childrens'',''adm_avg_working_hours_teachers'',''adm_free_textbook_score'',
''adm_tech_education_score'',''adm_sports_equipments_score'',''cp_smc_members_training_provided'',''cp_total_meetings_held_smc'',
''enr_cwsn_students'',''enr_girls_students'',''enr_pre_primary_childrens'',''enr_anganwadi_childrens'',''ge_spent_school_development'',
''ge_spent_school_maintenance'',''ge_spent_for_teachers'',''ge_spent_civil_works'',''ge_spent_annual_school'',''ge_spent_minor_repair'',
''ge_spent_lab_repair'',''ge_spent_books_purchase'',''ge_spent_on_wte'',''ge_spent_others'',''ge_school_grants'',''ge_spent_library'',
''ge_spent_physical_educ'',''ge_spent_media'',''ge_spent_smc_smdc'',''ge_spent_pre_school'',''nsqf_placement_class_10_placed'',
''nsqf_placement_class_12_placed'',''nsqf_students_incentives'',''pi_cce'',''pi_enrolled_rte'',''safety_girls_trained_defense'',
''insp_crc'',''insp_brc'',''insp_dis'',''perf_class_10_passed'',''perf_class_12_passed'',''tch_experience'',''tch_trained_brc'',''tch_trained_crc'',
''tch_trained_diet'',''tch_trained_other'',''tch_teaching_cwsn'',''tch_teaching_use_computer'') then ''forward''
else ''no'' end as direction,now(),now() from udise_config where column_name is not null and type=''metric'' and status=''1'' and lower(metric_config)<>''created''
on conflict(metric_name) do nothing;
insert into udise_metrics_range(metric_name,direction,created_on,updated_on)
	select lower(column_name),lower(direction),now(),now() from udise_config where status = true
and lower(type)=''metric'' and lower(metric_config)=''created''
on conflict(metric_name) do nothing';
Execute update_range; 
return 0;
END;
$$LANGUAGE plpgsql;

select udise_metrics_range();

CREATE OR REPLACE FUNCTION update_metrics_range()
RETURNS void
LANGUAGE plpgsql as
$func$
DECLARE
metrics_cols text;
BEGIN
FOR metrics_cols in select column_name from information_schema.columns where table_name='udise_school_metrics_temp' and data_type not in ('boolean') 
and column_name not in (select column_name from information_schema.columns where table_name='school_geo_master' or table_name ='school_hierarchy_details')
and column_name not in ('id','udise_school_id','academic_year')
LOOP
execute 'update udise_metrics_range as b
	set range=a.range,
	created_on=now(),
	updated_on=now()
	from (select percentile_cont(array[0,0.25,0.5,0.75,1]) within group (order by '||metrics_cols||')as range
from udise_school_metrics_temp)as a where metric_name='''||metrics_cols||'''';
raise info 'Stats updated for ''%'' metric',metrics_cols;	   
END LOOP;
END
$func$;

select update_metrics_range();

/*Insert function for Udise aggregation table*/

drop function if exists insert_udise_metrics_agg;

CREATE OR REPLACE FUNCTION insert_udise_metrics_agg()
RETURNS text AS
$$
DECLARE
insert_query text:='select string_agg(column_name,'','') from information_schema.columns WHERE table_name =''udise_school_metrics_agg'' and column_name not in 
(select column_name from information_schema.columns where table_name in (''school_hierarchy_details'',''school_geo_master''))
and column_name not in (''academic_year'',''udise_school_id'') order by 1';
insert_cols text;
select_query text:='select string_agg(''a.''||column_name,'','') from information_schema.columns WHERE table_name =''udise_school_metrics_agg'' and column_name not in 
(select column_name from information_schema.columns where table_name in (''school_hierarchy_details'',''school_geo_master''))
and column_name not in (''academic_year'',''udise_school_id'') order by 1';
select_cols text;
range_query_fwd text:=concat('select string_agg(''(case when ''||metric_name||'' < (select range[2] from udise_metrics_range where metric_name=''''''||metric_name                         
  ||'''''') then 0 when ''||metric_name||'' between (select range[2] from udise_metrics_range where metric_name=''''''||metric_name||'''''') and                        
   (select range[3] from udise_metrics_range where metric_name=''''''||metric_name||'''''') then 0.33 when ''||metric_name||'' 
   between (select range[3] from udise_metrics_range where metric_name=''''''||metric_name||'''''') and (select range[4] from udise_metrics_range where metric_name=
   ''''''||metric_name||'''''') then 0.66 when ''||metric_name||'' > (select range[4] from udise_metrics_range where metric_name=''''''||metric_name||'''''')                    
   then 1 end) as ''||metric_name||'''','','') from                                                                                                                   
  (select metric_name from udise_metrics_range where lower(direction)=''forward'' and metric_name in (select lower(column_name) from udise_config where status=''1''))as a');
range_query_bwd text:=concat('select string_agg(''(case when ''||metric_name||'' < (select range[2] from udise_metrics_range where metric_name=''''''||metric_name                         
  ||'''''') then 1 when ''||metric_name||'' between (select range[2] from udise_metrics_range where metric_name=''''''||metric_name||'''''') and                        
   (select range[3] from udise_metrics_range where metric_name=''''''||metric_name||'''''') then 0.66 when ''||metric_name||'' 
   between (select range[3] from udise_metrics_range where metric_name=''''''||metric_name||'''''') and (select range[4] from udise_metrics_range where metric_name=
   ''''''||metric_name||'''''') then 0.33 when ''||metric_name||'' > (select range[4] from udise_metrics_range where metric_name=''''''||metric_name||'''''')                    
   then 0 end) as ''||metric_name||'''','','') from                                                                                                                   
  (select metric_name from udise_metrics_range where lower(direction)=''backward'' and metric_name in (select lower(column_name) from udise_config where status=''1''))as a');
range_query_gen text:=concat('select string_agg(''(case when ''||metric_name||''= 1 then 1 else 0 end) as ''||metric_name||'''','','') from                                                                                                                    
(select metric_name from udise_metrics_range where lower(direction)=''no'' and metric_name in (select lower(column_name) from udise_config where status=''1''))as a');
range_cols_fwd text; 
range_cols_bwd text; 
range_cols_gen text;
udise_agg_update text:='select string_agg(column_name||'' = excluded.''||column_name,'','') from information_schema.columns WHERE table_name = 
''udise_school_metrics_agg'' and column_name not in (''created_on'',''updated_on'',''udise_school_id'') order by 1';
udise_cols_update text;
aggregation_table text;
BEGIN
Execute insert_query into insert_cols;
Execute select_query into select_cols;
Execute range_query_fwd into range_cols_fwd;
Execute range_query_bwd into range_cols_bwd;
Execute range_query_gen into range_cols_gen;
EXECUTE udise_agg_update into udise_cols_update;
aggregation_table='
insert into udise_school_metrics_agg
(udise_school_id,academic_year,'||insert_cols||',
school_name,school_latitude,school_longitude,cluster_id,cluster_name,cluster_latitude,cluster_longitude,block_id,block_name,block_latitude,block_longitude,
district_id,district_name,district_latitude,district_longitude,created_on,updated_on)
select udise_school_id,academic_year,'||select_cols||',b.school_name,c.school_latitude,c.school_longitude,
b.cluster_id,b.cluster_name,c.cluster_latitude,c.cluster_longitude,b.block_id,b.block_name,c.block_latitude,c.block_longitude,b.district_id,b.district_name,
c.district_latitude,c.district_longitude,now(),now()
from 
(select udise_school_id,academic_year,'||range_cols_fwd||','||range_cols_bwd||','||range_cols_gen||',now(),now() from udise_school_metrics_temp ) as a left join 
school_hierarchy_details as b on a.udise_school_id=b.school_id left join school_geo_master as c on b.school_id=c.school_id
where b.school_name is not null and b.cluster_name is not null and c.school_latitude<>0 and c.school_latitude is not null 
and c.cluster_latitude<>0 and c.cluster_latitude is not null and c.school_longitude<>0 and c.school_longitude is not null 
and c.cluster_longitude<>0 and c.cluster_longitude is not null
on conflict(udise_school_id)
do update set '||udise_cols_update||',updated_on=now()';
Execute aggregation_table; 
return 0;
END;
$$LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION udise_district_score()
RETURNS text AS
$$
DECLARE
select_query text:='select string_agg(''round(cast(sum(''||column_name||'') as numeric)/NULLIF(cast(count(distinct(udise_school_id)) as numeric),0),2)
    *(select score from udise_config where column_name=''''''||column_name||'''''' ) as ''||column_name||'''','','') from                                                                                                                                 
   (select column_name from udise_config where status=''1'' and type = ''metric'' order by 1)as a';   
indices text:='select string_agg(b.sum_cols||'' ''||c.column_name||'''','','') from
(select ''round(sum(COALESCE(''||string_agg(column_name,'',0)+COALESCE('')||'',0))*100.0/''||
 ''NULLIF(sum((case when ''||string_agg(column_name||'' is not null then 1 else 0 end)*(SELECT udise_config.score FROM   udise_config WHERE  
( lower(udise_config.column_name) = ''''''||column_name||'''''''',''::text))+(case when '')||''::text))),0),0) as '' as sum_cols,indice_id from                                                                                                                                 
     (select lower(column_name)as column_name,indice_id from udise_config where status=''1'' and type = ''metric'' order by 1)as a group by indice_id ) as b
 left join udise_config as c on b.indice_id=c.id';
infra_score text:='select ''round(''||string_agg(''coalesce(''||column_name||'',0)*0.01*(SELECT score FROM   udise_config WHERE  lower(column_name) =''''''||lower(column_name)||'''''')'',''+'')||
'',0) as Infrastructure_Score''
from udise_config where status=''1'' and type = ''indice'' order by 1';
select_cols text;
indices_cols text; 
infra_score_cols text;
district_score text;
BEGIN
Execute select_query into select_cols;
Execute indices into indices_cols;
Execute infra_score into infra_score_cols;
district_score='
create or replace view udise_district_score as 
select c.*,((rank () over ( order by Infrastructure_Score desc))||'' out of ''||(select count(distinct(district_id)) 
from udise_school_metrics_agg)) as district_level_rank_within_the_state from
(select b.*,'||infra_score_cols||'
from 
(select district_id,initcap(district_name)as district_name,district_latitude,district_longitude,sum(total_schools)as total_schools,
	sum(total_clusters)as total_clusters,sum(total_blocks)as total_blocks,'||indices_cols||'
from 
(select district_id,district_name,district_latitude,district_longitude,count(distinct(udise_school_id)) as total_schools,
	count(distinct(cluster_id)) as total_clusters,count(distinct(block_id)) as total_blocks,'||select_cols||'
from udise_school_metrics_agg group by district_id,district_name,district_latitude,district_longitude)as a
 group by district_id,district_name,district_latitude,district_longitude)as b)as c';

Execute district_score; 
return 0;
END;
$$LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION udise_block_score()
RETURNS text AS
$$
DECLARE
select_query text:='select string_agg(''round(cast(sum(''||column_name||'') as numeric)/NULLIF(cast(count(distinct(udise_school_id)) as numeric),0),2)
    *(select score from udise_config where column_name=''''''||column_name||'''''' ) as ''||column_name||'''','','') from                                                                                                                                 
   (select column_name from udise_config where status=''1'' and type = ''metric'' order by 1)as a';   
indices text:='select string_agg(b.sum_cols||'' ''||c.column_name||'''','','') from
(select ''round(sum(COALESCE(''||string_agg(column_name,'',0)+COALESCE('')||'',0))*100.0/''||
 ''NULLIF(sum((case when ''||string_agg(column_name||'' is not null then 1 else 0 end)*(SELECT udise_config.score FROM   udise_config WHERE  
( lower(udise_config.column_name) = ''''''||column_name||'''''''',''::text))+(case when '')||''::text))),0),0) as '' as sum_cols,indice_id from                                                                                                                                 
     (select lower(column_name)as column_name,indice_id from udise_config where status=''1'' and type = ''metric'' order by 1)as a group by indice_id ) as b
 left join udise_config as c on b.indice_id=c.id';
infra_score text:='select ''round(''||string_agg(''coalesce(''||column_name||'',0)*0.01*(SELECT score FROM   udise_config WHERE  lower(column_name) =''''''||lower(column_name)||'''''')'',''+'')||
'',0) as Infrastructure_Score''
from udise_config where status=''1'' and type = ''indice'' order by 1';
select_cols text;
indices_cols text; 
infra_score_cols text;
district_score text;
BEGIN
Execute select_query into select_cols;
Execute indices into indices_cols;
Execute infra_score into infra_score_cols;
district_score='
create or replace view udise_block_score as 
select b.*,'||infra_score_cols||'
from 
(select block_id,initcap(block_name)as block_name,block_latitude,block_longitude,district_id,initcap(district_name)as district_name
,sum(total_schools)as total_schools,sum(total_clusters)as total_clusters,
'||indices_cols||'
from 
(select block_id,block_name,block_latitude,block_longitude,district_id,district_name,count(distinct(udise_school_id)) as total_schools,
	count(distinct(cluster_id)) as total_clusters,'||select_cols||'
from udise_school_metrics_agg group by block_id,block_name,block_latitude,block_longitude,district_id,district_name)as a
 group by block_id,block_name,block_latitude,block_longitude,district_id,district_name)as b';
Execute district_score; 
return 0;
END;
$$LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION udise_cluster_score()
RETURNS text AS
$$
DECLARE
select_query text:='select string_agg(''round(cast(sum(''||column_name||'') as numeric)/NULLIF(cast(count(distinct(udise_school_id)) as numeric),0),2)
    *(select score from udise_config where column_name=''''''||column_name||'''''' ) as ''||column_name||'''','','') from                                                                                                                                 
   (select column_name from udise_config where status=''1'' and type = ''metric'' order by 1)as a';   
indices text:='select string_agg(b.sum_cols||'' ''||c.column_name||'''','','') from
(select ''round(sum(COALESCE(''||string_agg(column_name,'',0)+COALESCE('')||'',0))*100.0/''||
 ''NULLIF(sum((case when ''||string_agg(column_name||'' is not null then 1 else 0 end)*(SELECT udise_config.score FROM   udise_config WHERE  
( lower(udise_config.column_name) = ''''''||column_name||'''''''',''::text))+(case when '')||''::text))),0),0) as '' as sum_cols,indice_id from                                                                                                                                 
     (select lower(column_name)as column_name,indice_id from udise_config where status=''1'' and type = ''metric'' order by 1)as a group by indice_id ) as b
 left join udise_config as c on b.indice_id=c.id';
infra_score text:='select ''round(''||string_agg(''coalesce(''||column_name||'',0)*0.01*(SELECT score FROM   udise_config WHERE  lower(column_name) =''''''||lower(column_name)||'''''')'',''+'')||
'',0) as Infrastructure_Score''
from udise_config where status=''1'' and type = ''indice'' order by 1';
select_cols text;
indices_cols text; 
infra_score_cols text;
district_score text;
BEGIN
Execute select_query into select_cols;
Execute indices into indices_cols;
Execute infra_score into infra_score_cols;
district_score='
create or replace view udise_cluster_score as 
select b.*,'||infra_score_cols||' from 
(select cluster_id,initcap(cluster_name)as cluster_name,cluster_latitude,cluster_longitude,block_id,initcap(block_name)as block_name,
district_id,initcap(district_name)as district_name,sum(total_schools)as total_schools,
'||indices_cols||'
from 
(select cluster_id,cluster_name,cluster_latitude,cluster_longitude,block_id,block_name,district_id,district_name,count(distinct(udise_school_id)) as total_schools,
'||select_cols||' 	from udise_school_metrics_agg group by block_id,block_name,cluster_id,cluster_name,cluster_latitude,cluster_longitude,district_id,district_name)as a
 group by block_id,block_name,cluster_id,cluster_name,cluster_latitude,cluster_longitude,district_id,district_name)as b';
Execute district_score; 
return 0;
END;
$$LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION udise_school_score()
RETURNS text AS
$$
DECLARE
select_query text:='select string_agg(''round(cast(sum(''||column_name||'') as numeric)/NULLIF(cast(count(distinct(udise_school_id)) as numeric),0),2)
    *(select score from udise_config where column_name=''''''||column_name||'''''' ) as ''||column_name||'''','','') from                                                                                                                                 
   (select column_name from udise_config where status=''1'' and type = ''metric'' order by 1)as a';   
indices text:='select string_agg(b.sum_cols||'' ''||c.column_name||'''','','') from
(select ''round(sum(COALESCE(''||string_agg(column_name,'',0)+COALESCE('')||'',0))*100.0/''||
 ''NULLIF(sum((case when ''||string_agg(column_name||'' is not null then 1 else 0 end)*(SELECT udise_config.score FROM   udise_config WHERE  
( lower(udise_config.column_name) = ''''''||column_name||'''''''',''::text))+(case when '')||''::text))),0),0) as '' as sum_cols,indice_id from                                                                                                                                 
     (select lower(column_name)as column_name,indice_id from udise_config where status=''1'' and type = ''metric'' order by 1)as a group by indice_id ) as b
 left join udise_config as c on b.indice_id=c.id';
infra_score text:='select ''round(''||string_agg(''coalesce(''||column_name||'',0)*0.01*(SELECT score FROM   udise_config WHERE  lower(column_name) =''''''||lower(column_name)||'''''')'',''+'')||
'',0) as Infrastructure_Score''
from udise_config where status=''1'' and type = ''indice'' order by 1';
select_cols text;
indices_cols text; 
infra_score_cols text;
district_score text;
BEGIN
Execute select_query into select_cols;
Execute indices into indices_cols;
Execute infra_score into infra_score_cols;
district_score='
create or replace view udise_school_score as 
select b.*,'||infra_score_cols||'
from 
(select udise_school_id,initcap(school_name)as school_name,school_latitude,school_longitude,cluster_id,initcap(cluster_name)as cluster_name,
	block_id,initcap(block_name)as block_name,district_id,initcap(district_name)as district_name,sum(total_schools)as total_schools,
'||indices_cols||'
from 
(select udise_school_id,school_name,school_latitude,school_longitude,
	cluster_id,cluster_name,block_id,block_name,district_id,district_name,count(distinct(udise_school_id)) as total_schools,
'||select_cols||' 		from udise_school_metrics_agg group by udise_school_id,school_name,school_latitude,school_longitude,block_id,block_name,cluster_id,cluster_name,district_id,district_name)as a
 group by udise_school_id,school_name,school_latitude,school_longitude,block_id,block_name,cluster_id,cluster_name,district_id,district_name)as b';
Execute district_score; 
return 0;
END;
$$LANGUAGE plpgsql;

drop view if exists udise_school_score cascade;
drop view if exists udise_cluster_score cascade;
drop view if exists udise_block_score cascade;
drop view if exists udise_district_score cascade;

select * from udise_school_score();
select * from udise_cluster_score();
select * from udise_block_score();
select * from udise_district_score();

/*Udise jolt spec*/

create or replace function udise_jolt_spec()
    RETURNS text AS
    $$
    declare
indices text:='select string_agg(''"''||lower(column_name)||''": "data.[&1].indices.''||column_name||''"'','','')
  from udise_config where status = ''1'' and type=''indice''';
indices_cols text;
query text;
BEGIN
execute indices into indices_cols;
IF indices_cols <> '' THEN 
query = '
create or replace view udise_jolt_district as 
select ''
[{
    "operation": "shift",
    "spec": {
      "*": {
        "district_id": "data.[&1].details.district_id",
        "district_name": "data.[&1].details.District_Name",
        "district_latitude": "data.[&1].details.latitude",
        "district_longitude": "data.[&1].details.longitude",
        "infrastructure_score": "data.[&1].details.Infrastructure_Score",
'||indices_cols||',
        "district_level_rank_within_the_state": "data.[&1].rank.District_Level_Rank_Within_The_State",
        "@total_schools": "data.[&1].total_schools",
        "total_schools": "allDistrictsFooter.totalSchools[]"
      }
    }
	}, {
    "operation": "shift",
    "spec": {
      "data": {
        "*": {
          "details": "data.[&1].&",
          "indices": "data.[&1].&",
          "rank": "data.[&1].&",
          "@total_schools": "allDistrictsFooter.totalSchools[]"
        }
      }
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

''as jolt_spec;
create or replace view udise_jolt_block
as select ''
[

	{
		"operation": "shift",
		"spec": {
			"*": {
				"district_id": "data.[&1].details.district_id",
				"district_name": "data.[&1].details.District_Name",
				"block_id": "data.[&1].details.block_id",
				"block_name": "data.[&1].details.Block_Name",
				"block_latitude": "data.[&1].details.latitude",
				"block_longitude": "data.[&1].details.longitude",
				"infrastructure_score": "data.[&1].details.Infrastructure_Score",
'||indices_cols||',
				"block_level_rank_within_the_district": "data.[&1].rank.Block_Level_Rank_Within_The_District",
				"block_level_rank_within_the_state": "data.[&1].rank.Block_Level_Rank_Within_The_State",
				"@total_schools": "data.[&1].total_schools",
				"total_schools": "footer.@(1,district_id).totalSchools[]"
			}
		}
	}, {
		"operation": "shift",
		"spec": {
			"data": {
				"*": {
					"details": "data.[&1].&",
					"indices": "data.[&1].&",
					"rank": "data.[&1].&",
					"@total_schools": "allBlocksFooter.totalSchools[]"
				}
			},
			"footer": "&"
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
		"operation": "modify-overwrite-beta",
		"spec": {
			"*": {
				"totalSchools": "=intSum(@(1,totalSchools))"
			}
		}
	}

]
'' as jolt_spec;
create or replace view udise_jolt_cluster
as select ''
[

  {
    "operation": "shift",
    "spec": {
      "*": {
        "district_id": "data.[&1].details.district_id",
        "district_name": "data.[&1].details.District_Name",
        "block_id": "data.[&1].details.block_id",
        "block_name": "data.[&1].details.Block_Name",
        "cluster_id": "data.[&1].details.cluster_id",
        "cluster_name": "data.[&1].details.Cluster_Name",
        "cluster_latitude": "data.[&1].details.latitude",
        "cluster_longitude": "data.[&1].details.longitude",
        "infrastructure_score": "data.[&1].details.Infrastructure_Score",
'||indices_cols||',
        "cluster_level_rank_within_the_block": "data.[&1].rank.Cluster_Level_Rank_Within_The_Block",
        "cluster_level_rank_within_the_district": "data.[&1].rank.Cluster_Level_Rank_Within_The_District",
        "cluster_level_rank_within_the_state": "data.[&1].rank.Cluster_Level_Rank_Within_The_State",
        "@total_schools": "data.[&1].total_schools",
        "total_schools": "footer.@(1,block_id).totalSchools[]"
      }
    }
	}, {
    "operation": "shift",
    "spec": {
      "data": {
        "*": {
          "details": "data.[&1].&",
          "indices": "data.[&1].&",
          "rank": "data.[&1].&",
          "@total_schools": "allClustersFooter.totalSchools[]"
        }
      },
      "footer": "&"
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
    "operation": "modify-overwrite-beta",
    "spec": {
      "*": {
        "totalSchools": "=intSum(@(1,totalSchools))"
      }
    }
	}
]
''as jolt_spec;
create or replace view udise_jolt_school
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
        "district_id": "data.[&1].details.district_id",
        "district_name": "data.[&1].details.District_Name",
        "block_id": "data.[&1].details.block_id",
        "block_name": "data.[&1].details.Block_Name",
        "cluster_id": "data.[&1].details.cluster_id",
        "cluster_name": "data.[&1].details.Cluster_Name",
        "udise_school_id": "data.[&1].details.school_id",
        "school_name": "data.[&1].details.School_Name",
        "school_latitude": "data.[&1].details.latitude",
        "school_longitude": "data.[&1].details.longitude",
        "infrastructure_score": "data.[&1].details.Infrastructure_Score",
'||indices_cols||',
        "school_level_rank_within_the_cluster": "data.[&1].rank.School_Level_Rank_Within_The_Cluster",
        "school_level_rank_within_the_block": "data.[&1].rank.School_Level_Rank_Within_The_Block",
        "school_level_rank_within_the_district": "data.[&1].rank.School_Level_Rank_Within_The_District",
        "school_level_rank_within_the_state": "data.[&1].rank.School_Level_Rank_Within_The_State",
        "@total_schools": "data.[&1].total_schools",
        "total_schools": "footer.@(1,cluster_id).totalSchools[]"
      }
    }
	}, {
    "operation": "shift",
    "spec": {
      "data": {
        "*": {
          "details": "data.[&1].&",
          "indices": "data.[&1].&",
          "rank": "data.[&1].&",
          "@total_schools": "allSchoolsFooter.totalSchools[]"
        }
      },
      "footer": "&"
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
    "operation": "modify-overwrite-beta",
    "spec": {
      "*": {
        "totalSchools": "=intSum(@(1,totalSchools))"
      }
    }
	}
]
''as jolt_spec;
    ';
Execute query;
END IF;
return 0;
END;
$$
LANGUAGE plpgsql;

select udise_jolt_spec();

/*school performance exception list*/

CREATE OR REPLACE FUNCTION udise_scl_perf_exception()
RETURNS text as 
$$
DECLARE
query text:='select ''select udise_school_id,''||string_agg(column_name,'','')||'' from udise_school_metrics_temp where ''||string_agg(column_name,'' is null or '')||'' is null''
from udise_config where exists (select 1 from udise_config where status=true and column_name=''School_Performance'') 
and column_name in (''perf_class_10_passed'',''perf_class_12_passed'')';
cols text; 
null_list text;
data text;
BEGIN
Execute query into cols;
IF cols <> '' THEN 
null_list='
create or replace view udise_scl_perf_no_lat_long as 
select a.*,b.school_name,b.cluster_id,b.cluster_name,b.block_id,b.block_name,b.district_id,b.district_name from 	
(select udise_sch_code as school_id from (select udise_sch_code from udise_sch_exmres_c10 UNION select udise_sch_code from udise_sch_exmres_c12)as d 
where udise_sch_code not in (select school_id from school_geo_master where school_latitude>0 and school_longitude>0 and cluster_latitude>0 and cluster_longitude>0)) as a
left join school_hierarchy_details as b on a.school_id=b.school_id;
create or replace view udise_scl_perf_null_records as
select b.school_name,b.cluster_id,b.cluster_name,b.block_id,b.block_name,b.district_id,b.district_name,a.*
 from('||cols||' and udise_school_id in (select school_id from udise_scl_perf_no_lat_long))as a
right join school_hierarchy_details as b on a.udise_school_id=b.school_id 
where a.udise_school_id in (select udise_sch_code from udise_sch_exmres_c10 UNION select udise_sch_code from udise_sch_exmres_c12)
';
Execute null_list; 
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

select * from udise_scl_perf_exception();

/*PAT views*/

/*daterange*/

create or replace view pat_date_range as 
(select exam_code,'last30days' as date_range from periodic_exam_mst where exam_date between 
(select ((now()::Date)-INTERVAL '30 DAY')::Date) and (select now()::DATE) )
union
(select exam_code,'last7days' as date_range from periodic_exam_mst where exam_date between 
(select ((now()::Date)-INTERVAL '7 DAY')::Date) and (select now()::DATE) );

/*------------------------Over all--------------------------------------------------------------------------------------------------------*/

/* periodic exam district*/

create or replace view periodic_exam_district_all as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
district_id,initcap(district_name)as district_name,district_latitude,district_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as district_performance
from periodic_exam_school_result group by academic_year,
district_id,district_name,district_latitude,district_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
district_id from
(select academic_year,cast('Grade '||grade as text)as grade,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
district_id)as a
group by district_id,academic_year)as b
on a.academic_year=b.academic_year and a.district_id=b.district_id)as c
left join 
(
select academic_year,district_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,district_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from

((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,subject,
district_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
district_id order by grade desc,subject_name))as b

group by academic_year,district_id,grade)as d
group by academic_year,district_id
)as d on c.academic_year=d.academic_year and c.district_id=d.district_id)as d
left join 
 (select c.district_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by c.district_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.district_id=b.district_id;


/*periodic exam block*/

create or replace view periodic_exam_block_all as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
block_id,initcap(block_name)as block_name,district_id,initcap(district_name)as district_name,block_latitude,block_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as block_performance
from periodic_exam_school_result group by academic_year,
block_id,block_name,district_id,district_name,block_latitude,block_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
block_id from
(select academic_year,cast('Grade '||grade as text)as grade,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
block_id)as a
group by block_id,academic_year)as b
on a.academic_year=b.academic_year and a.block_id=b.block_id)as c
left join 
(
select academic_year,block_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,block_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,subject,
block_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
block_id order by grade desc,subject_name)) as a
group by academic_year,block_id,grade)as d
group by academic_year,block_id
)as d on c.academic_year=d.academic_year and c.block_id=d.block_id)as d
left join 
 (select c.block_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by c.block_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.block_id=b.block_id;

/*periodic exam cluster*/

create or replace view periodic_exam_cluster_all as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,district_id,
initcap(district_name)as district_name,cluster_latitude,cluster_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as cluster_performance
from periodic_exam_school_result group by academic_year,
cluster_id,cluster_name,block_id,block_name,district_id,district_name,cluster_latitude,cluster_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
cluster_id from
(select academic_year,cast('Grade '||grade as text)as grade,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
cluster_id)as a
group by cluster_id,academic_year)as b
on a.academic_year=b.academic_year and a.cluster_id=b.cluster_id)as c
left join 
(
select academic_year,cluster_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,cluster_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,subject,
cluster_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
cluster_id order by grade desc,subject_name)) as a
group by academic_year,cluster_id,grade)as d
group by academic_year,cluster_id
)as d on c.academic_year=d.academic_year and c.cluster_id=d.cluster_id)as d
left join 
 (select c.cluster_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by c.cluster_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.cluster_id=b.cluster_id;

/*periodic exam school*/

create or replace view periodic_exam_school_all as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
school_id,initcap(school_name)as school_name,cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,
district_id,initcap(district_name)as district_name,school_latitude,school_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as school_performance
from periodic_exam_school_result group by academic_year,
school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name,school_latitude,school_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
school_id from
(select academic_year,cast('Grade '||grade as text)as grade,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
school_id)as a
group by school_id,academic_year)as b
on a.academic_year=b.academic_year and a.school_id=b.school_id)as c
left join 
(
select academic_year,school_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,school_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,subject,
school_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
school_id order by grade desc,subject_name)) as a
group by academic_year,school_id,grade)as d
group by academic_year,school_id
)as d on c.academic_year=d.academic_year and c.school_id=d.school_id)as d
left join 
 (select a.school_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by a.school_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.school_id=b.school_id;

/*----------------------------------------------------------- PAT grade subject wise*/

/* district - grade */

create or replace view periodic_grade_district_all as
select a.*,b.grade,b.subjects
from
(select academic_year,district_id,initcap(district_name)as district_name,district_latitude,district_longitude,district_performance,total_schools,students_count from periodic_exam_district_all)as a
left join
(select academic_year,district_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,subject,
district_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
district_id order by 3,grade))as a
group by district_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.district_id=b.district_id;


/*--- block - grade*/

create or replace view periodic_grade_block_all as
select a.*,b.grade,b.subjects
from
(select academic_year,block_id,initcap(block_name)as block_name,
	district_id,initcap(district_name)as district_name,block_latitude,block_longitude,block_performance,total_schools,students_count from periodic_exam_block_all)as a
left join
(select academic_year,block_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,subject,
block_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
block_id order by 3,grade))as a
group by block_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.block_id=b.block_id;

/*--- cluster - grade*/

create or replace view periodic_grade_cluster_all as
select a.*,b.grade,b.subjects
from
(select academic_year,cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,
	district_id,initcap(district_name)as district_name,cluster_latitude,cluster_longitude,cluster_performance,total_schools,students_count from periodic_exam_cluster_all)as a
left join
(select academic_year,cluster_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,subject,
cluster_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
cluster_id order by 3,grade))as a
group by cluster_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.cluster_id=b.cluster_id;

/*--- school - grade*/

create or replace view periodic_grade_school_all as
select a.*,b.grade,b.subjects
from
(select academic_year,school_id,initcap(school_name)as school_name,cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,
	district_id,initcap(district_name)as district_name,school_latitude,school_longitude,school_performance,total_schools,students_count from periodic_exam_school_all)as a
left join
(select academic_year,school_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,subject,
school_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result group by academic_year,grade,
school_id order by 3,grade))as a
group by school_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.school_id=b.school_id;



/*------------------------last 30 days--------------------------------------------------------------------------------------------------------*/

/* periodic exam district*/

create or replace view periodic_exam_district_last30 as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
district_id,initcap(district_name)as district_name,district_latitude,district_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as district_performance
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,
district_id,district_name,district_latitude,district_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
district_id from
(select academic_year,cast('Grade '||grade as text)as grade,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
district_id)as a
group by district_id,academic_year)as b
on a.academic_year=b.academic_year and a.district_id=b.district_id)as c
left join 
(
select academic_year,district_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,district_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,subject,
district_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
district_id order by grade desc,subject_name))as b
group by academic_year,district_id,grade)as d
group by academic_year,district_id
)as d on c.academic_year=d.academic_year and c.district_id=d.district_id)as d
left join 
 (select c.district_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
and exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by c.district_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.district_id=b.district_id;


/*periodic exam block*/

create or replace view periodic_exam_block_last30 as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
block_id,initcap(block_name)as block_name,district_id,initcap(district_name)as district_name,block_latitude,block_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as block_performance
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,
block_id,block_name,district_id,district_name,block_latitude,block_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
block_id from
(select academic_year,cast('Grade '||grade as text)as grade,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
block_id)as a
group by block_id,academic_year)as b
on a.academic_year=b.academic_year and a.block_id=b.block_id)as c
left join 
(
select academic_year,block_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,block_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,subject,
block_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
block_id order by grade desc,subject_name)) as a
group by academic_year,block_id,grade)as d
group by academic_year,block_id
)as d on c.academic_year=d.academic_year and c.block_id=d.block_id)as d
left join 
 (select c.block_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
and exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by c.block_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.block_id=b.block_id;

/*periodic exam cluster*/

create or replace view periodic_exam_cluster_last30 as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,district_id,
initcap(district_name)as district_name,cluster_latitude,cluster_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as cluster_performance
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,
cluster_id,cluster_name,block_id,block_name,district_id,district_name,cluster_latitude,cluster_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
cluster_id from
(select academic_year,cast('Grade '||grade as text)as grade,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
cluster_id)as a
group by cluster_id,academic_year)as b
on a.academic_year=b.academic_year and a.cluster_id=b.cluster_id)as c
left join 
(
select academic_year,cluster_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,cluster_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,subject,
cluster_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
cluster_id order by grade desc,subject_name)) as a
group by academic_year,cluster_id,grade)as d
group by academic_year,cluster_id
)as d on c.academic_year=d.academic_year and c.cluster_id=d.cluster_id)as d
left join 
 (select c.cluster_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
and exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by c.cluster_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.cluster_id=b.cluster_id;

/*periodic exam school*/

create or replace view periodic_exam_school_last30 as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
school_id,initcap(school_name)as school_name,cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,
district_id,initcap(district_name)as district_name,school_latitude,school_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as school_performance
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,
school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name,school_latitude,school_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
school_id from
(select academic_year,cast('Grade '||grade as text)as grade,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
school_id)as a
group by school_id,academic_year)as b
on a.academic_year=b.academic_year and a.school_id=b.school_id)as c
left join 
(
select academic_year,school_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,school_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,subject,
school_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
school_id order by grade desc,subject_name)) as a
group by academic_year,school_id,grade)as d
group by academic_year,school_id
)as d on c.academic_year=d.academic_year and c.school_id=d.school_id)as d
left join 
 (select a.school_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
and exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by a.school_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.school_id=b.school_id;

/*----------------------------------------------------------- PAT grade subject wise*/

/* district - grade */

create or replace view periodic_grade_district_last30 as
select a.*,b.grade,b.subjects
from
(select academic_year,district_id,initcap(district_name)as district_name,district_latitude,district_longitude,district_performance,total_schools,students_count from 
	periodic_exam_district_last30)as a
left join
(select academic_year,district_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,subject,
district_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
district_id order by 3,grade))as a
group by district_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.district_id=b.district_id;


/*--- block - grade*/

create or replace view periodic_grade_block_last30 as
select a.*,b.grade,b.subjects
from
(select academic_year,block_id,initcap(block_name)as block_name,
	district_id,initcap(district_name)as district_name,block_latitude,block_longitude,block_performance,total_schools,students_count from periodic_exam_block_last30)as a
left join
(select academic_year,block_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,subject,
block_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
block_id order by 3,grade))as a
group by block_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.block_id=b.block_id;

/*--- cluster - grade*/

create or replace view periodic_grade_cluster_last30 as
select a.*,b.grade,b.subjects
from
(select academic_year,cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,
	district_id,initcap(district_name)as district_name,cluster_latitude,cluster_longitude,cluster_performance,total_schools,students_count 
	from periodic_exam_cluster_last30)as a
left join
(select academic_year,cluster_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,subject,
cluster_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
cluster_id order by 3,grade))as a
group by cluster_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.cluster_id=b.cluster_id;

/*--- school - grade*/

create or replace view periodic_grade_school_last30 as
select a.*,b.grade,b.subjects
from
(select academic_year,school_id,initcap(school_name)as school_name,cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,
	district_id,initcap(district_name)as district_name,school_latitude,school_longitude,school_performance,total_schools,students_count from periodic_exam_school_last30)as a
left join
(select academic_year,school_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,subject,
school_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last30days')
group by academic_year,grade,
school_id order by 3,grade))as a
group by school_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.school_id=b.school_id;

/*------------------------last 7 days--------------------------------------------------------------------------------------------------------*/

/* periodic exam district*/

create or replace view periodic_exam_district_last7 as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
district_id,initcap(district_name)as district_name,district_latitude,district_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as district_performance
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,
district_id,district_name,district_latitude,district_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
district_id from
(select academic_year,cast('Grade '||grade as text)as grade,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
district_id)as a
group by district_id,academic_year)as b
on a.academic_year=b.academic_year and a.district_id=b.district_id)as c
left join 
(
select academic_year,district_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,district_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,subject,
district_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
district_id order by grade desc,subject_name))as b
group by academic_year,district_id,grade)as d
group by academic_year,district_id
)as d on c.academic_year=d.academic_year and c.district_id=d.district_id)as d
left join 
 (select c.district_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
and exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by c.district_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.district_id=b.district_id;


/*periodic exam block*/

create or replace view periodic_exam_block_last7 as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
block_id,initcap(block_name)as block_name,district_id,initcap(district_name)as district_name,block_latitude,block_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as block_performance
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,
block_id,block_name,district_id,district_name,block_latitude,block_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
block_id from
(select academic_year,cast('Grade '||grade as text)as grade,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
block_id)as a
group by block_id,academic_year)as b
on a.academic_year=b.academic_year and a.block_id=b.block_id)as c
left join 
(
select academic_year,block_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,block_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,subject,
block_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
block_id order by grade desc,subject_name)) as a
group by academic_year,block_id,grade)as d
group by academic_year,block_id
)as d on c.academic_year=d.academic_year and c.block_id=d.block_id)as d
left join 
 (select c.block_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
and exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by c.block_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.block_id=b.block_id;

/*periodic exam cluster*/

create or replace view periodic_exam_cluster_last7 as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,district_id,
initcap(district_name)as district_name,cluster_latitude,cluster_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as cluster_performance
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,
cluster_id,cluster_name,block_id,block_name,district_id,district_name,cluster_latitude,cluster_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
cluster_id from
(select academic_year,cast('Grade '||grade as text)as grade,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
cluster_id)as a
group by cluster_id,academic_year)as b
on a.academic_year=b.academic_year and a.cluster_id=b.cluster_id)as c
left join 
(
select academic_year,cluster_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,cluster_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,subject,
cluster_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
cluster_id order by grade desc,subject_name)) as a
group by academic_year,cluster_id,grade)as d
group by academic_year,cluster_id
)as d on c.academic_year=d.academic_year and c.cluster_id=d.cluster_id)as d
left join 
 (select c.cluster_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
and exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by c.cluster_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.cluster_id=b.cluster_id;

/*periodic exam school*/

create or replace view periodic_exam_school_last7 as
select d.*,b.total_schools,b.students_count from
(select c.*,d.subject_wise_performance from
(select a.*,b.grade_wise_performance from
(select academic_year,
school_id,initcap(school_name)as school_name,cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,
district_id,initcap(district_name)as district_name,school_latitude,school_longitude,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as school_performance
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,
school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name,school_latitude,school_longitude) as a
left join 
(select academic_year,json_object_agg(grade,percentage) as grade_wise_performance,
school_id from
(select academic_year,cast('Grade '||grade as text)as grade,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
school_id)as a
group by school_id,academic_year)as b
on a.academic_year=b.academic_year and a.school_id=b.school_id)as c
left join 
(
select academic_year,school_id,jsonb_agg(subject_wise_performance)as subject_wise_performance from
(select academic_year,school_id,
json_build_object(grade,json_object_agg(subject_name,percentage  order by subject_name))::jsonb as subject_wise_performance from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,subject,
school_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance'as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
school_id order by grade desc,subject_name)) as a
group by academic_year,school_id,grade)as d
group by academic_year,school_id
)as d on c.academic_year=d.academic_year and c.school_id=d.school_id)as d
left join 
 (select a.school_id,b.assessment_year as academic_year,
	count(distinct(student_uid)) as students_count,count(distinct(a.school_id)) as total_schools
from
(select exam_id,school_id,student_uid
from periodic_exam_result_trans where school_id in (select school_id from periodic_exam_school_result)
and exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by exam_id,school_id,student_uid) as a
left join (select exam_id,date_part('year',exam_date)::text as assessment_year from periodic_exam_mst) as b on a.exam_id=b.exam_id
left join school_hierarchy_details as c on a.school_id=c.school_id
group by a.school_id,b.assessment_year )as b
 on d.academic_year=b.academic_year and d.school_id=b.school_id;

/*----------------------------------------------------------- PAT grade subject wise*/

/* district - grade */

create or replace view periodic_grade_district_last7 as
select a.*,b.grade,b.subjects
from
(select academic_year,district_id,initcap(district_name)as district_name,district_latitude,district_longitude,district_performance,total_schools,students_count from 
	periodic_exam_district_last7)as a
left join
(select academic_year,district_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,subject,
district_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
district_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
district_id order by 3,grade))as a
group by district_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.district_id=b.district_id;


/*--- block - grade*/

create or replace view periodic_grade_block_last7 as
select a.*,b.grade,b.subjects
from
(select academic_year,block_id,initcap(block_name)as block_name,
	district_id,initcap(district_name)as district_name,block_latitude,block_longitude,block_performance,total_schools,students_count from periodic_exam_block_last7)as a
left join
(select academic_year,block_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,subject,
block_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
block_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
block_id order by 3,grade))as a
group by block_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.block_id=b.block_id;

/*--- cluster - grade*/

create or replace view periodic_grade_cluster_last7 as
select a.*,b.grade,b.subjects
from
(select academic_year,cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,
	district_id,initcap(district_name)as district_name,cluster_latitude,cluster_longitude,cluster_performance,total_schools,students_count 
	from periodic_exam_cluster_last7)as a
left join
(select academic_year,cluster_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,subject,
cluster_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
cluster_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
cluster_id order by 3,grade))as a
group by cluster_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.cluster_id=b.cluster_id;

/*--- school - grade*/

create or replace view periodic_grade_school_last7 as
select a.*,b.grade,b.subjects
from
(select academic_year,school_id,initcap(school_name)as school_name,cluster_id,initcap(cluster_name)as cluster_name,block_id,initcap(block_name)as block_name,
	district_id,initcap(district_name)as district_name,school_latitude,school_longitude,school_performance,total_schools,students_count from periodic_exam_school_last7)as a
left join
(select academic_year,school_id,grade,
json_object_agg(subject_name,percentage order by subject_name) as subjects
from
((select academic_year,cast('Grade '||grade as text)as grade,cast(subject as text)as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,subject,
school_id order by grade desc,subject_name)
union
(select academic_year,cast('Grade '||grade as text)as grade,'Grade Performance' as subject_name,
school_id,
round(coalesce(sum(obtained_marks),0)*100.0/coalesce(sum(total_marks),0),1) as percentage
from periodic_exam_school_result 
where exam_code in (select exam_code from pat_date_range where date_range='last7days')
group by academic_year,grade,
school_id order by 3,grade))as a
group by school_id,grade,academic_year
order by 1,grade)as b on a.academic_year=b.academic_year and a.school_id=b.school_id;

/*Composite reports */

/*insert script for composite dynamic queries*/

/*district*/

insert into composite_config(template,status,category,select_query,table_join) values('static',true,'district','select stat.district_id,stat.district_name',
		'from (select distinct(sh.district_id),initcap(sh.district_name)as district_name from
school_geo_master as sg 
left join 
school_hierarchy_details as sh on sg.district_id=sh.district_id
where school_latitude>0 and school_longitude>0 and cluster_latitude>0 and cluster_longitude>0 and school_name is not null and district_name is not null 
	and cluster_name is not null and block_name is not null) as stat')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('attendance',true,'district','sa.student_attendance',
		'left join (SELECT district_id,
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS student_attendance 
FROM school_student_total_attendance WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and cluster_name is not null and total_working_days>0
AND year =(select max(year) from school_student_total_attendance) AND
month= (select max(month) from school_student_total_attendance where year=(select max(year) from school_student_total_attendance))
GROUP BY district_id,year,month) as sa 
on stat.district_id=sa.district_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('pat',true,'district','pat.Periodic_exam_performance',
		'left join (select district_id,district_performance as Periodic_exam_performance from periodic_exam_district_all) as pat 
on stat.district_id=pat.district_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('diksha',true,'district','dik.Total_content_plays_textbook,
	dik.Total_content_plays_course,dik.Total_content_plays_all',
		'left join (select district_id,sum(textbook) as Total_content_plays_textbook,
sum(course) as Total_content_plays_course,sum(textbook+course)as Total_content_plays_all from 
(select district_id,(case when lower(collection_type)=''textbook'' then sum(total_count) else 0 end)as textbook,
	(case when lower(collection_type)=''course'' then sum(total_count) else 0 end)as course
	from diksha_total_content where user_login_type is not null and collection_type is not null
and user_login_type <> ''NA''and district_name is not null
and district_id is not null
group by district_id,collection_type
order by 1)as f group by district_id) as dik 
on stat.district_id=dik.district_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('semester',true,'district','semester_performance,semester_performance_grade_3,
	semester_performance_grade_4,semester_performance_grade_5,semester_performance_grade_6,semester_performance_grade_7,semester_performance_grade_8',
		'left join (	select a.district_id,a.semester_performance,
b.grade_3 as semester_performance_grade_3,b.grade_4 as semester_performance_grade_4,b.grade_5 as semester_performance_grade_5,
b.grade_6 as semester_performance_grade_6,b.grade_7 as semester_performance_grade_7,b.grade_8 as semester_performance_grade_8
from
(SELECT district_id, 
Round(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS semester_performance
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 and cluster_name is not null
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and school_id not in (select school_id from school_semester_no_data)
and semester = (select max(semester) from school_student_subject_total_marks)
GROUP BY district_id)as a
left join 
(select * from crosstab(
''select x_axis,grade,x_value from district_grade order by 1'',
''select distinct(grade) from district_grade order by 1'') as 
(district_id bigint,"grade_3" numeric,"grade_4" numeric,"grade_5" numeric,"grade_6" numeric
,"grade_7" numeric,"grade_8" numeric)) b
on a.district_id=b.district_id) as sem 
on stat.district_id=sem.district_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,table_join) values('udise',true,'district','left join udise_district_score
on stat.district_id=udise_district_score.district_id')
on conflict on constraint composite_config_pkey do nothing;

/*block*/

insert into composite_config(template,status,category,select_query,table_join) values('static',true,'block',
	'select stat.block_id,stat.block_name,stat.district_id,stat.district_name',
		'from (select distinct(sh.block_id),initcap(sh.block_name)as block_name,sh.district_id,initcap(sh.district_name)as district_name from
school_geo_master as sg 
left join 
school_hierarchy_details as sh on sg.block_id=sh.block_id
where school_latitude>0 and school_longitude>0 and cluster_latitude>0 and cluster_longitude>0 and school_name is not null and district_name is not null 
	and cluster_name is not null and block_name is not null) as stat')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('attendance',true,'block','sa.student_attendance',
		'left join (SELECT block_id,
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS student_attendance 
FROM school_student_total_attendance WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and cluster_name is not null and total_working_days>0
AND year =(select max(year) from school_student_total_attendance) AND
month= (select max(month) from school_student_total_attendance where year=(select max(year) from school_student_total_attendance))
GROUP BY block_id,year,month) as sa 
on stat.block_id=sa.block_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('pat',true,'block','pat.Periodic_exam_performance',
		'left join (select block_id,block_performance as Periodic_exam_performance from periodic_exam_block_all) as pat 
on stat.block_id=pat.block_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('semester',true,'block','semester_performance,semester_performance_grade_3,
	semester_performance_grade_4,semester_performance_grade_5,semester_performance_grade_6,semester_performance_grade_7,semester_performance_grade_8',
		'left join (	select a.block_id,a.semester_performance,
b.grade_3 as semester_performance_grade_3,b.grade_4 as semester_performance_grade_4,b.grade_5 as semester_performance_grade_5,
b.grade_6 as semester_performance_grade_6,b.grade_7 as semester_performance_grade_7,b.grade_8 as semester_performance_grade_8
from
(SELECT block_id, 
Round(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS semester_performance
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 and cluster_name is not null
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and school_id not in (select school_id from school_semester_no_data)
and semester = (select max(semester) from school_student_subject_total_marks)
GROUP BY block_id)as a
left join 
(select * from crosstab(
''select x_axis,grade,x_value from block_grade order by 1'',
''select distinct(grade) from block_grade order by 1'') as 
(block_id bigint,"grade_3" numeric,"grade_4" numeric,"grade_5" numeric,"grade_6" numeric
,"grade_7" numeric,"grade_8" numeric)) b
on a.block_id=b.block_id) as sem 
on stat.block_id=sem.block_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,table_join) values('udise',true,'block','left join udise_block_score
on stat.block_id=udise_block_score.block_id')
on conflict on constraint composite_config_pkey do nothing;

/*cluster*/

insert into composite_config(template,status,category,select_query,table_join) values('static',true,'cluster',
	'select stat.cluster_id,stat.cluster_name,stat.block_id,stat.block_name,stat.district_id,stat.district_name',
		'from (select distinct(sh.cluster_id),initcap(sh.cluster_name)as cluster_name,sh.block_id,initcap(sh.block_name)as block_name
		,sh.district_id,initcap(sh.district_name)as district_name from
school_geo_master as sg 
left join 
school_hierarchy_details as sh on sg.cluster_id=sh.cluster_id
where school_latitude>0 and school_longitude>0 and cluster_latitude>0 and cluster_longitude>0 and school_name is not null and district_name is not null 
	and cluster_name is not null and block_name is not null) as stat')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('attendance',true,'cluster','sa.student_attendance',
		'left join (SELECT cluster_id,
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS student_attendance 
FROM school_student_total_attendance WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and cluster_name is not null and total_working_days>0
AND year =(select max(year) from school_student_total_attendance) AND
month= (select max(month) from school_student_total_attendance where year=(select max(year) from school_student_total_attendance))
GROUP BY cluster_id,year,month) as sa 
on stat.cluster_id=sa.cluster_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('pat',true,'cluster','pat.Periodic_exam_performance',
		'left join (select cluster_id,cluster_performance as Periodic_exam_performance from periodic_exam_cluster_all) as pat 
on stat.cluster_id=pat.cluster_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('semester',true,'cluster','semester_performance,semester_performance_grade_3,
	semester_performance_grade_4,semester_performance_grade_5,semester_performance_grade_6,semester_performance_grade_7,semester_performance_grade_8',
		'left join (	select a.cluster_id,a.semester_performance,
b.grade_3 as semester_performance_grade_3,b.grade_4 as semester_performance_grade_4,b.grade_5 as semester_performance_grade_5,
b.grade_6 as semester_performance_grade_6,b.grade_7 as semester_performance_grade_7,b.grade_8 as semester_performance_grade_8
from
(SELECT cluster_id, 
Round(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS semester_performance
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 and cluster_name is not null
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and school_id not in (select school_id from school_semester_no_data)
and semester = (select max(semester) from school_student_subject_total_marks)
GROUP BY cluster_id)as a
left join 
(select * from crosstab(
''select x_axis,grade,x_value from cluster_grade order by 1'',
''select distinct(grade) from cluster_grade order by 1'') as 
(cluster_id bigint,"grade_3" numeric,"grade_4" numeric,"grade_5" numeric,"grade_6" numeric
,"grade_7" numeric,"grade_8" numeric)) b
on a.cluster_id=b.cluster_id) as sem 
on stat.cluster_id=sem.cluster_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,table_join) values('udise',true,'cluster','left join udise_cluster_score
on stat.cluster_id=udise_cluster_score.cluster_id')
on conflict on constraint composite_config_pkey do nothing;

/*school*/

insert into composite_config(template,status,category,select_query,table_join) values('static',true,'school',
	'select stat.school_id,stat.school_name,stat.cluster_id,stat.cluster_name,stat.block_id,stat.block_name,stat.district_id,stat.district_name',
		'from (select distinct(sh.school_id),initcap(sh.school_name)as school_name,sh.cluster_id,initcap(sh.cluster_name)as cluster_name,
		sh.block_id,initcap(sh.block_name)as block_name,sh.district_id,initcap(sh.district_name)as district_name from
school_geo_master as sg 
left join 
school_hierarchy_details as sh on sg.school_id=sh.school_id
where school_latitude>0 and school_longitude>0 and cluster_latitude>0 and cluster_longitude>0 and school_name is not null and district_name is not null 
	and cluster_name is not null and block_name is not null) as stat')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('attendance',true,'school','sa.student_attendance',
		'left join (SELECT school_id,
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS student_attendance 
FROM school_student_total_attendance WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and cluster_name is not null and total_working_days>0
AND year =(select max(year) from school_student_total_attendance) AND
month= (select max(month) from school_student_total_attendance where year=(select max(year) from school_student_total_attendance))
GROUP BY school_id,year,month) as sa 
on stat.school_id=sa.school_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('pat',true,'school','pat.Periodic_exam_performance',
		'left join (select school_id,school_performance as Periodic_exam_performance from periodic_exam_school_all) as pat 
on stat.school_id=pat.school_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,select_query,table_join) values('semester',true,'school','semester_performance,semester_performance_grade_3,
	semester_performance_grade_4,semester_performance_grade_5,semester_performance_grade_6,semester_performance_grade_7,semester_performance_grade_8',
		'left join (	select a.school_id,a.semester_performance,
b.grade_3 as semester_performance_grade_3,b.grade_4 as semester_performance_grade_4,b.grade_5 as semester_performance_grade_5,
b.grade_6 as semester_performance_grade_6,b.grade_7 as semester_performance_grade_7,b.grade_8 as semester_performance_grade_8
from
(SELECT school_id, 
Round(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS semester_performance
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 and cluster_name is not null
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and school_id not in (select school_id from school_semester_no_data)
and semester = (select max(semester) from school_student_subject_total_marks)
GROUP BY school_id)as a
left join 
(select * from crosstab(
''select x_axis,grade,x_value from school_grade order by 1'',
''select distinct(grade) from school_grade order by 1'') as 
(school_id bigint,"grade_3" numeric,"grade_4" numeric,"grade_5" numeric,"grade_6" numeric
,"grade_7" numeric,"grade_8" numeric)) b
on a.school_id=b.school_id) as sem 
on stat.school_id=sem.school_id')
on conflict on constraint composite_config_pkey do nothing;

insert into composite_config(template,status,category,table_join) values('udise',true,'school','left join udise_school_score
on stat.school_id=udise_school_score.udise_school_id')
on conflict on constraint composite_config_pkey do nothing;

	update composite_config as uds set select_query= stg.select_query from 
(select string_agg(lower(column_name),',')||',infrastructure_score' as select_query from udise_config where type='indice' and status=true)as stg
where uds.template='udise';


update composite_config set status= false where lower(template) in (select split_part(lower(template),'_',2) from nifi_template_info where status=false);

/*Composite jolt spec*/

update composite_config as uds set jolt_spec=stg.jolt_spec from 
(select string_agg(cols,',')||',"infrastructure_score": "[&1].Infrastructure Score(%).percent"' as jolt_spec from 
(select case when column_name like '%_Index' then string_agg('"'||lower(column_name)||'": "[&1].'||replace(split_part(column_name,'_Index',1),'_',' ')||
	'(%).percent"',',') else
string_agg('"'||lower(column_name)||'": "[&1].'||replace(column_name,'_',' ')||'(%).percent"',',') end as cols
from udise_config where status = '1' and type='indice' group by column_name)as a)as stg
where uds.template='udise';

update composite_config as uds set jolt_spec='"student_attendance": "[&1].Student Attendance(%).percent"' where uds.template='attendance';

        
update composite_config as uds set jolt_spec='"periodic_exam_performance": "[&1].Periodic Exam Performance(%).percent"' where uds.template='pat';        

update composite_config as uds set jolt_spec=
	 '"total_content_plays_textbook": "[&1].Total Content Plays-Textbook.value",
        "total_content_plays_course": "[&1].Total Content Plays-Course.value",
        "total_content_plays_all": "[&1].Total Content Plays-All.value"'
         where uds.template='diksha';        	
        
update composite_config as uds set jolt_spec=
	 '"semester_performance": "[&1].Semester Performance(%).percent",
        "semester_performance_grade_3": "[&1].Semester Performance Grade-3(%).percent",
        "semester_performance_grade_4": "[&1].Semester Performance Grade-4(%).percent",
        "semester_performance_grade_5": "[&1].Semester Performance Grade-5(%).percent",
        "semester_performance_grade_6": "[&1].Semester Performance Grade-6(%).percent",
        "semester_performance_grade_7": "[&1].Semester Performance Grade-7(%).percent",
        "semester_performance_grade_8": "[&1].Semester Performance Grade-8(%).percent"'
         where uds.template='semester';

/*Function to create composite views*/

CREATE OR REPLACE FUNCTION composite_create_views()
RETURNS text AS
$$
DECLARE
select_query_dist text:='select string_agg(col,'','') from (select concat(select_query)as col from composite_config where status=''true'' and category=''district'' order by id)as d';   
select_cols_dist text;
join_query_dist text:='select string_agg(col,'' '') from (select concat(table_join)as col from composite_config where status=''true'' and category=''district'' order by id)as d';
join_cols_dist text;
district_view text;
select_query_blk text:='select string_agg(col,'','') from (select concat(select_query)as col from composite_config where status=''true'' and category=''block'' order by id)as d';   
select_cols_blk text;
join_query_blk text:='select string_agg(col,'' '') from (select concat(table_join)as col from composite_config where status=''true'' and category=''block'' order by id)as d';
join_cols_blk text;
block_view text;
select_query_cst text:='select string_agg(col,'','') from (select concat(select_query)as col from composite_config where status=''true'' and category=''cluster'' order by id)as d';   
select_cols_cst text;
join_query_cst text:='select string_agg(col,'' '') from (select concat(table_join)as col from composite_config where status=''true'' and category=''cluster'' order by id)as d';
join_cols_cst text;
cluster_view text;
select_query_scl text:='select string_agg(col,'','') from (select concat(select_query)as col from composite_config where status=''true'' and category=''school'' order by id)as d';   
select_cols_scl text;
join_query_scl text:='select string_agg(col,'' '') from (select concat(table_join)as col from composite_config where status=''true'' and category=''school'' order by id)as d';
join_cols_scl text;
school_view text;
BEGIN
Execute select_query_dist into select_cols_dist;
Execute join_query_dist into join_cols_dist;
Execute select_query_blk into select_cols_blk;
Execute join_query_blk into join_cols_blk;
Execute select_query_cst into select_cols_cst;
Execute join_query_cst into join_cols_cst;
Execute select_query_scl into select_cols_scl;
Execute join_query_scl into join_cols_scl;
district_view='create or replace view composite_district as 
'||select_cols_dist||' '||join_cols_dist||';
';
Execute district_view; 
block_view='create or replace view composite_block as 
'||select_cols_blk||' '||join_cols_blk||';
';
Execute block_view; 
cluster_view='create or replace view composite_cluster as 
'||select_cols_cst||' '||join_cols_cst||';
';
Execute cluster_view; 
school_view='create or replace view composite_school as 
'||select_cols_scl||' '||join_cols_scl||';
';
Execute school_view; 
return 0;
END;
$$LANGUAGE plpgsql;

drop view if exists composite_district;
drop view if exists composite_block;
drop view if exists composite_cluster;
drop view if exists composite_school;


/*select * from composite_create_views();*/


create or replace function composite_jolt_spec()
    RETURNS text AS
    $$
    declare
comp text:='select string_agg(jolt_spec,'','') from composite_config where category=''district'' and status=true';
comp_cols text;
query text;
BEGIN
execute comp into comp_cols;
IF comp_cols <> '' THEN 
query = '
create or replace view composite_jolt_district as 
select ''
[
  {
    "operation": "shift",
    "spec": {
      "*": {
        "district_id": "[&1].district.id",
        "district_name": "[&1].district.value",
'||comp_cols||'
      }
    }
    }
  ]

''as jolt_spec;
create or replace view composite_jolt_block
as select ''
[
  {
    "operation": "shift",
    "spec": {
      "*": {
        "district_id": "[&1].district.id",
        "district_name": "[&1].district.value",
        "block_id": "[&1].block.id",
        "block_name": "[&1].block.value",
'||comp_cols||'
      }
    }
    }
  ]

'' as jolt_spec;
create or replace view composite_jolt_cluster
as select ''
[
  {
    "operation": "shift",
    "spec": {
      "*": {
        "district_id": "[&1].district.id",
        "district_name": "[&1].district.value",
        "block_id": "[&1].block.id",
        "block_name": "[&1].block.value",
        "cluster_id": "[&1].cluster.id",
        "cluster_name": "[&1].cluster.value",
'||comp_cols||'
      }
    }
    }
  ]

''as jolt_spec;
create or replace view composite_jolt_school
as select ''
[
  {
    "operation": "shift",
    "spec": {
      "*": {
        "district_id": "[&1].district.id",
        "district_name": "[&1].district.value",
        "block_id": "[&1].block.id",
        "block_name": "[&1].block.value",
        "cluster_id": "[&1].cluster.id",
        "cluster_name": "[&1].cluster.value",
        "school_id": "[&1].school.id",
        "school_name": "[&1].school.value",
'||comp_cols||'
      }
    }
    }
  ]
''as jolt_spec;
    ';
Execute query;
END IF;
return 0;
END;
$$
LANGUAGE plpgsql;

create or replace view school_semester_no_data as
select school_id,semester from school_student_subject_total_marks
WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL AND block_latitude <> 0 and cluster_name is not null
AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 AND school_latitude IS NOT NULL AND school_name IS NOT NULL
group by school_id,semester
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end +
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) = 0;

select * from composite_create_views();
select composite_jolt_spec();


CREATE OR REPLACE FUNCTION insert_diksha_tpd_trans()
RETURNS text AS
$$
DECLARE
transaction_insert text;
BEGIN
transaction_insert=
'insert into diksha_tpd_trans(collection_id,collection_name,batch_id,batch_name,uuid,state,org_name,school_id,enrolment_date,
completion_date,progress,certificate_status,total_score,nested_collection_progress,assessment_score,created_on,updated_on) 
select data.*,now(),now() from
((select collection_id,collection_name,batch_id,batch_name,tpd_temp.uuid,tpd_temp.state,
org_name,cr_mapping.school_id,enrolment_date,
completion_date,progress,certificate_status,total_score,nested_collection_progress,assessment_score
from diksha_tpd_content_temp as tpd_temp left join diksha_tpd_mapping as cr_mapping on tpd_temp.uuid=cr_mapping.uuid
where cr_mapping.school_id>0)
except
(select collection_id,collection_name,batch_id,batch_name,uuid,state,
org_name,school_id,enrolment_date,
completion_date,progress,certificate_status,total_score,nested_collection_progress,assessment_score
 from diksha_tpd_trans))as data';
Execute transaction_insert; 
return 0;
END;
$$LANGUAGE plpgsql;

drop view if exists school_teachers_count cascade;

create or replace view school_teachers_count as 
select tch_cnt.school_id,count(distinct(uuid)) as total_teachers,clust_id,blk_id,dist_id from diksha_tpd_mapping as tch_cnt 
inner join 
(select school_id ,cluster_id as clust_id,block_id as blk_id,district_id as dist_id from school_hierarchy_details 
  where school_name is not null and cluster_name is not null
and block_name is not null and district_name is not null) as scl on tch_cnt.school_id=scl.school_id 
group by tch_cnt.school_id,clust_id,blk_id,dist_id;

create or replace view school_diksha_enrolled as 
select a.*,cnt.total_teachers from
(select collection_id,collection_name,
count(distinct(uuid)) as total_enrolled,'Last_Day' as time_range,  
tpd.school_id,cluster_id,block_id,district_id from diksha_tpd_trans as tpd inner join (
select school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name from school_hierarchy_details
where school_name is not null and district_name is not null and cluster_name is not null and block_name is not null) as scl_hry on tpd.school_id=scl_hry.school_id
where org_name='DIKSHA Custodian Org' and collection_name is not null and enrolment_date = (select now()::DATE)
group by collection_id,collection_name,tpd.school_id,cluster_id,block_id,district_id
union
select collection_id,collection_name,
count(distinct(uuid)) as total_enrolled,'Last_7_Day' as time_range,  
tpd.school_id,cluster_id,block_id,district_id from diksha_tpd_trans as tpd inner join (
select school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name from school_hierarchy_details
where school_name is not null and district_name is not null and cluster_name is not null and block_name is not null) as scl_hry on tpd.school_id=scl_hry.school_id
where org_name='DIKSHA Custodian Org' and collection_name is not null and enrolment_date between (select ((now()::Date)-INTERVAL '7 DAY')::Date) and 
(select (now()::Date))
group by collection_id,collection_name,tpd.school_id,cluster_id,block_id,district_id
union
select collection_id,collection_name,
count(distinct(uuid)) as total_enrolled,'Last_30_Day' as time_range,  
tpd.school_id,cluster_id,block_id,district_id from diksha_tpd_trans as tpd inner join (
select school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name from school_hierarchy_details
where school_name is not null and district_name is not null and cluster_name is not null and block_name is not null) as scl_hry on tpd.school_id=scl_hry.school_id
where org_name='DIKSHA Custodian Org' and collection_name is not null and enrolment_date between (select ((now()::Date)-INTERVAL '30 DAY')::Date) and 
(select (now()::Date))
group by collection_id,collection_name,tpd.school_id,cluster_id,block_id,district_id
union
select collection_id,collection_name,
count(distinct(uuid)) as total_enrolled,'All' as time_range,  
tpd.school_id,cluster_id,block_id,district_id from diksha_tpd_trans as tpd inner join (
select school_id,school_name,cluster_id,cluster_name,block_id,block_name,district_id,district_name from school_hierarchy_details
where school_name is not null and district_name is not null and cluster_name is not null and block_name is not null) as scl_hry on tpd.school_id=scl_hry.school_id
where org_name='DIKSHA Custodian Org' and collection_name is not null 
group by collection_id,collection_name,tpd.school_id,cluster_id,block_id,district_id) as a
left join school_teachers_count as cnt on a.school_id=cnt.school_id;

/*Semester views*/

drop view if exists district_grade cascade;

create or replace view district_grade as
SELECT district_id AS x_axis,grade,semester,
Round(NULLIF(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	),0)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 and cluster_name is not null
AND school_latitude <>0 AND school_latitude IS NOT NULL AND school_name IS NOT NULL 
GROUP BY district_id,grade,semester
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0;

drop view if exists district_school cascade;

create or replace view district_school as
SELECT district_id AS x_axis,school_id,semester,
Round(NULLIF(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	),0)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 and cluster_name is not null
AND school_latitude <>0 AND school_latitude IS NOT NULL AND school_name IS NOT NULL 
GROUP BY district_id,school_id,semester
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0;

drop view if exists block_school cascade;

create or replace view block_school as
SELECT block_id AS x_axis,school_id,semester,
Round(NULLIF(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	),0)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and cluster_name is not null
GROUP BY block_id,school_id,semester
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0;

drop view if exists block_grade cascade;

create or replace view block_grade as
	SELECT block_id AS x_axis,grade,semester,
Round(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL and cluster_name is not null
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL
GROUP BY block_id,grade,semester 
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0;

drop view if exists cluster_school cascade; 

create or replace view cluster_school as
SELECT cluster_id AS x_axis,school_id,semester,
Round(NULLIF(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	),0)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL AND block_latitude <> 0 
AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 and cluster_name is not null
AND school_latitude IS NOT NULL AND school_name IS NOT NULL
GROUP BY cluster_id,school_id,semester
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0;

drop view if exists cluster_grade cascade;

create or replace view cluster_grade as
	SELECT cluster_id AS x_axis,grade,semester,
Round(NULLIF(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	),0)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 and cluster_name is not null
AND school_latitude IS NOT NULL AND school_name IS NOT NULL 
GROUP BY cluster_id,grade,semester
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0; 

drop view if exists school_semester_no_data cascade;

create or replace view school_semester_no_data as
select school_id,semester from school_student_subject_total_marks 
WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL AND block_latitude <> 0 and cluster_name is not null
AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 AND school_latitude IS NOT NULL AND school_name IS NOT NULL
group by school_id,semester
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) = 0;

drop view if exists school_grade cascade;

create or replace view school_grade as
	SELECT school_id AS x_axis,grade,semester,
Round(NULLIF(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
	case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
	+case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
	case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
	+case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
	),0)*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
	subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL 
AND block_latitude IS NOT NULL AND block_latitude <> 0 AND cluster_latitude IS NOT NULL 
AND cluster_latitude <> 0 AND school_latitude <>0 AND school_latitude IS NOT NULL AND school_name IS NOT NULL 
 and cluster_name is not null
GROUP BY school_id,grade,semester
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0;

/*Health card index*/

/*semester*/

create or replace view hc_semester_performance_district as 
select a.x_axis as district_id,district_name,x_value as Performance,a.semester, 
b.grade_3,b.grade_4,b.grade_5,b.grade_6,b.grade_7,b.grade_8,c.value_below_33,c.value_between_33_60,c.value_between_60_75,c.value_above_75,
c.percent_below_33,c.percent_between_33_60,c.percent_between_60_75,c.percent_above_75
from
(SELECT district_id AS x_axis,Initcap(district_name) AS district_name, 
Round(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
  case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
  +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
  case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
  +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
  )*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
  subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS x_value,
'latitude' AS y_axis,district_latitude AS y_value,'longitude' AS z_axis,district_longitude AS z_value,
Sum(students_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,semester
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 and cluster_name is not null
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and semester=(select max(semester) 
  from school_student_subject_total_marks)
GROUP BY district_id,district_latitude,district_longitude,district_name,semester
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0)as a
left join 
(select cast(split_part(string,'_',1) as bigint)as x_axis,cast(split_part(string,'_',2) as bigint) as semester,* from crosstab
(
'select concat(x_axis,''_'',semester)as string,grade,x_value from district_grade order by 1,2'
) as ct 
(string text,"grade_3" numeric(5,2),"grade_4" numeric(5,2),"grade_5" numeric(5,2),"grade_6" numeric(5,2)
,"grade_7" numeric(5,2),"grade_8" numeric(5,2))) b
on a.x_axis=b.x_axis and a.semester=b.semester
left join (select x_axis,semester,
 sum(case when x_value <=33 then 1 else 0 end)as value_below_33,
 sum(case when x_value > 33 and x_value<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when x_value > 60 and x_value<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when x_value >75 then 1 else 0 end)as value_above_75,
 round(sum(case when x_value <=33 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_below_33,
 round(sum(case when x_value > 33 and x_value<=60 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_between_33_60,
 round(sum(case when x_value > 60 and x_value<=75 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_between_60_75,
 round(sum(case when x_value >75 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_above_75
   from district_school group by x_axis,semester) as c 
   on b.x_axis=c.x_axis and b.semester=c.semester;

create or replace view hc_semester_performance_block as 
select a.x_axis as block_id,block_name,x_value as Performance,district_id,district_name,a.semester, 
b.grade_3,b.grade_4,b.grade_5,b.grade_6,b.grade_7,b.grade_8,c.value_below_33,c.value_between_33_60,c.value_between_60_75,c.value_above_75,
c.percent_below_33,c.percent_between_33_60,c.percent_between_60_75,c.percent_above_75
from
(SELECT block_id AS x_axis,Initcap(block_name) AS block_name,district_id,Initcap(district_name) AS district_name
  ,'latitude' AS y_axis,block_latitude AS y_value,'longitude' AS z_axis,block_longitude AS z_value,
Sum(students_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,semester,
Round(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
  case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
  +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
  case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
  +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
  )*100.0/
Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
  subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),1)AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 and cluster_name is not null
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and semester=(select max(semester) 
  from school_student_subject_total_marks)
GROUP BY block_id,block_name,block_latitude,block_longitude,district_id,district_name,semester 
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0)as a
left join 
(select cast(split_part(string,'_',1) as bigint)as x_axis,cast(split_part(string,'_',2) as bigint) as semester,* from crosstab
(
'select concat(x_axis,''_'',semester)as string,grade,x_value from block_grade order by 1,2'
) as ct 
(string text,"grade_3" numeric(5,2),"grade_4" numeric(5,2),"grade_5" numeric(5,2),"grade_6" numeric(5,2)
,"grade_7" numeric(5,2),"grade_8" numeric(5,2))) b
on a.x_axis=b.x_axis and a.semester=b.semester
left join 
(select x_axis,semester,
 sum(case when x_value <=33 then 1 else 0 end)as value_below_33,
 sum(case when x_value > 33 and x_value<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when x_value > 60 and x_value<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when x_value >75 then 1 else 0 end)as value_above_75,
 round(sum(case when x_value <=33 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_below_33,
 round(sum(case when x_value > 33 and x_value<=60 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_between_33_60,
 round(sum(case when x_value > 60 and x_value<=75 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_between_60_75,
 round(sum(case when x_value >75 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_above_75
   from block_school group by x_axis,semester) as c
on b.x_axis=c.x_axis and b.semester=c.semester;

create or replace view hc_semester_performance_cluster as 
select a.x_axis as cluster_id,cluster_name,block_id,block_name,x_value as Performance,district_id,district_name,a.semester, 
b.grade_3,b.grade_4,b.grade_5,b.grade_6,b.grade_7,b.grade_8,c.value_below_33,c.value_between_33_60,c.value_between_60_75,c.value_above_75,
c.percent_below_33,c.percent_between_33_60,c.percent_between_60_75,c.percent_above_75
from
(SELECT distinct cluster_id AS x_axis,INITCAP(cluster_name) AS cluster_name,district_id,
  INITCAP(district_name) AS district_name,block_id,INITCAP(block_name) AS block_name,
Sum(students_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,semester,
'latitude' AS y_axis,cluster_latitude AS y_value,'longitude' AS z_axis,cluster_longitude AS z_value,
Round(NULLIF(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
  case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
  +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
  case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
  +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
  ),0)*100.0/
NULLIF(Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
  subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),0),1) AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL and cluster_name is not null
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and semester=(select max(semester) 
  from school_student_subject_total_marks)
GROUP BY cluster_id,cluster_name,cluster_latitude,cluster_longitude,block_id,block_name,district_id,district_name,semester 
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0)as a
left join 
(select cast(split_part(string,'_',1) as bigint)as x_axis,cast(split_part(string,'_',2) as bigint) as semester,* from crosstab
(
'select concat(x_axis,''_'',semester)as string,grade,x_value from cluster_grade order by 1,2'
) as ct 
(string text,"grade_3" numeric(5,2),"grade_4" numeric(5,2),"grade_5" numeric(5,2),"grade_6" numeric(5,2)
,"grade_7" numeric(5,2),"grade_8" numeric(5,2))) b
on a.x_axis=b.x_axis and a.semester=b.semester
left join (
select x_axis,semester,
sum(case when x_value <=33 then 1 else 0 end)as value_below_33,
 sum(case when x_value > 33 and x_value<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when x_value > 60 and x_value<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when x_value >75 then 1 else 0 end)as value_above_75,
 round(sum(case when x_value <=33 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_below_33,
 round(sum(case when x_value > 33 and x_value<=60 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_between_33_60,
 round(sum(case when x_value > 60 and x_value<=75 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_between_60_75,
 round(sum(case when x_value >75 then 1 else 0 end)*100.0/count(distinct(school_id)),1) as percent_above_75
   from cluster_school group by x_axis,semester)as c
on b.x_axis=c.x_axis and b.semester=c.semester;

create or replace view hc_semester_performance_school as 
select a.x_axis as school_id,school_name,cluster_id,cluster_name,crc_name,block_id,block_name,x_value as Performance,district_id,district_name,a.semester, 
b.grade_3,b.grade_4,b.grade_5,b.grade_6,b.grade_7,b.grade_8
from
(SELECT school_id AS x_axis,Initcap(school_name) AS school_name,district_id,Initcap(district_name) AS district_name,block_id,Initcap(block_name)AS block_name,cluster_id,
Initcap(cluster_name) AS cluster_name,Initcap(crc_name)AS crc_name,
Sum(students_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,semester,
'latitude' AS y_axis,school_latitude AS y_value,'longitude' AS z_axis,school_longitude AS z_value,
Round(NULLIF(Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
  case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
  +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
  case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
  +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
  ),0)*100.0/
NULLIF(Sum(subject_1_total_marks+subject_3_total_marks+subject_2_total_marks+subject_4_total_marks+subject_5_total_marks+
  subject_7_total_marks+subject_6_total_marks+subject_8_total_marks),0),1) AS x_value
FROM school_student_subject_total_marks WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL 
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 and cluster_name is not null
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and semester=(select max(semester) 
  from school_student_subject_total_marks)
GROUP BY school_id,school_name,crc_name,school_latitude,school_longitude,cluster_id,cluster_name,crc_name,block_id,block_name,district_id,district_name,semester 
having Sum(case when subject_1_marks_scored is null then 0 else subject_1_marks_scored end + 
 case when subject_3_marks_scored is null then 0 else subject_3_marks_scored end+case when subject_2_marks_scored is null then 0 else subject_2_marks_scored end
 +case when subject_4_marks_scored is null then 0 else subject_4_marks_scored end+
 case when subject_5_marks_scored is null then 0 else subject_5_marks_scored end+case when subject_7_marks_scored is null then 0 else subject_7_marks_scored end
 +case when subject_6_marks_scored is null then 0 else subject_6_marks_scored end+case when subject_8_marks_scored is null then 0 else subject_8_marks_scored end
 ) <> 0)as a
left join 
(select cast(split_part(string,'_',1) as bigint)as x_axis,cast(split_part(string,'_',2) as bigint) as semester,* from crosstab
(
'select concat(x_axis,''_'',semester)as string,grade,x_value from school_grade order by 1,2'
) as ct 
(string text,"grade_3" numeric(5,2),"grade_4" numeric(5,2),"grade_5" numeric(5,2),"grade_6" numeric(5,2)
,"grade_7" numeric(5,2),"grade_8" numeric(5,2))) b
on a.x_axis=b.x_axis and a.semester=b.semester;

/*udise*/

create or replace view hc_udise_district as 
select uds.*,usc.value_below_33,usc.value_between_33_60,usc.value_between_60_75,usc.value_above_75 from udise_district_score as uds left join 
(select district_id,
 sum(case when Infrastructure_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when Infrastructure_score > 33 and Infrastructure_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when Infrastructure_score > 60 and Infrastructure_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when Infrastructure_score >75 then 1 else 0 end)as value_above_75
   from udise_school_score group by district_id)as usc
on uds.district_id= usc.district_id;

create or replace view hc_udise_block as  
select uds.*,usc.value_below_33,usc.value_between_33_60,usc.value_between_60_75,usc.value_above_75 from udise_block_score as uds left join 
(select block_id,
 sum(case when Infrastructure_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when Infrastructure_score > 33 and Infrastructure_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when Infrastructure_score > 60 and Infrastructure_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when Infrastructure_score >75 then 1 else 0 end)as value_above_75
   from udise_school_score group by block_id)as usc
on uds.block_id= usc.block_id;

create or replace view hc_udise_cluster as  
select uds.*,usc.value_below_33,usc.value_between_33_60,usc.value_between_60_75,usc.value_above_75 from udise_cluster_score as uds left join 
(select cluster_id,
 sum(case when Infrastructure_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when Infrastructure_score > 33 and Infrastructure_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when Infrastructure_score > 60 and Infrastructure_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when Infrastructure_score >75 then 1 else 0 end)as value_above_75
   from udise_school_score group by cluster_id)as usc
on uds.cluster_id= usc.cluster_id;

create or replace view hc_udise_school as  
select uds.*,usc.value_below_33,usc.value_between_33_60,usc.value_between_60_75,usc.value_above_75 from udise_school_score as uds left join 
(select udise_school_id,
 sum(case when Infrastructure_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when Infrastructure_score > 33 and Infrastructure_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when Infrastructure_score > 60 and Infrastructure_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when Infrastructure_score >75 then 1 else 0 end)as value_above_75
   from udise_school_score group by udise_school_id)as usc
on uds.udise_school_id= usc.udise_school_id;

/*attendance*/

create or replace view hc_student_attendance_district as 
SELECT district_id,INITCAP(district_name) AS district_name, 
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS Attendance,
Sum(students_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools
  ,year,month 
FROM school_student_total_attendance WHERE district_name IS NOT NULL AND block_latitude IS NOT NULL and year = (select max(year) from school_student_total_attendance)
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and cluster_name is not null and total_working_days>0
GROUP BY district_id,district_latitude,district_longitude,district_name ,year,month;

create or replace view hc_student_attendance_block as 
SELECT block_id,INITCAP(block_name) AS block_name,district_id,INITCAP(district_name) AS district_name,
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS Attendance,
Sum(students_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,
year,month 
FROM school_student_total_attendance WHERE block_name IS NOT NULL AND block_latitude IS NOT NULL and year = (select max(year) from school_student_total_attendance)
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and cluster_name is not null and total_working_days>0
GROUP BY block_id,block_name,block_latitude,block_longitude,district_id,district_name,year,month;

create or replace view hc_student_attendance_cluster as 
SELECT cluster_id,INITCAP(cluster_name) AS cluster_name,district_id,INITCAP(district_name) AS district_name,block_id,INITCAP(block_name) AS block_name,
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS Attendance,
Sum(students_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,
year,month 
FROM school_student_total_attendance WHERE cluster_latitude IS NOT NULL AND block_latitude IS NOT NULL and year = (select max(year) from school_student_total_attendance)
AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
AND school_latitude IS NOT NULL AND school_name IS NOT NULL and cluster_name is not null and total_working_days>0
GROUP BY cluster_id,cluster_name,cluster_latitude,cluster_longitude,block_id,block_name,district_id,district_name,year,month;

create or replace view hc_student_attendance_school as 
SELECT school_id,INITCAP(school_name) AS school_name,district_id,INITCAP(district_name) AS district_name,block_id,INITCAP(block_name)AS block_name,cluster_id,
INITCAP(cluster_name) AS cluster_name,INITCAP(crc_name)AS crc_name, 
Round(Sum(total_present)*100.0/Sum(total_working_days),1)AS Attendance,
Sum(students_count) AS students_count,Count(DISTINCT(school_id)) AS total_schools,
year,month 
FROM school_student_total_attendance WHERE block_latitude IS NOT NULL AND block_latitude <> 0 and year = (select max(year) from school_student_total_attendance)
AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 AND school_latitude IS NOT NULL 
AND school_name IS NOT NULL and cluster_name is not null and total_working_days>0
GROUP BY school_id,school_name,crc_name,school_latitude,school_longitude,year,month,cluster_id,cluster_name,crc_name,block_id,block_name,district_id,district_name,year,month;

/*crc*/

create or replace view hc_crc_school as
select spd.district_id,initcap(spd.district_name)as district_name,spd.block_id,initcap(spd.block_name) as block_name,spd.cluster_id,initcap(spd.cluster_name)as cluster_name,spd.school_id,
initcap(spd.school_name) as school_name,spd.total_schools,
coalesce(spd.total_visits,0) total_crc_visits,coalesce(visited_school_count,0) as visited_school_count,
(spd.total_schools-coalesce(visited_school_count,0)) as not_visited_school_count,
coalesce(round((spd.total_schools-coalesce(visited_school_count,0))*100/spd.total_schools,1),0) as schools_0,
coalesce(round(spd.schools_1_2*100/spd.total_schools,1),0) as schools_1_2,
coalesce(round(spd.schools_3_5*100/spd.total_schools,1),0) as schools_3_5,
coalesce(round(spd.schools_6_10*100/spd.total_schools,1),0) as schools_6_10,
coalesce(round(spd.schools_10*100/spd.total_schools,1),0) as schools_10,spd.no_of_schools_per_crc,
coalesce(round(cast(cast(spd.total_visits as float)/cast(spd.total_schools as float) as numeric),1),0) as visit_percent_per_school
from (
(select district_id,district_name,block_id,block_name,cluster_id,cluster_name,school_id,school_name,
  count(distinct school_id) as total_schools,
round(cast(cast(count(distinct school_id) as float)/nullif(cast(count(distinct cluster_id) as float),0) as numeric),1) as no_of_schools_per_crc
    from school_hierarchy_details  where cluster_name is not null and block_name is not null
    and school_name is not null and district_name is not null
    group by district_id,district_name,block_id,block_name,cluster_id,cluster_name,school_id,school_name) s left join
(select school_id as schl_id, sum(school_count) as total_visits,sum(schools_1_2) as schools_1_2,
sum(schools_3_5) as schools_3_5,sum(schools_6_10) as schools_6_10,sum(schools_10) as schools_10
from
(select school_id,sum(visit_count)as visit_count,count(distinct(school_id))*sum(visit_count) as school_count,
case when sum(visit_count) between 1 and 2 then count(distinct(school_id)) end as schools_1_2,
case when sum(visit_count) between 3 and 5 then count(distinct(school_id)) end as schools_3_5,
case when sum(visit_count) between 6 and 10 then count(distinct(school_id)) end as schools_6_10,
case when sum(visit_count) >10 then count(distinct(school_id)) end as schools_10
from crc_visits_frequency
where visit_count>0 and cluster_name is not null
group by school_id) d group by school_id) t on s.school_id=t.schl_id) spd
left join
(select school_id,count(distinct(school_id))as visited_school_count from crc_visits_frequency
  where visit_count>0  and cluster_name is not null group by school_id)as scl_v
on spd.school_id=scl_v.school_id;

create or replace view hc_crc_cluster as
select spd.district_id,initcap(spd.district_name) as district_name,spd.block_id,initcap(spd.block_name)as block_name,spd.cluster_id,
initcap(spd.cluster_name)as cluster_name,spd.total_schools,
coalesce(spd.total_visits,0) total_crc_visits,coalesce(visited_school_count,0) as visited_school_count,
(spd.total_schools-coalesce(visited_school_count,0)) as not_visited_school_count,
coalesce(round(spd.schools_0*100/spd.total_schools,1),0) as schools_0,
coalesce(round(spd.schools_1_2*100/spd.total_schools,1),0) as schools_1_2,coalesce(round(spd.schools_3_5*100/spd.total_schools,1),0) as schools_3_5,
coalesce(round(spd.schools_6_10*100/spd.total_schools,1),0) as schools_6_10,
coalesce(round(spd.schools_10*100/spd.total_schools,1),0) as schools_10,spd.no_of_schools_per_crc,
coalesce(round(cast(cast(spd.total_visits as float)/cast(spd.total_schools as float) as numeric),1),0) as visit_percent_per_school
from (
(select district_id,district_name,block_id,block_name,cluster_id,cluster_name,count(distinct school_id) as total_schools,
    round(cast(cast(count(distinct school_id) as float)/nullif(cast(count(distinct cluster_id) as float),0) as numeric),1) as no_of_schools_per_crc
     from school_hierarchy_details  where cluster_name is not null and block_name is not null and school_name is not null and district_name is not null
      group by district_id,district_name,block_id,block_name,cluster_id,cluster_name) s left join 
(select cluster_id as clt_id, sum(school_count) as total_visits,sum(schools_0)as schools_0,sum(schools_1_2) as schools_1_2,
sum(schools_3_5) as schools_3_5,sum(schools_6_10) as schools_6_10,sum(schools_10) as schools_10
from
(select cluster_id,sum(total_crc_visits)as school_count, 
sum(case when schools_0>0 then 1 else 0 end) as schools_0,
  sum(case when schools_1_2>0 then 1 else 0 end) as schools_1_2,
 sum(case when schools_3_5>0 then 1 else 0 end) as schools_3_5,
 sum(case when schools_6_10>0 then 1 else 0 end) as schools_6_10,
 sum(case when schools_10>0 then 1 else 0 end) as schools_10
 from hc_crc_school where  cluster_name is not null
group by cluster_id) d group by cluster_id) t on s.cluster_id=t.clt_id) spd
left join 
(select cluster_id,count(distinct(school_id))as visited_school_count from crc_visits_frequency 
    where visit_count>0  and cluster_name is not null group by cluster_id)as scl_v
on spd.cluster_id=scl_v.cluster_id;

create or replace view hc_crc_block as
select spd.district_id,initcap(spd.district_name) as district_name,spd.block_id,initcap(spd.block_name)as block_name,spd.total_schools,
coalesce(spd.total_visits,0) total_crc_visits,coalesce(visited_school_count,0) as visited_school_count,
(spd.total_schools-coalesce(visited_school_count,0)) as not_visited_school_count,
coalesce(round(spd.schools_0*100/spd.total_schools,1),0) as schools_0,
coalesce(round(spd.schools_1_2*100/spd.total_schools,1),0) as schools_1_2,coalesce(round(spd.schools_3_5*100/spd.total_schools,1),0) as schools_3_5,coalesce(round(spd.schools_6_10*100/spd.total_schools,1),0) as schools_6_10,
coalesce(round(spd.schools_10*100/spd.total_schools,1),0) as schools_10,spd.no_of_schools_per_crc,
coalesce(round(cast(cast(spd.total_visits as float)/cast(spd.total_schools as float) as numeric),1),0) as visit_percent_per_school
from (
(select district_id,district_name,block_id,block_name,count(distinct school_id) as total_schools,
    round(cast(cast(count(distinct school_id) as float)/nullif(cast(count(distinct cluster_id) as float),0) as numeric),1) as no_of_schools_per_crc 
    from school_hierarchy_details  where cluster_name is not null and block_name is not null and school_name is not null and district_name is not null
     group by district_id,district_name,block_id,block_name) s left join 
(select block_id as blk_id, sum(school_count) as total_visits,sum(schools_0)as schools_0,sum(schools_1_2) as schools_1_2,
sum(schools_3_5) as schools_3_5,sum(schools_6_10) as schools_6_10,sum(schools_10) as schools_10
from
(select block_id,sum(total_crc_visits)as school_count, 
sum(case when schools_0>0 then 1 else 0 end) as schools_0,
  sum(case when schools_1_2>0 then 1 else 0 end) as schools_1_2,
 sum(case when schools_3_5>0 then 1 else 0 end) as schools_3_5,
 sum(case when schools_6_10>0 then 1 else 0 end) as schools_6_10,
 sum(case when schools_10>0 then 1 else 0 end) as schools_10
 from hc_crc_school where  cluster_name is not null
group by block_id) d group by block_id) t on s.block_id=t.blk_id) spd
left join 
(select block_id,count(distinct(school_id))as visited_school_count from crc_visits_frequency 
    where visit_count>0  and cluster_name is not null group by block_id)as scl_v
on spd.block_id=scl_v.block_id;

create or replace view hc_crc_district as
select 
spd.district_id,initcap(spd.district_name)as district_name,spd.total_schools,
coalesce(spd.total_visits,0) total_crc_visits,coalesce(visited_school_count,0) as visited_school_count,
(spd.total_schools-coalesce(visited_school_count,0)) as not_visited_school_count,
coalesce(round(spd.schools_0*100/spd.total_schools,1),0) as schools_0,
coalesce(round(spd.schools_1_2*100/spd.total_schools,1),0) as schools_1_2,coalesce(round(spd.schools_3_5*100/spd.total_schools,1),0) as schools_3_5,coalesce(round(spd.schools_6_10*100/spd.total_schools,1),0) as schools_6_10,
coalesce(round(spd.schools_10*100/spd.total_schools,1),0) as schools_10,spd.no_of_schools_per_crc,
coalesce(round(cast(cast(spd.total_visits as float)/cast(spd.total_schools as float) as numeric),1),0) as visit_percent_per_school
 from 
((select count(distinct school_id) as total_schools,district_id,district_name,
    round(nullif(cast(cast(count(distinct school_id) as float)/nullif(cast(count(distinct cluster_id) as float),0) as numeric),1)) as no_of_schools_per_crc 
    from school_hierarchy_details where cluster_name is not null and block_name is not null and school_name is not null and district_name is not null
    group by district_id,district_name) s left join 
(select district_id as dist_id, sum(school_count) as total_visits,sum(schools_0)as schools_0,sum(schools_1_2) as schools_1_2,
sum(schools_3_5) as schools_3_5,sum(schools_6_10) as schools_6_10,sum(schools_10) as schools_10 from
 (select district_id,sum(total_crc_visits)as school_count, 
sum(case when schools_0>0 then 1 else 0 end) as schools_0,
  sum(case when schools_1_2>0 then 1 else 0 end) as schools_1_2,
 sum(case when schools_3_5>0 then 1 else 0 end) as schools_3_5,
 sum(case when schools_6_10>0 then 1 else 0 end) as schools_6_10,
 sum(case when schools_10>0 then 1 else 0 end) as schools_10
 from hc_crc_school where  cluster_name is not null
group by district_id)as d group by district_id)as t  on s.district_id=t.dist_id)as spd
left join 
(select district_id,count(distinct(school_id))as visited_school_count from crc_visits_frequency 
    where visit_count>0 and  cluster_name is not null group by district_id)as scl_v
on spd.district_id=scl_v.district_id;


CREATE OR REPLACE FUNCTION infra_areas_to_focus()
RETURNS text AS
$$
DECLARE
school_atf text:='select ''select school_id, array[''||string_agg(''case when ''||
replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent<30 then ''''''||
 case when infrastructure_name ~* ''^[^aeyiuo]+$'' then replace(trim(upper(infrastructure_name)),''_'','' '')
else replace(trim(initcap(infrastructure_name)),''_'','' '') end ||'''''' else ''''0'''' end'','','')||
'']as areas_to_focus from infra_school_table_view'' 
from infrastructure_master where status = true order by 1';
school_atf_value text; 
cluster_atf text:='select ''select cluster_id, array[''||string_agg(''case when ''||
replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent<30 then ''''''||
case when infrastructure_name ~* ''^[^aeyiuo]+$'' then replace(trim(upper(infrastructure_name)),''_'','' '')
else replace(trim(initcap(infrastructure_name)),''_'','' '') end||'''''' else ''''0'''' end'','','')||
'']as areas_to_focus from infra_cluster_table_view'' 
from infrastructure_master where status = true order by 1';
cluster_atf_value text; 
block_atf text:='select ''select block_id, array[''||string_agg(''case when ''||
replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent<30 then ''''''||
case when infrastructure_name ~* ''^[^aeyiuo]+$'' then replace(trim(upper(infrastructure_name)),''_'','' '')
else replace(trim(initcap(infrastructure_name)),''_'','' '') end ||'''''' else ''''0'''' end'','','')||
'']as areas_to_focus from infra_block_table_view'' 
from infrastructure_master where status = true order by 1';
block_atf_value text; 
district_atf text:='select ''select district_id, array[''||string_agg(''case when ''||
replace(trim(LOWER(infrastructure_name)),'' '',''_'')||''_percent<30 then ''''''||
case when infrastructure_name ~* ''^[^aeyiuo]+$'' then replace(trim(upper(infrastructure_name)),''_'','' '')
else replace(trim(initcap(infrastructure_name)),''_'','' '') end ||'''''' else ''''0'''' end'','','')||
'']as areas_to_focus from infra_district_table_view'' 
from infrastructure_master where status = true order by 1';
district_atf_value text; 
query text;
BEGIN
Execute school_atf into school_atf_value;
Execute cluster_atf into cluster_atf_value;
Execute block_atf into block_atf_value;
Execute district_atf into district_atf_value;
IF school_atf <> '' THEN 
query='create or replace view infra_school_atf as 
select school_id,array_remove(areas_to_focus,''0'')as areas_to_focus from ('||school_atf_value||') as a;
create or replace view infra_cluster_atf as 
select cluster_id,array_remove(areas_to_focus,''0'')as areas_to_focus from ('||cluster_atf_value||') as a;
create or replace view infra_block_atf as 
select block_id,array_remove(areas_to_focus,''0'')as areas_to_focus from ('||block_atf_value||') as a;
create or replace view infra_district_atf as 
select district_id,array_remove(areas_to_focus,''0'')as areas_to_focus from ('||district_atf_value||') as a;';
Execute query; 
END IF;
return 0;
END;
$$LANGUAGE plpgsql;

select infra_areas_to_focus();

/*school - infra*/

create or replace view hc_infra_school as
select b.*,atf.areas_to_focus,c.school_level_rank_within_the_state,
c.school_level_rank_within_the_district,c.school_level_rank_within_the_block,c.school_level_rank_within_the_cluster from (select idt.*,ist.value_below_33,ist.value_between_33_60,ist.value_between_60_75,ist.value_above_75 from 
infra_school_table_view as idt
left join
(select school_id,
 sum(case when infra_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when infra_score > 33 and infra_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when infra_score > 60 and infra_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when infra_score >75 then 1 else 0 end)as value_above_75
   from infra_school_table_view group by school_id)as ist
on idt.school_id= ist.school_id) as b
left join(select usc.school_id,infra_score,
       ( ( Rank()
             over (
               PARTITION BY a.cluster_id
               ORDER BY usc.infra_score DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_cluster) ) AS school_level_rank_within_the_cluster,
( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.infra_score DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_block) ) AS school_level_rank_within_the_block, 
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.infra_score DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_district) ) AS school_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.infra_score DESC)
           || ' out of ' :: text )
         ||  a.total_schools) AS school_level_rank_within_the_state                         
 from (select idt.*,ist.value_below_33,ist.value_between_33_60,ist.value_between_60_75,ist.value_above_75 from 
infra_school_table_view as idt
left join
(select school_id,
 sum(case when infra_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when infra_score > 33 and infra_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when infra_score > 60 and infra_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when infra_score >75 then 1 else 0 end)as value_above_75
   from infra_school_table_view group by school_id)as ist
on idt.school_id= ist.school_id) as usc
left join
(select a.*,(select count(DISTINCT(school_id)) from infra_school_table_view)as total_schools 
from (select school_id,c.cluster_id,schools_in_cluster,b.block_id,schools_in_block,d.district_id,schools_in_district from infra_school_table_view as scl
left join 
(SELECT cluster_id,Count(DISTINCT infra_school_table_view.school_id) AS schools_in_cluster FROM   infra_school_table_view group by cluster_id) as c
on scl.cluster_id=c.cluster_id
left join
(SELECT block_id,Count(DISTINCT infra_school_table_view.school_id) AS schools_in_block FROM   infra_school_table_view group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT infra_school_table_view.school_id) AS schools_in_district FROM   infra_school_table_view group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.school_id=a.school_id
group by usc.school_id,infra_score
,a.cluster_id,a.block_id,a.district_id,a.total_schools) as c
ON b.school_id = c.school_id
left join infra_school_atf as atf on b.school_id=atf.school_id;

/*cluster*/

create or replace view hc_infra_cluster as
select b.*,atf.areas_to_focus,c.cluster_level_rank_within_the_state,
c.cluster_level_rank_within_the_district,c.cluster_level_rank_within_the_block from 
(select idt.*,ist.value_below_33,ist.value_between_33_60,ist.value_between_60_75,ist.value_above_75 from 
infra_cluster_table_view as idt
left join
(select cluster_id,
sum(case when infra_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when infra_score > 33 and infra_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when infra_score > 60 and infra_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when infra_score >75 then 1 else 0 end)as value_above_75
   from infra_school_table_view group by cluster_id)as ist
on idt.cluster_id= ist.cluster_id) as b
left join(select usc.cluster_id,infra_score,
       ( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.infra_score DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_block) ) AS cluster_level_rank_within_the_block,
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.infra_score DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_district) ) AS cluster_level_rank_within_the_district, 
( ( Rank()
             over (
               ORDER BY usc.infra_score DESC)
           || ' out of ' :: text )
         ||  a.total_clusters) AS cluster_level_rank_within_the_state                         
 from (select idt.*,ist.value_below_33,ist.value_between_33_60,ist.value_between_60_75,ist.value_above_75 from 
infra_cluster_table_view as idt
left join
(select cluster_id,
 sum(case when infra_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when infra_score > 33 and infra_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when infra_score > 60 and infra_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when infra_score >75 then 1 else 0 end)as value_above_75
   from infra_school_table_view group by cluster_id)as ist
on idt.cluster_id= ist.cluster_id) as usc
left join
(select a.*,(select count(DISTINCT(cluster_id)) from infra_school_table_view)as total_clusters
from (select distinct(scl.cluster_id),clusters_in_block,b.block_id,clusters_in_district,d.district_id from infra_school_table_view as scl
left join
(SELECT block_id,Count(DISTINCT infra_school_table_view.cluster_id) AS clusters_in_block FROM   infra_school_table_view group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT infra_school_table_view.cluster_id) AS clusters_in_district FROM   infra_school_table_view group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.cluster_id=a.cluster_id
group by infra_score
,usc.cluster_id,a.total_clusters,a.block_id,a.district_id) as c
ON b.cluster_id = c.cluster_id
left join infra_cluster_atf as atf on b.cluster_id=atf.cluster_id;

/*block*/

create or replace view  hc_infra_block as
select b.*,atf.areas_to_focus,c.block_level_rank_within_the_state,
c.block_level_rank_within_the_district from (select idt.*,ist.value_below_33,ist.value_between_33_60,ist.value_between_60_75,ist.value_above_75 from 
infra_block_table_view as idt
left join
(select block_id,
 sum(case when infra_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when infra_score > 33 and infra_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when infra_score > 60 and infra_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when infra_score >75 then 1 else 0 end)as value_above_75
   from infra_school_table_view group by block_id)as ist
on idt.block_id= ist.block_id) as b
left join(select usc.block_id,infra_score,
       ( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.infra_score DESC)
           || ' out of ' :: text )
         || sum(a.blocks_in_district) ) AS block_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.infra_score DESC)
           || ' out of ' :: text )
         ||  a.total_blocks) AS block_level_rank_within_the_state                         
 from (select idt.*,ist.value_below_33,ist.value_between_33_60,ist.value_between_60_75,ist.value_above_75 from 
infra_block_table_view as idt
left join
(select block_id,
 sum(case when infra_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when infra_score > 33 and infra_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when infra_score > 60 and infra_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when infra_score >75 then 1 else 0 end)as value_above_75
   from infra_school_table_view group by block_id)as ist
on idt.block_id= ist.block_id) as usc
left join
(select a.*,(select count(DISTINCT(block_id)) from infra_school_table_view)as total_blocks
from (select distinct(scl.block_id),blocks_in_district,d.district_id from infra_school_table_view as scl
left join
(SELECT district_id,Count(DISTINCT infra_school_table_view.block_id) AS blocks_in_district FROM   infra_school_table_view group by district_id)as d
on scl.district_id=d.district_id)as a)as a
on usc.block_id=a.block_id
group by infra_score
,usc.block_id,a.total_blocks,a.district_id) as c
ON b.block_id = c.block_id
left join infra_block_atf as atf on b.block_id=atf.block_id;

/*district*/

create or replace view hc_infra_district as 
select idt.*,atf.areas_to_focus,ist.value_below_33,ist.value_between_33_60,ist.value_between_60_75,ist.value_above_75 from 
(select *,((rank () over ( order by infra_score desc))||' out of '||(select count(distinct(district_id)) 
from infra_district_table_view)) as district_level_rank_within_the_state from infra_district_table_view) as idt
left join
(select district_id,
 sum(case when infra_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when infra_score > 33 and infra_score<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when infra_score > 60 and infra_score<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when infra_score >75 then 1 else 0 end)as value_above_75
   from infra_school_table_view group by district_id)as ist
on idt.district_id= ist.district_id
left join infra_district_atf as atf on idt.district_id=atf.district_id;

/*--------------------------------------------------------------HEALTH CARD INDEX main views---------------------------------*/

/*Health card index school*/

create or replace view health_card_index_school as 
select basic.*,row_to_json(student_attendance.*) as student_attendance,row_to_json(semester.*) as student_semester,row_to_json(udise.*) as udise,
row_to_json(pat.*) as PAT_performance,row_to_json(crc.*) as CRC_visit,row_to_json(infra.*) as school_infrastructure
 from 
(select shd.district_id,initcap(shd.district_name)as district_name,shd.block_id,initcap(shd.block_name)as block_name,shd.cluster_id,initcap(shd.cluster_name)as cluster_name,
  shd.school_id,initcap(shd.school_name)as school_name,
  count(distinct(usmt.udise_school_id)) as total_schools,sum(usmt.total_students)as total_students from
(select udise_school_id,sum(no_of_students) as total_students from udise_school_metrics_trans group by udise_school_id)as usmt right join school_hierarchy_details as shd
on usmt.udise_school_id=shd.school_id where 
cluster_name is not null and school_name is not null and block_name is not null and district_name is not null
group by shd.district_id,shd.district_name,shd.block_id,shd.block_name,shd.cluster_id,shd.cluster_name,shd.school_id,shd.school_name)as basic
left join 
(select b.*,c.school_level_rank_within_the_state,
c.school_level_rank_within_the_district,c.school_level_rank_within_the_block,c.school_level_rank_within_the_cluster from 
(select sad.*,sac.value_below_33,sac.value_between_33_60,sac.value_between_60_75,sac.value_above_75
 from hc_student_attendance_school as sad left join
(select school_id,
 sum(case when attendance <=33 then 1 else 0 end)as value_below_33,
 sum(case when attendance > 33 and attendance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when attendance > 60 and attendance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when attendance > 75 then 1 else 0 end)as value_above_75
   from hc_student_attendance_school where month=(select max(month) from hc_student_attendance_school) group by school_id)as sac
on sad.school_id= sac.school_id
where month=(select max(month) from hc_student_attendance_school)) as b
left join(select usc.school_id,attendance,
       ( ( Rank()
             over (
               PARTITION BY a.cluster_id
               ORDER BY usc.attendance DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_cluster) ) AS school_level_rank_within_the_cluster,
( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.attendance DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_block) ) AS school_level_rank_within_the_block, 
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.attendance DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_district) ) AS school_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.attendance DESC)
           || ' out of ' :: text )
         ||  a.total_schools) AS school_level_rank_within_the_state                         
 from (select sad.*,sac.value_below_33,sac.value_between_33_60,sac.value_between_60_75,sac.value_above_75
 from hc_student_attendance_school as sad left join
(select school_id,
 sum(case when attendance <=33 then 1 else 0 end)as value_below_33,
 sum(case when attendance > 33 and attendance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when attendance > 60 and attendance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when attendance > 75 then 1 else 0 end)as value_above_75
   from hc_student_attendance_school where month=(select max(month) from hc_student_attendance_school) group by school_id)as sac
on sad.school_id= sac.school_id
where month=(select max(month) from hc_student_attendance_school)) as usc
left join
(select a.*,(select count(DISTINCT(school_id)) from hc_student_attendance_school)as total_schools 
from (select school_id,c.cluster_id,schools_in_cluster,b.block_id,schools_in_block,d.district_id,schools_in_district from hc_student_attendance_school as scl
left join 
(SELECT cluster_id,Count(DISTINCT hc_student_attendance_school.school_id) AS schools_in_cluster FROM   hc_student_attendance_school group by cluster_id) as c
on scl.cluster_id=c.cluster_id
left join
(SELECT block_id,Count(DISTINCT hc_student_attendance_school.school_id) AS schools_in_block FROM   hc_student_attendance_school group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT hc_student_attendance_school.school_id) AS schools_in_district FROM   hc_student_attendance_school group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.school_id=a.school_id
group by usc.school_id,attendance
,a.cluster_id,a.block_id,a.district_id,a.total_schools) as c
ON b.school_id = c.school_id)as student_attendance
on basic.school_id=student_attendance.school_id
left join 
(select sem_data.*,
(case when performance <=33 then 1 else 0 end)as value_below_33,
(case when performance > 33 and performance<=60 then 1 else 0 end)as value_between_33_60,
(case when performance > 60 and performance<=75 then 1 else 0 end)as value_between_60_75,
(case when performance >75 then 1 else 0 end)as value_above_75
from
(select b.*,c.school_level_rank_within_the_state,
c.school_level_rank_within_the_district,c.school_level_rank_within_the_block,c.school_level_rank_within_the_cluster from hc_semester_performance_school as b
left join(select usc.school_id,Performance,
       ( ( Rank()
             over (
               PARTITION BY a.cluster_id
               ORDER BY usc.Performance DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_cluster) ) AS school_level_rank_within_the_cluster,
( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.Performance DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_block) ) AS school_level_rank_within_the_block, 
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.Performance DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_district) ) AS school_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.Performance DESC)
           || ' out of ' :: text )
         ||  a.total_schools) AS school_level_rank_within_the_state                         
 from hc_semester_performance_school as usc
left join
(select a.*,(select count(DISTINCT(school_id)) from hc_semester_performance_school)as total_schools 
from (select school_id,c.cluster_id,schools_in_cluster,b.block_id,schools_in_block,d.district_id,schools_in_district from hc_semester_performance_school as scl
left join 
(SELECT cluster_id,Count(DISTINCT hc_semester_performance_school.school_id) AS schools_in_cluster FROM   hc_semester_performance_school group by cluster_id) as c
on scl.cluster_id=c.cluster_id
left join
(SELECT block_id,Count(DISTINCT hc_semester_performance_school.school_id) AS schools_in_block FROM   hc_semester_performance_school group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT hc_semester_performance_school.school_id) AS schools_in_district FROM   hc_semester_performance_school group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.school_id=a.school_id
group by usc.school_id,Performance
,a.cluster_id,a.block_id,a.district_id,a.total_schools) as c
ON b.school_id = c.school_id)as sem_data)as semester
on basic.school_id=semester.school_id
left join 
(select b.*,c.school_level_rank_within_the_state,
c.school_level_rank_within_the_district,c.school_level_rank_within_the_block,c.school_level_rank_within_the_cluster from hc_udise_school as b
left join(select usc.udise_school_id,infrastructure_score,
       ( ( Rank()
             over (
               PARTITION BY a.cluster_id
               ORDER BY usc.infrastructure_score DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_cluster) ) AS school_level_rank_within_the_cluster,
( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.infrastructure_score DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_block) ) AS school_level_rank_within_the_block, 
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.infrastructure_score DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_district) ) AS school_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.infrastructure_score DESC)
           || ' out of ' :: text )
         ||  a.total_schools) AS school_level_rank_within_the_state                         
 from hc_udise_school as usc
left join
(select a.*,(select count(DISTINCT(udise_school_id)) from udise_school_metrics_agg)as total_schools 
from (select udise_school_id,c.cluster_id,schools_in_cluster,b.block_id,schools_in_block,d.district_id,schools_in_district from udise_school_metrics_agg as scl
left join 
(SELECT cluster_id,Count(DISTINCT udise_school_metrics_agg.udise_school_id) AS schools_in_cluster FROM   udise_school_metrics_agg group by cluster_id) as c
on scl.cluster_id=c.cluster_id
left join
(SELECT block_id,Count(DISTINCT udise_school_metrics_agg.udise_school_id) AS schools_in_block FROM   udise_school_metrics_agg group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT udise_school_metrics_agg.udise_school_id) AS schools_in_district FROM   udise_school_metrics_agg group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.udise_school_id=a.udise_school_id
group by usc.udise_school_id,infrastructure_score
,a.cluster_id,a.block_id,a.district_id,a.total_schools) as c
ON b.udise_school_id = c.udise_school_id)as udise
on basic.school_id=udise.udise_school_id
left join 
(select b.*,c.school_level_rank_within_the_state,
c.school_level_rank_within_the_district,c.school_level_rank_within_the_block,c.school_level_rank_within_the_cluster from 
(select ped.*,pes.value_below_33,pes.value_between_33_60,pes.value_between_60_75,pes.value_above_75 from 
(Select district_id,district_name,block_id,block_name,cluster_id,cluster_name,school_id,school_name,grade_wise_performance,school_performance
 from periodic_exam_school_all 
where academic_year=(select max(academic_year) from periodic_exam_school_all))as ped left join
(select school_id,
 sum(case when school_performance <=33 then 1 else 0 end)as value_below_33,
 sum(case when school_performance > 33 and school_performance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when school_performance > 60 and school_performance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when school_performance >75 then 1 else 0 end)as value_above_75
   from periodic_exam_school_all where academic_year=(select max(academic_year) from periodic_exam_school_all) 
   group by school_id)as pes
on ped.school_id= pes.school_id) as b
left join(select usc.school_id,school_performance,
       ( ( Rank()
             over (
               PARTITION BY a.cluster_id
               ORDER BY usc.school_performance DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_cluster) ) AS school_level_rank_within_the_cluster,
( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.school_performance DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_block) ) AS school_level_rank_within_the_block, 
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.school_performance DESC)
           || ' out of ' :: text )
         || sum(a.schools_in_district) ) AS school_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.school_performance DESC)
           || ' out of ' :: text )
         ||  a.total_schools) AS school_level_rank_within_the_state                         
 from (select ped.*,pes.value_below_33,pes.value_between_33_60,pes.value_between_60_75,pes.value_above_75 from 
(Select district_id,district_name,block_id,block_name,cluster_id,cluster_name,school_id,school_name,grade_wise_performance,school_performance
 from periodic_exam_school_all 
where academic_year=(select max(academic_year) from periodic_exam_school_all))as ped left join
(select school_id,
 sum(case when school_performance <=33 then 1 else 0 end)as value_below_33,
 sum(case when school_performance > 33 and school_performance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when school_performance > 60 and school_performance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when school_performance >75 then 1 else 0 end)as value_above_75
   from periodic_exam_school_all where academic_year=(select max(academic_year) from periodic_exam_school_all) group by school_id)as pes
on ped.school_id= pes.school_id) as usc
left join
(select a.*,(select count(DISTINCT(school_id)) from periodic_exam_school_all)as total_schools 
from (select school_id,c.cluster_id,schools_in_cluster,b.block_id,schools_in_block,d.district_id,schools_in_district from periodic_exam_school_all as scl
left join 
(SELECT cluster_id,Count(DISTINCT periodic_exam_school_all.school_id) AS schools_in_cluster FROM   periodic_exam_school_all group by cluster_id) as c
on scl.cluster_id=c.cluster_id
left join
(SELECT block_id,Count(DISTINCT periodic_exam_school_all.school_id) AS schools_in_block FROM   periodic_exam_school_all group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT periodic_exam_school_all.school_id) AS schools_in_district FROM   periodic_exam_school_all group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.school_id=a.school_id
group by usc.school_id,school_performance
,a.cluster_id,a.block_id,a.district_id,a.total_schools) as c
ON b.school_id = c.school_id)as pat
on basic.school_id=pat.school_id
left join 
hc_crc_school as crc
on basic.school_id=crc.school_id
left join
hc_infra_school as infra
on basic.school_id=infra.school_id;

/*Health card index cluster*/

create or replace view health_card_index_cluster as 
select basic.*,row_to_json(student_attendance.*) as student_attendance,row_to_json(semester.*) as student_semester,row_to_json(udise.*) as udise,
row_to_json(pat.*) as PAT_performance,row_to_json(crc.*) as CRC_visit,row_to_json(infra.*) as school_infrastructure
 from 
(select shd.district_id,initcap(shd.district_name)as district_name,shd.block_id,initcap(shd.block_name)as block_name,shd.cluster_id,initcap(shd.cluster_name)as cluster_name,
  count(distinct(usmt.udise_school_id)) as total_schools,sum(usmt.total_students)as total_students from
(select udise_school_id,sum(no_of_students) as total_students from udise_school_metrics_trans group by udise_school_id)as usmt right join school_hierarchy_details as shd
on usmt.udise_school_id=shd.school_id where cluster_name is not null and school_name is not null and block_name is not null and district_name is not null
group by shd.district_id,shd.district_name,shd.block_id,shd.block_name,shd.cluster_id,shd.cluster_name)as basic
left join 
(select b.*,c.cluster_level_rank_within_the_state,
c.cluster_level_rank_within_the_district,c.cluster_level_rank_within_the_block from 
(select sad.*,sac.value_below_33,sac.value_between_33_60,sac.value_between_60_75,sac.value_above_75
 from hc_student_attendance_cluster as sad left join
(select cluster_id,
 sum(case when attendance <=33 then 1 else 0 end)as value_below_33,
 sum(case when attendance > 33 and attendance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when attendance > 60 and attendance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when attendance > 75 then 1 else 0 end)as value_above_75
   from hc_student_attendance_school where month=(select max(month) from hc_student_attendance_cluster) group by cluster_id)as sac
on sad.cluster_id= sac.cluster_id
where month=(select max(month) from hc_student_attendance_cluster)) as b
left join(select usc.cluster_id,attendance,
       ( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.attendance DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_block) ) AS cluster_level_rank_within_the_block,
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.attendance DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_district) ) AS cluster_level_rank_within_the_district, 
( ( Rank()
             over (
               ORDER BY usc.attendance DESC)
           || ' out of ' :: text )
         ||  a.total_clusters) AS cluster_level_rank_within_the_state                         
 from (select sad.*,sac.value_below_33,sac.value_between_33_60,sac.value_between_60_75,sac.value_above_75
 from hc_student_attendance_cluster as sad left join
(select cluster_id,
 sum(case when attendance <=33 then 1 else 0 end)as value_below_33,
 sum(case when attendance > 33 and attendance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when attendance > 60 and attendance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when attendance > 75 then 1 else 0 end)as value_above_75
   from hc_student_attendance_school where month=(select max(month) from hc_student_attendance_cluster) group by cluster_id)as sac
on sad.cluster_id= sac.cluster_id
where month=(select max(month) from hc_student_attendance_cluster)) as usc
left join
(select a.*,(select count(DISTINCT(cluster_id)) from hc_student_attendance_school)as total_clusters
from (select distinct(scl.cluster_id),clusters_in_block,b.block_id,clusters_in_district,d.district_id from hc_student_attendance_school as scl
left join
(SELECT block_id,Count(DISTINCT hc_student_attendance_school.cluster_id) AS clusters_in_block FROM   hc_student_attendance_school group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT hc_student_attendance_school.cluster_id) AS clusters_in_district FROM   hc_student_attendance_school group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.cluster_id=a.cluster_id
group by attendance
,usc.cluster_id,a.total_clusters,a.block_id,a.district_id) as c
ON b.cluster_id = c.cluster_id)as student_attendance
on basic.cluster_id=student_attendance.cluster_id
left join 
(select b.*,c.cluster_level_rank_within_the_state,
c.cluster_level_rank_within_the_district,c.cluster_level_rank_within_the_block from hc_semester_performance_cluster as b
left join(select usc.cluster_id,Performance,
       ( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.Performance DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_block) ) AS cluster_level_rank_within_the_block,
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.Performance DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_district) ) AS cluster_level_rank_within_the_district, 
( ( Rank()
             over (
               ORDER BY usc.Performance DESC)
           || ' out of ' :: text )
         ||  a.total_clusters) AS cluster_level_rank_within_the_state                         
 from hc_semester_performance_cluster as usc
left join
(select a.*,(select count(DISTINCT(cluster_id)) from hc_semester_performance_school)as total_clusters
from (select distinct(scl.cluster_id),clusters_in_block,b.block_id,clusters_in_district,d.district_id from hc_semester_performance_school as scl
left join
(SELECT block_id,Count(DISTINCT hc_semester_performance_school.cluster_id) AS clusters_in_block FROM   hc_semester_performance_school group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT hc_semester_performance_school.cluster_id) AS clusters_in_district FROM   hc_semester_performance_school group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.cluster_id=a.cluster_id
group by Performance
,usc.cluster_id,a.total_clusters,a.block_id,a.district_id) as c
ON b.cluster_id = c.cluster_id)as semester
on basic.cluster_id=semester.cluster_id
left join 
(select b.*,c.cluster_level_rank_within_the_state,
c.cluster_level_rank_within_the_district,c.cluster_level_rank_within_the_block from hc_udise_cluster as b
left join(select usc.cluster_id,infrastructure_score,
       ( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.infrastructure_score DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_block) ) AS cluster_level_rank_within_the_block,
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.infrastructure_score DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_district) ) AS cluster_level_rank_within_the_district, 
( ( Rank()
             over (
               ORDER BY usc.infrastructure_score DESC)
           || ' out of ' :: text )
         ||  a.total_clusters) AS cluster_level_rank_within_the_state                         
 from hc_udise_cluster as usc
left join
(select a.*,(select count(DISTINCT(cluster_id)) from udise_school_metrics_agg)as total_clusters
from (select distinct(scl.cluster_id),clusters_in_block,b.block_id,clusters_in_district,d.district_id from udise_school_metrics_agg as scl
left join
(SELECT block_id,Count(DISTINCT udise_school_metrics_agg.cluster_id) AS clusters_in_block FROM   udise_school_metrics_agg group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT udise_school_metrics_agg.cluster_id) AS clusters_in_district FROM   udise_school_metrics_agg group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.cluster_id=a.cluster_id
group by infrastructure_score
,usc.cluster_id,a.total_clusters,a.block_id,a.district_id) as c
ON b.cluster_id = c.cluster_id)as udise
on basic.cluster_id=udise.cluster_id
left join 
(select b.*,c.cluster_level_rank_within_the_state,
c.cluster_level_rank_within_the_district,c.cluster_level_rank_within_the_block from (select ped.*,pes.value_below_33,pes.value_between_33_60,pes.value_between_60_75,pes.value_above_75 from 
(Select district_id,district_name,block_id,block_name,cluster_id,cluster_name,grade_wise_performance,cluster_performance
 from periodic_exam_cluster_all 
where academic_year=(select max(academic_year) from periodic_exam_cluster_all))as ped left join
(select cluster_id,
 sum(case when school_performance <=33 then 1 else 0 end)as value_below_33,
 sum(case when school_performance > 33 and school_performance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when school_performance > 60 and school_performance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when school_performance >75 then 1 else 0 end)as value_above_75
   from periodic_exam_school_all where academic_year=(select max(academic_year) from periodic_exam_cluster_all) group by cluster_id)as pes
on ped.cluster_id= pes.cluster_id) as b
left join(select usc.cluster_id,cluster_performance,
       ( ( Rank()
             over (
               PARTITION BY a.block_id
               ORDER BY usc.cluster_performance DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_block) ) AS cluster_level_rank_within_the_block,
( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.cluster_performance DESC)
           || ' out of ' :: text )
         || sum(a.clusters_in_district) ) AS cluster_level_rank_within_the_district, 
( ( Rank()
             over (
               ORDER BY usc.cluster_performance DESC)
           || ' out of ' :: text )
         ||  a.total_clusters) AS cluster_level_rank_within_the_state                         
 from (select ped.*,pes.value_below_33,pes.value_between_33_60,pes.value_between_60_75,pes.value_above_75 from 
(Select district_id,district_name,block_id,block_name,cluster_id,cluster_name,grade_wise_performance,cluster_performance
 from periodic_exam_cluster_all 
where academic_year=(select max(academic_year) from periodic_exam_cluster_all))as ped left join
(select cluster_id,
 sum(case when school_performance <=33 then 1 else 0 end)as value_below_33,
 sum(case when school_performance > 33 and school_performance<= 60 then 1 else 0 end)as value_between_33_60,
 sum(case when school_performance > 60 and school_performance<= 75 then 1 else 0 end)as value_between_60_75,
 sum(case when school_performance >75 then 1 else 0 end)as value_above_75
   from periodic_exam_school_all where academic_year=(select max(academic_year) from periodic_exam_cluster_all) group by cluster_id)as pes
on ped.cluster_id= pes.cluster_id) as usc
left join
(select a.*,(select count(DISTINCT(cluster_id)) from periodic_exam_school_all)as total_clusters
from (select distinct(scl.cluster_id),clusters_in_block,b.block_id,clusters_in_district,d.district_id from periodic_exam_school_all as scl
left join
(SELECT block_id,Count(DISTINCT periodic_exam_school_all.cluster_id) AS clusters_in_block FROM   periodic_exam_school_all group by block_id)as b
on scl.block_id=b.block_id
left join 
(SELECT district_id,Count(DISTINCT periodic_exam_school_all.cluster_id) AS clusters_in_district FROM   periodic_exam_school_all group by district_id) as d
on scl.district_id=d.district_id)as a)as a
on usc.cluster_id=a.cluster_id
group by cluster_performance
,usc.cluster_id,a.total_clusters,a.block_id,a.district_id) as c
ON b.cluster_id = c.cluster_id)as pat
on basic.cluster_id=pat.cluster_id
left join 
hc_crc_cluster as crc
on basic.cluster_id=crc.cluster_id
left join
hc_infra_cluster as infra
on basic.cluster_id=infra.cluster_id;


/*Health card index block*/

create or replace view health_card_index_block as 
select basic.*,row_to_json(student_attendance.*) as student_attendance,row_to_json(semester.*) as student_semester,row_to_json(udise.*) as udise,
row_to_json(pat.*) as PAT_performance,row_to_json(crc.*) as CRC_visit,row_to_json(infra.*) as school_infrastructure
 from 
(select shd.district_id,initcap(shd.district_name)as district_name,shd.block_id,initcap(shd.block_name)as block_name,count(distinct(usmt.udise_school_id)) as total_schools,sum(usmt.total_students)as total_students from
(select udise_school_id,sum(no_of_students) as total_students from udise_school_metrics_trans group by udise_school_id)as usmt right join school_hierarchy_details as shd
on usmt.udise_school_id=shd.school_id where cluster_name is not null and school_name is not null and block_name is not null and district_name is not null
group by shd.district_id,shd.district_name,shd.block_id,shd.block_name)as basic
left join 
(select b.*,c.block_level_rank_within_the_state,
c.block_level_rank_within_the_district from (select sad.*,sac.value_below_33,sac.value_between_33_60,sac.value_between_60_75,sac.value_above_75
 from hc_student_attendance_block as sad left join
(select block_id,
 sum(case when attendance <=33 then 1 else 0 end)as value_below_33,
 sum(case when attendance > 33 and attendance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when attendance > 60 and attendance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when attendance > 75 then 1 else 0 end)as value_above_75
   from hc_student_attendance_school where month=(select max(month) from hc_student_attendance_block) group by block_id)as sac
on sad.block_id= sac.block_id
where month=(select max(month) from hc_student_attendance_block)) as b
left join(select usc.block_id,attendance,
       ( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.attendance DESC)
           || ' out of ' :: text )
         || sum(a.blocks_in_district) ) AS block_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.attendance DESC)
           || ' out of ' :: text )
         ||  a.total_blocks) AS block_level_rank_within_the_state                         
 from (select sad.*,sac.value_below_33,sac.value_between_33_60,sac.value_between_60_75,sac.value_above_75
 from hc_student_attendance_block as sad left join
(select block_id,
 sum(case when attendance <=33 then 1 else 0 end)as value_below_33,
 sum(case when attendance > 33 and attendance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when attendance > 60 and attendance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when attendance > 75 then 1 else 0 end)as value_above_75
   from hc_student_attendance_school where month=(select max(month) from hc_student_attendance_block) group by block_id)as sac
on sad.block_id= sac.block_id
where month=(select max(month) from hc_student_attendance_block)) as usc
left join
(select a.*,(select count(DISTINCT(block_id)) from hc_student_attendance_school)as total_blocks
from (select distinct(scl.block_id),blocks_in_district,d.district_id from hc_student_attendance_school as scl
left join
(SELECT district_id,Count(DISTINCT hc_student_attendance_school.block_id) AS blocks_in_district FROM   hc_student_attendance_school group by district_id)as d
on scl.district_id=d.district_id)as a)as a
on usc.block_id=a.block_id
group by attendance
,usc.block_id,a.total_blocks,a.district_id) as c
ON b.block_id = c.block_id )as student_attendance
on basic.block_id=student_attendance.block_id
left join 
(select b.*,c.block_level_rank_within_the_state,
c.block_level_rank_within_the_district from hc_semester_performance_block as b
left join(select usc.block_id,Performance,
       ( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.Performance DESC)
           || ' out of ' :: text )
         || sum(a.blocks_in_district) ) AS block_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.Performance DESC)
           || ' out of ' :: text )
         ||  a.total_blocks) AS block_level_rank_within_the_state                         
 from hc_semester_performance_block as usc
left join
(select a.*,(select count(DISTINCT(block_id)) from hc_semester_performance_school)as total_blocks
from (select distinct(scl.block_id),blocks_in_district,d.district_id from hc_semester_performance_school as scl
left join
(SELECT district_id,Count(DISTINCT hc_semester_performance_school.block_id) AS blocks_in_district FROM   hc_semester_performance_school group by district_id)as d
on scl.district_id=d.district_id)as a)as a
on usc.block_id=a.block_id
group by Performance
,usc.block_id,a.total_blocks,a.district_id) as c
ON b.block_id = c.block_id)as semester
on basic.block_id=semester.block_id
left join 
(select b.*,c.block_level_rank_within_the_state,
c.block_level_rank_within_the_district from hc_udise_block as b
left join(select usc.block_id,infrastructure_score,
       ( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.infrastructure_score DESC)
           || ' out of ' :: text )
         || sum(a.blocks_in_district) ) AS block_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.infrastructure_score DESC)
           || ' out of ' :: text )
         ||  a.total_blocks) AS block_level_rank_within_the_state                         
 from hc_udise_block as usc
left join
(select a.*,(select count(DISTINCT(block_id)) from udise_school_metrics_agg)as total_blocks
from (select distinct(scl.block_id),blocks_in_district,d.district_id from udise_school_metrics_agg as scl
left join
(SELECT district_id,Count(DISTINCT udise_school_metrics_agg.block_id) AS blocks_in_district FROM   udise_school_metrics_agg group by district_id)as d
on scl.district_id=d.district_id)as a)as a
on usc.block_id=a.block_id
group by infrastructure_score
,usc.block_id,a.total_blocks,a.district_id) as c
ON b.block_id = c.block_id)as udise
on basic.block_id=udise.block_id
left join 
(select b.*,c.block_level_rank_within_the_state,
c.block_level_rank_within_the_district from (select ped.*,pes.value_below_33,pes.value_between_33_60,pes.value_between_60_75,pes.value_above_75 from 
(Select district_id,district_name,block_id,block_name,grade_wise_performance,block_performance
 from periodic_exam_block_all 
where academic_year=(select max(academic_year) from periodic_exam_block_all))as ped left join
(select block_id,
 sum(case when school_performance <=33 then 1 else 0 end)as value_below_33,
 sum(case when school_performance > 33 and school_performance<= 60 then 1 else 0 end)as value_between_33_60,
 sum(case when school_performance > 60 and school_performance<= 75 then 1 else 0 end)as value_between_60_75,
 sum(case when school_performance >75 then 1 else 0 end)as value_above_75
   from periodic_exam_school_all where academic_year=(select max(academic_year) from periodic_exam_block_all) group by block_id)as pes
on ped.block_id= pes.block_id) as b
left join(select usc.block_id,block_performance,
       ( ( Rank()
             over (
               PARTITION BY a.district_id
               ORDER BY usc.block_performance DESC)
           || ' out of ' :: text )
         || sum(a.blocks_in_district) ) AS block_level_rank_within_the_district,
( ( Rank()
             over (
               ORDER BY usc.block_performance DESC)
           || ' out of ' :: text )
         ||  a.total_blocks) AS block_level_rank_within_the_state                         
 from (select ped.*,pes.value_below_33,pes.value_between_33_60,pes.value_between_60_75,pes.value_above_75 from 
(Select district_id,district_name,block_id,block_name,grade_wise_performance,block_performance
 from periodic_exam_block_all 
where academic_year=(select max(academic_year) from periodic_exam_block_all))as ped left join
(select block_id,
 sum(case when school_performance <=33 then 1 else 0 end)as value_below_33,
 sum(case when school_performance > 33 and school_performance<= 60 then 1 else 0 end)as value_between_33_60,
 sum(case when school_performance > 60 and school_performance<= 75 then 1 else 0 end)as value_between_60_75,
 sum(case when school_performance >75 then 1 else 0 end)as value_above_75
   from periodic_exam_school_all where academic_year=(select max(academic_year) from periodic_exam_block_all) group by block_id)as pes
on ped.block_id= pes.block_id) as usc
left join
(select a.*,(select count(DISTINCT(block_id)) from periodic_exam_school_all)as total_blocks
from (select distinct(scl.block_id),blocks_in_district,d.district_id from periodic_exam_school_all as scl
left join
(SELECT district_id,Count(DISTINCT periodic_exam_school_all.block_id) AS blocks_in_district FROM   periodic_exam_school_all group by district_id)as d
on scl.district_id=d.district_id)as a)as a
on usc.block_id=a.block_id
group by block_performance
,usc.block_id,a.total_blocks,a.district_id) as c
ON b.block_id = c.block_id)as pat
on basic.block_id=pat.block_id
left join 
hc_crc_block as crc
on basic.block_id=crc.block_id
left join
hc_infra_block as infra
on basic.block_id=infra.block_id;

/*Health card index District*/

create or replace view health_card_index_district as 
select basic.*,row_to_json(student_attendance.*) as student_attendance,row_to_json(semester.*) as student_semester,row_to_json(udise.*) as udise,
row_to_json(pat.*) as PAT_performance,row_to_json(crc.*) as CRC_visit,row_to_json(infra.*) as school_infrastructure
 from 
(select shd.district_id,initcap(shd.district_name)as district_name,count(distinct(usmt.udise_school_id)) as total_schools,sum(usmt.total_students)as total_students from
(select udise_school_id,sum(no_of_students) as total_students from udise_school_metrics_trans group by udise_school_id)as usmt right join school_hierarchy_details as shd
on usmt.udise_school_id=shd.school_id where cluster_name is not null and school_name is not null and block_name is not null and district_name is not null
group by shd.district_id,shd.district_name)as basic
left join 
(select sad.*,sac.value_below_33,sac.value_between_33_60,sac.value_between_60_75,sac.value_above_75,((rank () over ( order by attendance desc))||' out of '||(select count(distinct(district_id)) 
from hc_semester_performance_district)) as district_level_rank_within_the_state
 from hc_student_attendance_district as sad left join
(select district_id,
 sum(case when attendance <=33 then 1 else 0 end)as value_below_33,
 sum(case when attendance > 33 and attendance<=60 then 1 else 0 end)as value_between_33_60,
 sum(case when attendance > 60 and attendance<=75 then 1 else 0 end)as value_between_60_75,
 sum(case when attendance > 75 then 1 else 0 end)as value_above_75
   from hc_student_attendance_school where month=(select max(month) from hc_student_attendance_district) group by district_id)as sac
on sad.district_id= sac.district_id
where month=(select max(month) from hc_student_attendance_district))as student_attendance
on basic.district_id=student_attendance.district_id
left join 
(select *,((rank () over ( order by Performance desc))||' out of '||(select count(distinct(district_id)) 
from hc_semester_performance_district)) as district_level_rank_within_the_state from hc_semester_performance_district)as semester
on basic.district_id=semester.district_id
left join 
(select uds.*,usc.value_below_33,usc.value_between_33_60,usc.value_between_60_75,usc.value_above_75 from udise_district_score as uds left join 
(select district_id,
 sum(case when Infrastructure_score <=33 then 1 else 0 end)as value_below_33,
 sum(case when Infrastructure_score > 33 and infrastructure_score<= 60 then 1 else 0 end)as value_between_33_60,
 sum(case when Infrastructure_score > 60 and infrastructure_score<= 75 then 1 else 0 end)as value_between_60_75,
 sum(case when Infrastructure_score >75 then 1 else 0 end)as value_above_75
   from udise_school_score group by district_id)as usc
on uds.district_id= usc.district_id)as udise
on basic.district_id=udise.district_id
left join 
(select ped.*,pes.value_below_33,pes.value_between_33_60,pes.value_between_60_75,pes.value_above_75 from 
(Select district_id,district_name,grade_wise_performance,district_performance,
  ((rank () over ( order by district_performance desc))||' out of '||(select count(distinct(district_id)) 
from periodic_exam_district_all)) as district_level_rank_within_the_state
 from periodic_exam_district_all 
where academic_year=(select max(academic_year) from periodic_exam_district_all))as ped left join
(select district_id,
 sum(case when school_performance <=33 then 1 else 0 end)as value_below_33,
 sum(case when school_performance > 33 and school_performance<= 60 then 1 else 0 end)as value_between_33_60,
 sum(case when school_performance > 60 and school_performance<= 75 then 1 else 0 end)as value_between_60_75,
 sum(case when school_performance >75 then 1 else 0 end)as value_above_75
   from periodic_exam_school_all where academic_year=(select max(academic_year) from periodic_exam_district_all) group by district_id)as pes
on ped.district_id= pes.district_id)as pat
on basic.district_id=pat.district_id
left join 
hc_crc_district as crc
on basic.district_id=crc.district_id
left join
hc_infra_district as infra
on basic.district_id=infra.district_id;

