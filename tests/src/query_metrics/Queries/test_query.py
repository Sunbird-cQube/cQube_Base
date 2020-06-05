class TestQuery():
    district_wise_8 = """select count(distinct(d.student_id)) as students_count, 
                        count(distinct(d.school_id)) as total_schools,
                        initcap(shd.district_name) as district_name 
                        from 
                        student_attendance_trans as d, 
                        school_hierarchy_details as shd
                        where 
                        d.school_id = shd.school_id  
                        AND shd.school_name IS NOT NULL        
                        AND shd.district_name IS NOT NULL 
                        AND shd.block_name IS NOT NULL         
                        AND shd.cluster_name IS NOT NULL                
                        and d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.month = 8
                        group by shd.district_name order by 3 """

    district_wise_9 = """select count(distinct(d.student_id)) as students_count, 
                        count(distinct(d.school_id)) as total_schools,
                        initcap(shd.district_name) as district_name 
                        from 
                        student_attendance_trans as d, 
                        school_hierarchy_details as shd
                        where 
                        d.school_id = shd.school_id  
                        AND shd.school_name IS NOT NULL        
                        AND shd.district_name IS NOT NULL 
                        AND shd.block_name IS NOT NULL         
                        AND shd.cluster_name IS NOT NULL                
                        and d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.month = 9
                        group by shd.district_name order by 3 """

    district_wise_10 = """select count(distinct(d.student_id)) as students_count, 
                    count(distinct(d.school_id)) as total_schools,
                    initcap(shd.district_name) as district_name 
                    from 
                    student_attendance_trans as d, 
                    school_hierarchy_details as shd
                    where 
                    d.school_id = shd.school_id  
                    AND shd.school_name IS NOT NULL        
                    AND shd.district_name IS NOT NULL 
                    AND shd.block_name IS NOT NULL         
                    AND shd.cluster_name IS NOT NULL                
                    and d.school_id in 
                    (select school_id from school_geo_master sgm where	  	
                                sgm.school_latitude > 0 
                            AND sgm.school_longitude > 0 
                            AND sgm.district_latitude > 0 
                            AND sgm.district_longitude > 0
                        AND sgm.block_latitude > 0 
                        AND sgm.block_longitude > 0        
                            AND sgm.cluster_latitude > 0 
                            AND sgm.cluster_longitude > 0)
                    and d.month = 10
                    group by shd.district_name order by 3 """
    block_wise_8 = """select count(distinct(d.student_id)) as students_count,
    		            count(distinct(d.school_id)) as total_schools,
                        initcap(shd.block_name) as block_name
                        from 
                        student_attendance_trans as d, 
                        school_hierarchy_details as shd
                        where 
                        d.school_id = shd.school_id  
                        AND shd.school_name IS NOT NULL        
                        AND shd.district_name IS NOT NULL 
                        AND shd.block_name IS NOT NULL         
                        AND shd.cluster_name IS NOT NULL                
                        and d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.month = 8
                        group by shd.block_name """
    block_wise_9 = """select count(distinct(d.student_id)) as students_count,
    		            count(distinct(d.school_id)) as total_schools,
                        initcap(shd.block_name) as block_name
                        from 
                        student_attendance_trans as d, 
                        school_hierarchy_details as shd
                        where 
                        d.school_id = shd.school_id  
                        AND shd.school_name IS NOT NULL        
                        AND shd.district_name IS NOT NULL 
                        AND shd.block_name IS NOT NULL         
                        AND shd.cluster_name IS NOT NULL                
                        and d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.month = 9
                        group by shd.block_name """

    block_wise_10 = """select count(distinct(d.student_id)) as students_count,
		            count(distinct(d.school_id)) as total_schools,
                    initcap(shd.block_name) as block_name
                    from 
                    student_attendance_trans as d, 
                    school_hierarchy_details as shd
                    where 
                    d.school_id = shd.school_id  
                    AND shd.school_name IS NOT NULL        
                    AND shd.district_name IS NOT NULL 
                    AND shd.block_name IS NOT NULL         
                    AND shd.cluster_name IS NOT NULL                
                    and d.school_id in 
                    (select school_id from school_geo_master sgm where	  	
                                sgm.school_latitude > 0 
                            AND sgm.school_longitude > 0 
                            AND sgm.district_latitude > 0 
                            AND sgm.district_longitude > 0
                        AND sgm.block_latitude > 0 
                        AND sgm.block_longitude > 0        
                            AND sgm.cluster_latitude > 0 
                            AND sgm.cluster_longitude > 0)
                    and d.month = 10
                    group by shd.block_name """
    cluster_wise_8 = """select count(distinct(d.student_id)) as students_count,
                          count(distinct(d.school_id)) as total_schools,
                            initcap(shd.cluster_name) as cluster_name 
                            from 
                            student_attendance_trans as d, 
                            school_hierarchy_details as shd
                            where 
                            d.school_id = shd.school_id  
                            AND shd.school_name IS NOT NULL        
                            AND shd.district_name IS NOT NULL 
                            AND shd.block_name IS NOT NULL         
                            AND shd.cluster_name IS NOT NULL                
                            and d.school_id in 
                            (select school_id from school_geo_master sgm where	  	
                                        sgm.school_latitude > 0 
                                    AND sgm.school_longitude > 0 
                                    AND sgm.district_latitude > 0 
                                    AND sgm.district_longitude > 0
                                AND sgm.block_latitude > 0 
                                AND sgm.block_longitude > 0        
                                    AND sgm.cluster_latitude > 0 
                                    AND sgm.cluster_longitude > 0)
                            and d.month = 8
                            group by shd.cluster_name order by 3"""
    cluster_wise_9 = """select count(distinct(d.student_id)) as students_count,
                          count(distinct(d.school_id)) as total_schools,
                            initcap(shd.cluster_name) as cluster_name 
                            from 
                            student_attendance_trans as d, 
                            school_hierarchy_details as shd
                            where 
                            d.school_id = shd.school_id  
                            AND shd.school_name IS NOT NULL        
                            AND shd.district_name IS NOT NULL 
                            AND shd.block_name IS NOT NULL         
                            AND shd.cluster_name IS NOT NULL                
                            and d.school_id in 
                            (select school_id from school_geo_master sgm where	  	
                                        sgm.school_latitude > 0 
                                    AND sgm.school_longitude > 0 
                                    AND sgm.district_latitude > 0 
                                    AND sgm.district_longitude > 0
                                AND sgm.block_latitude > 0 
                                AND sgm.block_longitude > 0        
                                    AND sgm.cluster_latitude > 0 
                                    AND sgm.cluster_longitude > 0)
                            and d.month = 9
                            group by shd.cluster_name order by 3"""

    cluster_wise_10 = """select count(distinct(d.student_id)) as students_count,
                      count(distinct(d.school_id)) as total_schools,
                        initcap(shd.cluster_name) as cluster_name 
                        from 
                        student_attendance_trans as d, 
                        school_hierarchy_details as shd
                        where 
                        d.school_id = shd.school_id  
                        AND shd.school_name IS NOT NULL        
                        AND shd.district_name IS NOT NULL 
                        AND shd.block_name IS NOT NULL         
                        AND shd.cluster_name IS NOT NULL                
                        and d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.month = 10
                        group by shd.cluster_name order by 3"""
    school_wise_8 = """select count(distinct(d.student_id)) as students_count, 
                        count(distinct(d.school_id)) as total_schools,
                        initcap(shd.cluster_name) as cluster_name 
                        from 
                        student_attendance_trans as d, 
                        school_hierarchy_details as shd
                        where 
                        d.school_id = shd.school_id  
                        AND shd.school_name IS NOT NULL        
                        AND shd.district_name IS NOT NULL 
                        AND shd.block_name IS NOT NULL         
                        AND shd.cluster_name IS NOT NULL                
                        and d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.month = 8
                        group by shd.cluster_name order by 3"""
    school_wise_9 = """select count(distinct(d.student_id)) as students_count, 
                        count(distinct(d.school_id)) as total_schools,
                        initcap(shd.cluster_name) as cluster_name 
                        from 
                        student_attendance_trans as d, 
                        school_hierarchy_details as shd
                        where 
                        d.school_id = shd.school_id  
                        AND shd.school_name IS NOT NULL        
                        AND shd.district_name IS NOT NULL 
                        AND shd.block_name IS NOT NULL         
                        AND shd.cluster_name IS NOT NULL                
                        and d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.month = 9
                        group by shd.cluster_name order by 3"""

    school_wise_10 ="""select count(distinct(d.student_id)) as students_count, 
                    count(distinct(d.school_id)) as total_schools,
                    initcap(shd.cluster_name) as cluster_name 
                    from 
                    student_attendance_trans as d, 
                    school_hierarchy_details as shd
                    where 
                    d.school_id = shd.school_id  
                    AND shd.school_name IS NOT NULL        
                    AND shd.district_name IS NOT NULL 
                    AND shd.block_name IS NOT NULL         
                    AND shd.cluster_name IS NOT NULL                
                    and d.school_id in 
                    (select school_id from school_geo_master sgm where	  	
                                sgm.school_latitude > 0 
                            AND sgm.school_longitude > 0 
                            AND sgm.district_latitude > 0 
                            AND sgm.district_longitude > 0
                        AND sgm.block_latitude > 0 
                        AND sgm.block_longitude > 0        
                            AND sgm.cluster_latitude > 0 
                            AND sgm.cluster_longitude > 0)
                    and d.month = 10
                    group by shd.cluster_name order by 3"""
    district_wise_attendance_percentage_10 = """select initcap(hr.district_name) as district_name,
                            count.year,count.month, 
                            round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) as x_value 
                            from 
                            school_hierarchy_details as hr 
                            left join
                            (select  
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
                            case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                            from student_attendance_trans as d 
                            where d.school_id in 
                            (select school_id from school_geo_master sgm where	  	
                                        sgm.school_latitude > 0 
                                    AND sgm.school_longitude > 0 
                                    AND sgm.district_latitude > 0 
                                    AND sgm.district_longitude > 0
                                AND sgm.block_latitude > 0 
                                AND sgm.block_longitude > 0        
                                    AND sgm.cluster_latitude > 0 
                                    AND sgm.cluster_longitude > 0)
                            and d.school_id in (select school_id from school_hierarchy_details where 
                             school_name IS NOT NULL        
                            AND district_name IS NOT NULL 
                            AND block_name IS NOT NULL         
                            AND cluster_name IS NOT NULL   
                            )
                             group by school_id,year,month) as count 
                            on hr.school_id = count.school_id 
                            where count.month = 10 group by hr.district_name, count.year, count.month"""
    district_wise_attendance_percentage_8 = """select initcap(hr.district_name) as district_name,
                            count.year,count.month, 
                            round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) as x_value 
                            from 
                            school_hierarchy_details as hr 
                            left join
                            (select  
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
                            case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                            from student_attendance_trans as d 
                            where d.school_id in 
                            (select school_id from school_geo_master sgm where	  	
                                        sgm.school_latitude > 0 
                                    AND sgm.school_longitude > 0 
                                    AND sgm.district_latitude > 0 
                                    AND sgm.district_longitude > 0
                                AND sgm.block_latitude > 0 
                                AND sgm.block_longitude > 0        
                                    AND sgm.cluster_latitude > 0 
                                    AND sgm.cluster_longitude > 0)
                            and d.school_id in (select school_id from school_hierarchy_details where 
                             school_name IS NOT NULL        
                            AND district_name IS NOT NULL 
                            AND block_name IS NOT NULL         
                            AND cluster_name IS NOT NULL   
                            )
                             group by school_id,year,month) as count 
                            on hr.school_id = count.school_id 
                            where count.month = 8 group by hr.district_name, count.year, count.month"""

    district_wise_attendance_percentage_9 ="""select initcap(hr.district_name) as district_name,
                        count.year,count.month, 
                        round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) as x_value 
                        from 
                        school_hierarchy_details as hr 
                        left join
                        (select  
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
                        case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                        from student_attendance_trans as d 
                        where d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.school_id in (select school_id from school_hierarchy_details where 
                         school_name IS NOT NULL        
                        AND district_name IS NOT NULL 
                        AND block_name IS NOT NULL         
                        AND cluster_name IS NOT NULL   
                        )
                         group by school_id,year,month) as count 
                        on hr.school_id = count.school_id 
                        where count.month = 9 group by hr.district_name, count.year, count.month"""
    block_wise_attendance_percentage_8 = """select initcap(hr.block_name) as block_name,count.year,count.month, round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) 
                            as x_value 
                            from 
                            school_hierarchy_details as hr 
                            left join
                            (select  
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
                            case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                            from student_attendance_trans as d 
                            where d.school_id in 
                            (select school_id from school_geo_master sgm where	  	
                                        sgm.school_latitude > 0 
                                    AND sgm.school_longitude > 0 
                                    AND sgm.district_latitude > 0 
                                    AND sgm.district_longitude > 0
                                AND sgm.block_latitude > 0 
                                AND sgm.block_longitude > 0        
                                    AND sgm.cluster_latitude > 0 
                                    AND sgm.cluster_longitude > 0)
                            and d.school_id in (select school_id from school_hierarchy_details where 
                             school_name IS NOT NULL        
                            AND district_name IS NOT NULL 
                            AND block_name IS NOT NULL         
                            AND cluster_name IS NOT NULL   
                            )
                             group by school_id,year,month) as count 
                            on hr.school_id = count.school_id 
                            where count.month = 8 group by hr.block_name, count.year, count.month"""
    block_wise_attendance_percentage_9 = """select initcap(hr.block_name) as block_name,count.year,count.month, round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) 
                            as x_value 
                            from 
                            school_hierarchy_details as hr 
                            left join
                            (select  
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
                            case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                            from student_attendance_trans as d 
                            where d.school_id in 
                            (select school_id from school_geo_master sgm where	  	
                                        sgm.school_latitude > 0 
                                    AND sgm.school_longitude > 0 
                                    AND sgm.district_latitude > 0 
                                    AND sgm.district_longitude > 0
                                AND sgm.block_latitude > 0 
                                AND sgm.block_longitude > 0        
                                    AND sgm.cluster_latitude > 0 
                                    AND sgm.cluster_longitude > 0)
                            and d.school_id in (select school_id from school_hierarchy_details where 
                             school_name IS NOT NULL        
                            AND district_name IS NOT NULL 
                            AND block_name IS NOT NULL         
                            AND cluster_name IS NOT NULL   
                            )
                             group by school_id,year,month) as count 
                            on hr.school_id = count.school_id 
                            where count.month = 9 group by hr.block_name, count.year, count.month"""

    block_wise_attendance_percentage_10 = """select initcap(hr.block_name) as block_name,count.year,count.month, round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) 
                        as x_value 
                        from 
                        school_hierarchy_details as hr 
                        left join
                        (select  
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
                        case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                        from student_attendance_trans as d 
                        where d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.school_id in (select school_id from school_hierarchy_details where 
                         school_name IS NOT NULL        
                        AND district_name IS NOT NULL 
                        AND block_name IS NOT NULL         
                        AND cluster_name IS NOT NULL   
                        )
                         group by school_id,year,month) as count 
                        on hr.school_id = count.school_id 
                        where count.month = 10 group by hr.block_name, count.year, count.month"""
    cluster_wise_attendance_percentage_8 = """select initcap(hr.cluster_name)as cluster_name,count.year,count.month, round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) 
                            as x_value 
                            from 
                            school_hierarchy_details as hr 
                            left join
                            (select  
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
                            case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                            from student_attendance_trans as d 
                            where d.school_id in 
                            (select school_id from school_geo_master sgm where	  	
                                        sgm.school_latitude > 0 
                                    AND sgm.school_longitude > 0 
                                    AND sgm.district_latitude > 0 
                                    AND sgm.district_longitude > 0
                                AND sgm.block_latitude > 0 
                                AND sgm.block_longitude > 0        
                                    AND sgm.cluster_latitude > 0 
                                    AND sgm.cluster_longitude > 0)
                            and d.school_id in (select school_id from school_hierarchy_details where 
                             school_name IS NOT NULL        
                            AND district_name IS NOT NULL 
                            AND block_name IS NOT NULL         
                            AND cluster_name IS NOT NULL   
                            )
                             group by school_id,year,month) as count 
                            on hr.school_id = count.school_id 
                            where count.month = 8 group by hr.cluster_name, count.year, count.month"""
    cluster_wise_attendance_percentage_9 = """select initcap(hr.cluster_name)as cluster_name,count.year,count.month, round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) 
                            as x_value 
                            from 
                            school_hierarchy_details as hr 
                            left join
                            (select  
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
                            case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                            from student_attendance_trans as d 
                            where d.school_id in 
                            (select school_id from school_geo_master sgm where	  	
                                        sgm.school_latitude > 0 
                                    AND sgm.school_longitude > 0 
                                    AND sgm.district_latitude > 0 
                                    AND sgm.district_longitude > 0
                                AND sgm.block_latitude > 0 
                                AND sgm.block_longitude > 0        
                                    AND sgm.cluster_latitude > 0 
                                    AND sgm.cluster_longitude > 0)
                            and d.school_id in (select school_id from school_hierarchy_details where 
                             school_name IS NOT NULL        
                            AND district_name IS NOT NULL 
                            AND block_name IS NOT NULL         
                            AND cluster_name IS NOT NULL   
                            )
                             group by school_id,year,month) as count 
                            on hr.school_id = count.school_id 
                            where count.month = 9 group by hr.cluster_name, count.year, count.month"""

    cluster_wise_attendance_percentage_10="""select initcap(hr.cluster_name)as cluster_name,count.year,count.month, round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) 
                        as x_value 
                        from 
                        school_hierarchy_details as hr 
                        left join
                        (select  
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
                        case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                        from student_attendance_trans as d 
                        where d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.school_id in (select school_id from school_hierarchy_details where 
                         school_name IS NOT NULL        
                        AND district_name IS NOT NULL 
                        AND block_name IS NOT NULL         
                        AND cluster_name IS NOT NULL   
                        )
                         group by school_id,year,month) as count 
                        on hr.school_id = count.school_id 
                        where count.month = 10 group by hr.cluster_name, count.year, count.month"""
    school_wise_attendance_percentage_8 = """select initcap(hr.school_name) as school_name,count.year,count.month, round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) 
                        as x_value 
                        from 
                        school_hierarchy_details as hr 
                        left join
                        (select  
                        NULLIF(sum(cast((case when day_1=1 then 1 else 0 end + case when day_2=1 then 1 else 0 end +
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
                        case when day_31=1 then 1 else 0 end) as float)),0) as present_sum,
                        NULLIF(sum(cast((case when day_1=2 or day_1=1 then 1 else 0 end +
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
                        case when day_31=2 or day_31=1 then 1 else 0 end )  as float)),0) as working_days,school_id,year,month
                        from student_attendance_trans as d 
                        where d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.school_id in (select school_id from school_hierarchy_details where 
                         school_name IS NOT NULL        
                        AND district_name IS NOT NULL 
                        AND block_name IS NOT NULL         
                        AND cluster_name IS NOT NULL   
                        )
                         group by school_id,year,month) as count 
                        on hr.school_id = count.school_id 
                        where count.month = 8 group by hr.school_name, count.year, count.month"""

    school_wise_attendance_percentage_9 = """select initcap(hr.school_name) as school_name,count.year,count.month, round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) 
                        as x_value 
                        from 
                        school_hierarchy_details as hr 
                        left join
                        (select  
                        NULLIF(sum(cast((case when day_1=1 then 1 else 0 end + case when day_2=1 then 1 else 0 end +
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
                        case when day_31=1 then 1 else 0 end) as float)),0) as present_sum,
                        NULLIF(sum(cast((case when day_1=2 or day_1=1 then 1 else 0 end +
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
                        case when day_31=2 or day_31=1 then 1 else 0 end )  as float)),0) as working_days,school_id,year,month
                        from student_attendance_trans as d 
                        where d.school_id in 
                        (select school_id from school_geo_master sgm where	  	
                                    sgm.school_latitude > 0 
                                AND sgm.school_longitude > 0 
                                AND sgm.district_latitude > 0 
                                AND sgm.district_longitude > 0
                            AND sgm.block_latitude > 0 
                            AND sgm.block_longitude > 0        
                                AND sgm.cluster_latitude > 0 
                                AND sgm.cluster_longitude > 0)
                        and d.school_id in (select school_id from school_hierarchy_details where 
                         school_name IS NOT NULL        
                        AND district_name IS NOT NULL 
                        AND block_name IS NOT NULL         
                        AND cluster_name IS NOT NULL   
                        )
                         group by school_id,year,month) as count 
                        on hr.school_id = count.school_id 
                        where count.month = 9 group by hr.school_name, count.year, count.month"""

    school_wise_attendance_percentage_10="""select initcap(hr.school_name) as school_name,count.year,count.month, round(cast(sum(present_sum)as int)*100.0/cast(sum(working_days)as int),1) 
                    as x_value 
                    from 
                    school_hierarchy_details as hr 
                    left join
                    (select  
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
                    case when day_31=2 or day_31=1 then 1 else 0 end )  as float)) as working_days,school_id,year,month
                    from student_attendance_trans as d 
                    where d.school_id in 
                    (select school_id from school_geo_master sgm where	  	
                                sgm.school_latitude > 0 
                            AND sgm.school_longitude > 0 
                            AND sgm.district_latitude > 0 
                            AND sgm.district_longitude > 0
                        AND sgm.block_latitude > 0 
                        AND sgm.block_longitude > 0        
                            AND sgm.cluster_latitude > 0 
                            AND sgm.cluster_longitude > 0)
                    and d.school_id in (select school_id from school_hierarchy_details where 
                     school_name IS NOT NULL        
                    AND district_name IS NOT NULL 
                    AND block_name IS NOT NULL         
                    AND cluster_name IS NOT NULL   
                    )
                     group by school_id,year,month) as count 
                    on hr.school_id = count.school_id 
                    where count.month = 10 group by hr.school_name, count.year, count.month"""

    district_wise_semester = """select a.x_axis,district_name,x_value,y_axis,y_value,z_axis,z_value,students_count,total_schools,a.semester, 
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
                    AND school_latitude IS NOT NULL AND school_name IS NOT NULL and school_id not in (select school_id from school_semester_no_data)
                    GROUP BY district_id,district_latitude,district_longitude,district_name,semester)as a
                    left join 
                    (select * from crosstab(
                    'select x_axis,grade,x_value from district_grade order by 1',
                    'select distinct(grade) from district_grade order by 1') as 
                    (x_axis bigint,"grade_3" numeric(4,2),"grade_4" numeric(4,2),"grade_5" numeric(4,2),"grade_6" numeric(4,2)
                    ,"grade_7" numeric(4,2),"grade_8" numeric(4,2))) b
                    on a.x_axis=b.x_axis
                    left join (select x_axis,
                     sum(case when x_value <=33 then 1 else 0 end)as value_below_33,
                     sum(case when x_value between 33 and 60 then 1 else 0 end)as value_between_33_60,
                     sum(case when x_value between 60 and 75 then 1 else 0 end)as value_between_60_75,
                     sum(case when x_value >=75 then 1 else 0 end)as value_above_75,
                     round(sum(case when x_value <=33 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_below_33,
                     round(sum(case when x_value between 33 and 60 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_between_33_60,
                     round(sum(case when x_value between 60 and 75 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_between_60_75,
                     round(sum(case when x_value >=75 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_above_75
                       from district_school group by x_axis) as c 
                       on b.x_axis=c.x_axis;"""

    block_wise_semester = """select a.x_axis,block_name,x_value,district_id,district_name,y_axis,y_value,z_axis,z_value,students_count,total_schools,a.semester, 
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
                    AND school_latitude IS NOT NULL AND school_name IS NOT NULL and school_id not in (select school_id from school_semester_no_data)
                    GROUP BY block_id,block_name,block_latitude,block_longitude,district_id,district_name,semester )as a
                    left join 
                    (select * from crosstab(
                    'select x_axis,grade,x_value from block_grade order by 1',
                    'select distinct(grade) from block_grade order by 1') as 
                    (x_axis bigint,"grade_3" numeric(4,2),"grade_4" numeric(4,2),"grade_5" numeric(4,2),"grade_6" numeric(4,2)
                    ,"grade_7" numeric(4,2),"grade_8" numeric(4,2))
                    ) as b
                    on a.x_axis=b.x_axis left join 
                    (select x_axis,sum(case when x_value <=33 then 1 else 0 end)as value_below_33,
                     sum(case when x_value between 33 and 60 then 1 else 0 end)as value_between_33_60,
                     sum(case when x_value between 60 and 75 then 1 else 0 end)as value_between_60_75,
                     sum(case when x_value >=75 then 1 else 0 end)as value_above_75,
                     round(sum(case when x_value <=33 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_below_33,
                     round(sum(case when x_value between 33 and 60 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_between_33_60,
                     round(sum(case when x_value between 60 and 75 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_between_60_75,
                     round(sum(case when x_value >=75 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_above_75
                       from block_school group by x_axis) as c
                    on b.x_axis=c.x_axis;"""

    cluster_wise_semester = """select a.x_axis,cluster_name,block_id,block_name,x_value,district_id,district_name,y_axis,y_value,z_axis,z_value,students_count,total_schools,a.semester, 
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
                    AND school_latitude IS NOT NULL AND school_name IS NOT NULL and school_id not in (select school_id from school_semester_no_data)
                    GROUP BY cluster_id,cluster_name,cluster_latitude,cluster_longitude,block_id,block_name,district_id,district_name,semester )as a
                    left join 
                    (select * from crosstab(
                    'select x_axis,grade,x_value from cluster_grade order by 1',
                    'select distinct(grade) from cluster_grade order by 1') as 
                    (x_axis bigint,"grade_3" numeric,"grade_4" numeric,"grade_5" numeric,"grade_6" numeric
                    ,"grade_7" numeric,"grade_8" numeric)
                    ) as b
                    on a.x_axis=b.x_axis
                    left join (
                    select x_axis,sum(case when x_value <=33 then 1 else 0 end)as value_below_33,
                     sum(case when x_value between 33 and 60 then 1 else 0 end)as value_between_33_60,
                     sum(case when x_value between 60 and 75 then 1 else 0 end)as value_between_60_75,
                     sum(case when x_value >=75 then 1 else 0 end)as value_above_75,
                     round(sum(case when x_value <=33 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_below_33,
                     round(sum(case when x_value between 33 and 60 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_between_33_60,
                     round(sum(case when x_value between 60 and 75 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_between_60_75,
                     round(sum(case when x_value >=75 then 1 else 0 end)*100.0/count(distinct(school_id)),2) as percent_above_75
                       from cluster_school group by x_axis)as c
                    on b.x_axis=c.x_axis"""

    school_wise_semester = """select a.x_axis,school_name,cluster_id,cluster_name,crc_name,block_id,block_name,x_value,district_id,district_name,y_axis,y_value,z_axis,z_value,
                    cast(students_count as int) as students_count,total_schools,a.semester, 
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
                    AND block_latitude <> 0 AND cluster_latitude IS NOT NULL AND cluster_latitude <> 0 AND school_latitude <>0 
                    AND school_latitude IS NOT NULL AND school_name IS NOT NULL and school_id not in (select school_id from school_semester_no_data)
                    GROUP BY school_id,school_name,crc_name,school_latitude,school_longitude,cluster_id,cluster_name,crc_name,block_id,block_name,district_id,district_name,semester )as a
                    left join 
                    (select * from crosstab(
                    'select x_axis,grade,x_value from school_grade order by 1',
                    'select distinct(grade) from school_grade order by 1') as 
                    (x_axis bigint,"grade_3" numeric,"grade_4" numeric,"grade_5" numeric,"grade_6" numeric
                    ,"grade_7" numeric,"grade_8" numeric)
                    ) as b
                    on a.x_axis=b.x_axis"""

