import time

from Data.parameters import Data
from reuse_func import GetData


class Dashboard():
    def __init__(self, driver):
        self.driver = driver

    def click_on_dashboard(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(1)
        self.driver.find_element_by_xpath(Data.sr_by_xpath).click()
        cal = GetData()
        cal.page_loading(self.driver)

