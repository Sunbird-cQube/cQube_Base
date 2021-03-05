import re
import time

from Data.parameters import Data
from reuse_func import GetData


class TotalSchools():
    def __init__(self, driver):
        self.driver = driver
        self.school_count = ''

    global school_count

    def block_no_of_schools(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        no_schools = self.driver.find_element_by_id(Data.schoolcount).text
        schools = re.sub("\D", "", no_schools)
        self.school_count = schools
        self.driver.find_element_by_id(Data.sr_block_btn).click()
        cal.page_loading(self.driver)
        Bschools = self.driver.find_element_by_id(Data.schoolcount).text
        Bschools = re.sub("\D", "", Bschools)
        return self.school_count, Bschools

    def cluster_no_of_schools(self):
        cal = GetData()
        self.driver.find_element_by_id(Data.sr_cluster_btn).click()
        cal.page_loading(self.driver)
        Cschools = self.driver.find_element_by_id(Data.schoolcount).text
        Cschools = re.sub("\D", "", Cschools)
        return self.school_count, Cschools

    def schools_no_of_schools(self):
        cal = GetData()
        self.driver.find_element_by_id(Data.sr_schools_btn).click()
        cal.page_loading(self.driver)
        Sschools = self.driver.find_element_by_id(Data.schoolcount).text
        Sschools = re.sub("\D", "", Sschools)
        return self.school_count, Sschools

