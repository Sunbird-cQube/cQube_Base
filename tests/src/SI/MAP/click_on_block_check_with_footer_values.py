import re

from Data.parameters import Data
from reuse_func import GetData


class school_count():
   def __init__(self,driver):
       self.driver = driver

   def test_count(self):
       self.p = GetData()
       self.driver.find_element_by_xpath(Data.hyper_link).click()
       self.p.page_loading(self.driver)
       self.driver.find_element_by_xpath(Data.hyper_link).click()
       self.p.page_loading(self.driver)
       self.driver.find_element_by_id(Data.scm_block).click()
       self.p.page_loading(self.driver)
       schools = self.driver.find_element_by_id(Data.sc_no_of_schools).text
       res = re.sub("\D", "", schools)
       self.p.page_loading(self.driver)
       return res



