
from selenium.common import exceptions

from Data.parameters import Data
from reuse_func import GetData


class click_report():
       def __init__(self,driver):
           self.driver = driver

       def test_infra(self):
           self.p = GetData()
           self.driver.find_element_by_xpath(Data.hyper_link).click()
           self.p.page_loading(self.driver)
           try:
               self.driver.find_element_by_id(Data.Dashboard).click()
               self.p.page_loading(self.driver)
               self.driver.find_element_by_xpath(Data.School_infra).click()
               self.driver.find_element_by_id(Data.Report).click()
               self.p.page_loading(self.driver)
           except exceptions.ElementClickInterceptedException:
               print("school infra report page ")
