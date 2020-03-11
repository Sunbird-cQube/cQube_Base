from datetime import datetime
from random import randrange, choice
import pandas as pd
import numpy as np
import random
#import datetime

academic_year = 2020
def valid_date(academic_year,m,day):
    """function to validate day"""
    try:
        v_date = None
        v_date = datetime(academic_year, m, day)
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
teacherdata = list()
serial_id=0
def data_generate():
    """Generating ficticitous data for schools and students"""
    print("started at {}".format(datetime.now()))
    for school in range(10000000001, 10000000005):
        for student in range(500000000000000001, random.randrange(500000000000000003,500000000000000005)):
            sex = gender()

            for m in range (1,13):
                created_on = []
                startDate = datetime(2020, m, 1, random.randrange(14, 18), random.randrange(1, 59),
                                              random.randrange(1, 59))
                created_on=startDate.strftime("%Y-%m-%d %H:%M:%S")
                day = [9999 for i in range(31)]
                for d in range(0, 31):
                    try:
                        updated_on = []
                        endDate = datetime(2020, m, d+1, random.randrange(14, 18), random.randrange(1, 59),
                                                random.randrange(1, 59))
                        updated_on = endDate.strftime("%Y-%m-%d %H:%M:%S")

                        if valid_date(academic_year,m,d+1):
                            if m == 1:
                                month_data = 'January'
                                day[d]=np.random.choice([1, 2], p=[0.65, 0.35])
                            elif m == 2:
                                month_data = 'Febraury'
                                day[d] = np.random.choice([1, 2], p=[0.75, 0.25])
                            elif m == 3:
                                month_data = 'March'
                                day[d] = np.random.choice([1, 2], p=[0.50, 0.50])
                            elif m == 4:
                                month_data = 'April'
                                day[d] = np.random.choice([1, 2], p=[0.85, 0.15])
                            elif m == 5:
                                month_data = 'May'
                                day[d] = np.random.choice([1, 2], p=[0.95, 0.05])
                            elif m == 6:
                                month_data = 'June'
                                day[d] = np.random.choice([1, 2], p=[0.45, 0.55])
                            elif m == 7:
                                month_data = 'July'
                                day[d] = np.random.choice([1, 2], p=[0.85, 0.15])
                            elif m == 8:
                                month_data = 'August'
                                day[d] = np.random.choice([1, 2], p=[0.88, 0.12])
                            elif m == 9:
                                month_data = 'September'
                                day[d] = np.random.choice([1, 2], p=[0.90, 0.10])
                            elif m == 10:
                                month_data = 'October'
                                day[d] = np.random.choice([1, 2], p=[0.72, 0.28])
                            elif m == 11:
                                month_data = 'November'
                                day[d] = np.random.choice([1, 2], p=[0.68, 0.32])
                            else:
                                month_data = 'December'
                                day[d] = np.random.choice([1, 2], p=[0.86, 0.14])
                        else:
                            day[d] = 0

                        teacherdata.append((school, student,student-school,academic_year,m,day[0], day[1], day[2], day[3], day[4], day[5], day[6], day[7], day[8], day[9],
                                    day[10], day[11], day[12],
                                    day[13], day[14], day[15], day[16], day[17], day[18], day[19], day[20], day[21], day[22], day[23], day[24],
                                    day[25], day[26],
                                    day[27], day[28], day[29], day[30],created_on,updated_on))
                    except:
                        pass
    sdf = pd.DataFrame(teacherdata,
                           columns=['school_id','student_id','school_student_id','academic_year','month',
             'day_1','day_2','day_3','day_4','day_5','day_6','day_7','day_8','day_9',
             'day_10','day_11','day_12','day_13','day_14','day_15','day_16','day_17',
             'day_18','day_19','day_20','day_21','day_22','day_23','day_24','day_25',
             'day_26','day_27','day_28','day_29','day_30','day_31','created_on','updated_on'])

    sdf.to_csv("/home/prashanth/Desktop/Cqube/data_generated/c3_student_attendance.csv", index=False)
    print("Completed at {}".format(datetime.now()))
def main():
    data_generate()

if __name__ == "__main__":
    main()