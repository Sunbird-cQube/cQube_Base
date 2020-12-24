import os

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class sem_options():
    def __init__(self,driver):
        self.driver = driver

    def sem_exception_options_test(self):
        self.data = GetData()
        p = pwd()
        count = 0
        fname = file_extention()
        choose = Select(self.driver.find_element_by_id('choose_semester'))
        choose.select_by_index(1)
        if 'no data found' in self.driver.page_source:
            print("Semester 1 has not data")
            self.driver.find_element_by_id(Data.home).click()
            self.data.page_loading(self.driver)
            self.data.navigate_to_semester_exception()
            self.data.page_loading(self.driver)
        return count