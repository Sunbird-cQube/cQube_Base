import re
import time

from Data.parameters import Data
from reuse_func import GetData


class TotalStudentsSchools():
    def __init__(self, driver):
        self.driver = driver

    global student_count

    def block_cluster_schools_footer_info(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        total_students = self.driver.find_element_by_id(Data.students).text
        students = re.sub("\D", "", total_students)
        no_schools = self.driver.find_element_by_id(Data.schoolcount).text
        schools = re.sub("\D", "", no_schools)


        self.driver.find_element_by_id(Data.block_btn).click()
        cal.page_loading(self.driver)
        Bstudents = self.driver.find_element_by_id(Data.students).text
        Bstudent = re.sub("\D", "", Bstudents)

        Bschools = self.driver.find_element_by_id(Data.schoolcount).text
        Bschool = re.sub("\D", "", Bschools)
        print("Blocks",Bstudent,Bschool)
        cal.page_loading(self.driver)


        self.driver.find_element_by_id(Data.cluster_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(10)
        Cstudents = self.driver.find_element_by_id(Data.students).text
        Cstudent = re.sub("\D", "", Cstudents)
        Cschools = self.driver.find_element_by_id(Data.schoolcount).text
        Cschool = re.sub("\D", "", Cschools)
        print("clusterwise", Cstudent,Cschool)
        cal.page_loading(self.driver)


        self.driver.find_element_by_id(Data.schoolbtn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(10)
        Sstudents = self.driver.find_element_by_id(Data.students).text
        Sstudent = re.sub("\D", "", Sstudents)

        Sschools = self.driver.find_element_by_id(Data.schoolcount).text
        Sschool = re.sub("\D", "", Sschools)
        print("School wise ",Sstudents,Sschool)
        cal.page_loading(self.driver)

        return students,schools ,Bstudent,Bschool , Cstudent,Cschool,Sstudent,Sschool
