import time

from selenium.common.exceptions import ElementClickInterceptedException

from Data.parameters import Data
from reuse_func import GetData


class DahboardSar():
    def __init__(self, driver):
        self.driver = driver

    def click_on_sar(self):
        try:
            cal = GetData()
            cal.click_on_state(self.driver)
            cal.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Dashboard).click()
            time.sleep(1)
            self.driver.find_element_by_id(Data.SAR).click()
            cal.page_loading(self.driver)
            return self.driver.page_source
        except ElementClickInterceptedException:
            print("Element not found and test failed")



