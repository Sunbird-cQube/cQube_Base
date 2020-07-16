import re
import time

from selenium.common import exceptions

from Data.parameters import Data
from reuse_func import GetData


class Block_school_count():
    def __init__(self,driver):
        self.driver = driver

    def test_counter(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        try:
            school = self.driver.find_element_by_id(Data.sc_no_of_schools).text
            res = re.sub('\D', "", school)
            self.p.page_loading(self.driver)
            self.driver.find_element_by_id(Data.scm_block).click()
            self.p.page_loading(self.driver)
            bschool = self.driver.find_element_by_id(Data.sc_no_of_schools).text
            bres = re.sub('\D',"",bschool)
            self.p.page_loading(self.driver)

            self.driver.find_element_by_id(Data.scm_cluster).click()
            self.p.page_loading(self.driver)
            time.sleep(10)
            cschool = self.driver.find_element_by_id(Data.sc_no_of_schools).text
            cres = re.sub('\D', "", cschool)
            self.p.page_loading(self.driver)

            self.driver.find_element_by_id(Data.scm_school).click()
            time.sleep(15)
            sschool = self.driver.find_element_by_id(Data.sc_no_of_schools).text
            sres = re.sub('\D', "", sschool)
            self.p.page_loading(self.driver)
            return res ,bres ,cres,sres
        except exceptions.ElementClickInterceptedException :
            print("no of schools are same ")
            self.p.page_loading(self.driver)
