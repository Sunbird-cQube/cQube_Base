import re
from selenium.webdriver.support.select import Select
from Data.parameters import Data
from reuse_func import GetData


class DateRange():
    def __init__(self, driver):
        self.driver = driver

    def check_date_range(self):
        count =0
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        year = Select(self.driver.find_element_by_id('year'))
        count = len(year.options)
        month = Select(self.driver.find_element_by_id('month'))
        for i in range(1,len(year.options)):
            year.select_by_index(i)
            print(year.options[i].text)
            cal.page_loading(self.driver)
            cal.page_loading(self.driver)
        return count

















