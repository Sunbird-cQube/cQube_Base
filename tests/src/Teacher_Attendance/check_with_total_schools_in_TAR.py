import re
import time

from selenium.common.exceptions import NoSuchElementException

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
        self.driver.find_element_by_id(Data.SAR_Blocks_btn).click()
        cal.page_loading(self.driver)
        Bschools = self.driver.find_element_by_id(Data.schoolcount).text
        Bschools = re.sub("\D", "", Bschools)
        return self.school_count, Bschools

    def cluster_no_of_schools(self):
        self.driver.find_element_by_id(Data.SAR_Clusters_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        time.sleep(15)
        Cschools = self.driver.find_element_by_id(Data.schoolcount).text
        Cschools = re.sub("\D", "", Cschools)
        return self.school_count, Cschools

    def schools_no_of_schools(self):
        try:
            self.driver.find_element_by_id(Data.SAR_Schools_btn).click()
            cal = GetData()
            cal.page_loading(self.driver)
            time.sleep(15)
            Sschools = self.driver.find_element_by_id(Data.schoolcount).text
            Sschools = re.sub("\D", "", Sschools)
            return self.school_count, Sschools
        except NoSuchElementException:
            print("Element Not Found")


