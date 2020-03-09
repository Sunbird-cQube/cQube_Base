## pip install pandas 
## pip install random

from datetime import datetime
from random import randrange, choice
import pandas as pd
import numpy as np


def attend():
    """Attendance values:     1: Present ,       2: Absent,       9999: Not Available"""
    return np.random.choice([1, 2, 9999], p=[0.8499, 0.15, 0.0001])

def student_attendance(month):
    """to generate student attendance for the working days in a month"""
    days = list()
    for day in range(1, 32):
        if valid_date(day, month):
            if month==1:
                days.append(np.random.choice([1, 2], p=[0.65, 0.35]))
            elif month==2:
                days.append(np.random.choice([1, 2], p=[0.95, 0.05]))
            else:
                days.append(np.random.choice([1, 2], p=[0.70, 0.30]))
        else:
            days.append(0)
    return days


def valid_date(day, month):
    """function to validate day"""
    try:
        v_date = None
        v_date = datetime(2019, month, day)
        weekday = v_date.isoweekday()
        if weekday == 7:
            v_date = None
    except Exception as err:
        print(err)
    if v_date:
        return True
    else:
        return False


def gender():
    """choose gender"""
    return choice(['M', 'F'])

def data_generate():
    """Generating ficticitous data for schools and students"""
    school_id = list(range(1001, 1011))
    student_id = {}
    studentids = (list(range(x, x + 10)) for x in range(100, 200, 10))
    studentidl = [list(range(x, x + 10)) for x in range(100, 200, 10)]
    school_name=['SHRI GOVERNMENT HIGH SCHOOL','GOVERNMENT HIGH SCHOOL','GOVERNMENT HIGH SCHOOL, MOINABAD','GOVERNMENT HIGHSCHOOL N SAROVAR','GOVERNMENT HIGHER SECONDARY SCHOOL','MODEL SCHOOL DAYAPAR','GOVERNMENT HIGHSCHOOL HARODA','GOVERNMENT HIGH SCHOOL BARANDA','GOVT. HIGH SCHOOL.MATANA MADH','GOVERNMENT HIGH SCHOOL, SARAN MOTI']
    studentgen ={}
    schoolmap={}
    for l_id in studentidl:
        for id in l_id:
            studentgen[id]=gender()
    for ran in range(len(school_id)):
        schoolmap[school_id[ran]]=school_name[ran]
    for c in school_id:
        # writing random data to a file for , first 3 month, for 10 schools and 10 students per schoolcreate table student_attendance(school_id int,student_id int,month varchar(10),gender varchar(2),Day int,attendance float);
        student_id[c] = studentids.__next__()
        studentdata = list()
    for month in range(1, 4, 1):
        if month ==1:
            month_data='January'
        elif month ==2:
            month_data='February'
        else:
            month_data='March'
        for school in school_id:
            schoolname = schoolmap.get(school)
            for student in student_id.get(school):
                sex = studentgen.get(student)
                s = student_attendance(month)
                studentdata.append((school, schoolname,student, month_data, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9],
                                    s[10], s[11], s[12],
                                    s[13], s[14], s[15], s[16], s[17], s[18], s[19], s[20], s[21], s[22], s[23], s[24],
                                    s[25], s[26],
                                    s[27], s[28], s[29], s[30], sex))
        sdf = pd.DataFrame(studentdata,
                           columns=['school_id', 'schoolname', 'student_id', 'month', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'day8', 'day9', 'day10', 'day11', 'day12', 'day13', 'day14',
                                    'day15', 'day16', 'day17', 'day18', 'day19', 'day20', 'day21', 'day22', 'day23', 'day24', 'day25', 'day26', 'day27', 'day28', 'day29', 'day30', 'day31', 'gender',
                                    ])
        sdf.to_csv("studentattendance.csv", index=False)


def main():
    data_generate()


if __name__ == "__main__":
    main()
