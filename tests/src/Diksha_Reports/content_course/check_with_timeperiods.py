

import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class timeperiod_options():
    def __init__(self,driver):
        self.driver = driver

    def test_districts(self):
        self.data = GetData()
        self.p = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        times = Select(self.driver.find_element_by_name('timePeriod'))
        count = len(times.options) - 1
        for i in range(len(times.options)):
            times.select_by_index(i)
            print(times.options[i].text)
            self.data.page_loading(self.driver)
        return count

