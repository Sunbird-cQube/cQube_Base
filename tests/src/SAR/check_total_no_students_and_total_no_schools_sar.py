import re
import time

from Data.parameters import Data
from reuse_func import GetData


class TotalStudentsSchools():
    def __init__(self, driver):
        self.driver = driver
        self.student_count = ''

    global student_count

    def block_total_no_of_students(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        total_students = self.driver.find_element_by_id(Data.students).text
        students = re.sub("\D", "", total_students)
        self.student_count = students
        no_schools = self.driver.find_element_by_id(Data.schoolcount).text
        schools = re.sub("\D", "", no_schools)
        self.school_count = schools

        self.driver.find_element_by_id(Data.SAR_Blocks_btn).click()
        cal.page_loading(self.driver)
        Bstudents = self.driver.find_element_by_id(Data.students).text
        Bstudent = re.sub("\D", "", Bstudents)

        Bschools = self.driver.find_element_by_id(Data.schoolcount).text
        Bschools = re.sub("\D", "", Bschools)

        return self.student_count, Bstudent, self.school_count, Bschools


    def cluster_total_no_of_students(self):
        self.driver.find_element_by_id(Data.SAR_Clusters_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(4)
        Cstudents = self.driver.find_element_by_id(Data.students).text
        Cstudent = re.sub("\D", "", Cstudents)
        Cschools = self.driver.find_element_by_id(Data.schoolcount).text
        Cschool = re.sub("\D", "", Cschools)
        return self.student_count, Cstudent,self.school_count,Cschool


    def schools_total_no_of_students(self):
        self.driver.find_element_by_id(Data.SAR_Schools_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(4)
        Sstudents = self.driver.find_element_by_id(Data.students).text
        Sstudent = re.sub("\D", "", Sstudents)

        Sschools = self.driver.find_element_by_id(Data.schoolcount).text
        Sschool = re.sub("\D", "", Sschools)

        return self.student_count, Sstudent, self.school_count, Sschool

