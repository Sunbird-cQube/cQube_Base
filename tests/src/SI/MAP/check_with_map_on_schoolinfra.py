import time


from Data.parameters import Data
from reuse_func import GetData


class check_markers_on_map():
    def __init__(self,driver):
        self.driver = driver
    def test_map(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        self.p.page_loading(self.driver)
        count = len(dots)-1
        return count
