import time

from selenium import webdriver
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Homebutton():
   def __init__(self,driver):
       self.driver = driver

   def test_homeicon(self):
       self.p =GetData()
       self.driver.implicitly_wait(20)
       self.driver.find_element_by_xpath(Data.hyper).click()
       self.p.page_loading(self.driver)
       dist = Select(self.driver.find_element_by_name("myDistrict"))
       dist.select_by_index(1)
       self.p.page_loading(self.driver)
       self.driver.find_element_by_id(Data.homeicon).click()
       self.p.page_loading(self.driver)
       down =  self.driver.find_element_by_id(Data.Download)
       time.sleep(3)
       return down.is_displayed()

