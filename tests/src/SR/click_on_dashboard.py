import time

from Data.parameters import Data
from reuse_func import GetData


class Dashboard():
    def __init__(self, driver):
        self.driver = driver

    def click_on_dashboard(self):
        cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        cal.page_loading(self.driver)
        cal.navigate_to_semester_report()
        cal.page_loading(self.driver)

