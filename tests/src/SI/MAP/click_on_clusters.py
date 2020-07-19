import time

from Data.parameters import Data
from reuse_func import GetData


class cluster_button():
    def __init__(self,driver):
        self.driver =driver

    def test_clusterbtn(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.scm_cluster).click()
        self.p.page_loading(self.driver)
        time.sleep(10)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        count = len(dots)-1
        return count
