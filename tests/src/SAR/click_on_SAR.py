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
            cal.navigate_to_student_report()
            cal.page_loading(self.driver)
        except ElementClickInterceptedException:
            print("Element not found and test failed")



