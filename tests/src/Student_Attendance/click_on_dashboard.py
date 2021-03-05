import time

from Data.parameters import Data
from reuse_func import GetData


class Dashboard():
    def __init__(self, driver):
        self.driver = driver

    def click_on_dashboard(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.navigate_to_student_report()
        cal.page_loading(self.driver)
