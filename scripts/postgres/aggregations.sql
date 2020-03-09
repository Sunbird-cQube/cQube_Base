/* Total - Gender wise */
select gender as x_axis,count(gender) as x_value,'Gender-wise' as chart_name from student_attendance group by gender

/* Total schools */
select 'null' as  x_axis,count(distinct(school_id))as x_value,'reports' as chart_name,'Total Schools' as attribute_1 from student_attendance

/* Total students */
select 'null' as x_axis,count(distinct(student_id)) as x_value,'reports' as chart_name,'Total Students' as attribute_1 from student_attendance

/* All Schools attendance */
select school_id as x_axis,count(attendance) as x_value,'Attendance all schools' as chart_name from student_attendance where attendance=1 group by school_id

/* High,low school attendance */
(select a.value as x_axis,a.school_id as x_value,'reports' as chart_name, 'Least attendance school' as attribute_1 from (select school_id,count(attendance)as value from student_attendance where attendance=1 group by school_id)as a group by a.school_id,a.value having a.value in ((select min(a.value) from (select school_id,count(attendance) as value from student_attendance where attendance=1 group by school_id)as a)))
UNION
(select a.value as x_axis,a.school_id as x_value,'reports' as chart_name,'Best attendance school' as attribute_1 from (select school_id,count(attendance)as value from student_attendance where attendance=1 group by school_id)as a group by a.school_id,a.value having a.value in ((select max(a.value) from (select school_id,count(attendance) as value from student_attendance where attendance=1 group by school_id)as a)))

/* Month-wise attendance */
select month as x_axis,count(attendance) as x_value,'Month-Wise Attendance' as chart_name from student_attendance where attendance = 1 group by month order by month

/* Schools wise monthly attendance */
select month as x_axis,count(attendance) as x_value,school_id as attribute_1,'School-Wise Monthly Attendance' as chart_name from student_attendance where attendance = 1 group by month,school_id order by school_id,month

/* Schools Gender-wise attendance */
select gender as x_axis,count(attendance) as attribute_1,school_id as x_value,'Schools Gender-wise attenadnce' as chart_name from student_attendance where attendance=1 group by gender,school_id order by school_id,gender
