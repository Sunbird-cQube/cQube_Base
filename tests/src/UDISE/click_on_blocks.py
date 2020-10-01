import os
import time

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class click_on_blocks():
   def __init__(self,driver ):
       self.driver = driver
   def test_blocks_button(self):
       self.p = GetData()
       cal = pwd()
       self.driver.find_element_by_xpath(Data.hyper_link).click()
       self.p.page_loading(self.driver)
       self.driver.find_element_by_id(Data.scm_block).click()
       self.p.page_loading(self.driver)
       dots = self.driver.find_elements_by_class_name(Data.dots)
       count = len(dots) - 1
       self.p.page_loading(self.driver)
       self.driver.find_element_by_id('download').click()
       time.sleep(3)
       self.filename = cal.get_download_dir() + '/Block_wise_report.csv'
       self.p.page_loading(self.driver)
       file = os.path.isfile(self.filename)
       self.p.page_loading(self.driver)
       os.remove(self.filename)
       return count , file

