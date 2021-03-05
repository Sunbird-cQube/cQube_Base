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


        self.driver.find_element_by_id(Data.block_btn).click()
        cal.page_loading(self.driver)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        bmarkers= len(dots)-1


        self.driver.find_element_by_id(Data.cluster_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(10)
        cmarkers= len(dots)-1




        self.driver.find_element_by_id(Data.schoolbtn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(10)
        smarkers= len(dots)-1


        return bmarkers , cmarkers ,smarkers