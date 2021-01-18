import re
import time

from Data.parameters import Data
from reuse_func import GetData


class TotalStudents():
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
        self.driver.find_element_by_id(Data.sr_block_btn).click()
        cal.page_loading(self.driver)
        Bstudents = self.driver.find_element_by_id(Data.students).text
        Bstudent = re.sub("\D", "", Bstudents)
        return self.student_count, Bstudent

    def cluster_total_no_of_students(self):
        self.driver.find_element_by_id(Data.sr_cluster_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        Cstudents = self.driver.find_element_by_id(Data.students).text
        Cstudent = re.sub("\D", "", Cstudents)
        return self.student_count, Cstudent

    def schools_total_no_of_students(self):
        self.driver.find_element_by_id(Data.sr_schools_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(20)
        Sstudents = self.driver.find_element_by_id(Data.students).text
        Sstudent = re.sub("\D", "", Sstudents)
        return self.student_count, Sstudent

