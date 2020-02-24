from datetime import datetime
from random import randrange,choice
import pandas as pd
import numpy as np

def attend():
    """Attendance values:     1: Present ,       2: Absent,       9999: Not Available"""
    return np.random.choice([1,2,9999], p=[0.8499, 0.15, 0.0001])

def student_attendance(month):
    """to generate student attendance for the working days in a month"""
    days=list()
    for day in range(1,32):
        if valid_date(day,month):
            days.append(attend())
        else:
            days.append(None)
    return days

def valid_date(day,month): 
    """function to validate day"""
    try:
        v_date=None
        v_date=datetime(2019, month, day)
        weekday=v_date.isoweekday()
        if weekday ==7:
            v_date = None
    except Exception as err:
        print(err)
    if v_date:
        return True
    else:
        return False

def gender():
    """choose gender"""
    return choice(['M','F'])
    
def leave_reason():
    """to populate the reason if a student is absent"""
    return choice(['Sick', 'Family function', 'Vacation', 'Emergency'])    

def data_generate():
    """Generating ficticitous data for schools and students"""
    school_id = list(range(1001,1011))
    student_id = {}
    studentids = (list(range(x,x+10)) for x in range(100,200,10))
    for c in school_id:
    #writing random data to a file for , first 3 month, for 10 schools and 10 students per school
        student_id[c]=studentids.__next__()
        studentdata=list()
    for month in range(1,4,1):
        for school in school_id:
            for student in student_id.get(school):
                sex=gender()
                s=student_attendance(month)
                reason=leave_reason()
                studentdata.append((school, student, month, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9], s[10], s[11], s[12],
                    s[13], s[14], s[15], s[16], s[17], s[18], s[19], s[20], s[21], s[22], s[23], s[24], s[25], s[26],
                    s[27], s[28], s[29], s[30], sex,reason))
        sdf=pd.DataFrame(studentdata,columns=['school_id', 'student_id','month',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,'gender','leave_reason'])
        sdf.to_csv("studentattendance.csv",index=False)

def main():
    data_generate()

if __name__ == "__main__":
    main()