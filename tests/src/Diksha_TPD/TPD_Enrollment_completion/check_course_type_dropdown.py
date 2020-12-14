import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class course_types():
    def __init__(self,driver):
        self.driver = driver

    def check_with_course_dropdown(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        course_type =Select(self.driver.find_element_by_id(Data.coursetype))
        course_type.select_by_visible_text(' Enrollment ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + '/all_enrollment_data.csv'
        if os.path.isfile(self.filename) != True:
            print('Enrollment csv file is not downloaded')
            count = count + 1
            self.data.page_loading(self.driver)

        course_type = Select(self.driver.find_element_by_id(Data.coursetype))
        course_type.select_by_visible_text(' Completion ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.file = self.p.get_download_dir() + '/all_completion_data.csv'
        if os.path.isfile(self.file) != True:
            print('completion csv file is not downloaded')
            count = count + 1
            self.data.page_loading(self.driver)
        os.remove(self.filename)
        os.remove(self.file)
        return  count