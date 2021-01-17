import time

from Data.parameters import Data
from reuse_func import GetData


class Blocks():
    def __init__(self, driver):
        self.driver = driver

    def check_markers_on_block_map(self):
        self.driver.find_element_by_id(Data.sr_block_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        return dots