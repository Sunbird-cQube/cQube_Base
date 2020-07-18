import time

from Data.parameters import Data
from reuse_func import GetData


class Dashboard():
    def __init__(self, driver):
        self.driver = driver

    def click_on_dashboard(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.SAR).click()
