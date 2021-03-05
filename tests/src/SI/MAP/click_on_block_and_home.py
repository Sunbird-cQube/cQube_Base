import time

from Data.parameters import Data
from reuse_func import GetData


class block_level_home():
    def __init__(self, driver):
        self.driver = driver
    def test_blocks(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.scm_dist).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.scm_blk).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        self.p.page_loading(self.driver)
