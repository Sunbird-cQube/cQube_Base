



import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Schoolwise():
    def __init__(self, driver):
        self.driver = driver

    def School_select_box(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        school = Select(self.driver.find_element_by_id(Data.district_dropdown))
        for i in range(1, len(school.options)):
            school.select_by_index(i)
            self.load.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = self.p.get_download_dir() + '/'+self.fname.pchart_schools()
            file = os.path.isfile(self.filename)
            if file != True:
                print(school.options[i].text,'School wise csv file is not downloaded')
                count = count + 1
        self.load.page_loading(self.driver)
        return count