import time

from Data.parameters import Data
from reuse_func import GetData


class District_names():
    def __init__(self,driver):
        self.driver = driver

    def test_districtlist(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        Districts = self.driver.find_elements_by_xpath(Data.sc_choosedist)
        self.p.page_loading(self.driver)
        count =  len(Districts)-1
        return count

