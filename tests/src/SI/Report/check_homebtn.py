import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class home_button():
    def __init__(self,driver):
        self.driver = driver
    def test_home(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_name("myDistrict"))
        dist.select_by_index(1)
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        down =  self.driver.find_element_by_id(Data.Download)
        time.sleep(2)
        return down.is_displayed()

