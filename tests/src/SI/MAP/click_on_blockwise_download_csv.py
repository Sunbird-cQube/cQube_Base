import time


from Data.parameters import Data
from reuse_func import GetData


class cluster_level_map_check():
    def __init__(self,driver):
        self.driver = driver
    def test_blockwise_data(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.scm_dist).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.scm_blk).click()
        self.p.page_loading(self.driver)
        lists = self.driver.find_elements_by_class_name(Data.dots)
        self.p.page_loading(self.driver)
        count = len(lists)-1
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        return count