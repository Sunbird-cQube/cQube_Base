import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class gradewise_records():
    def __init__(self ,driver):
        self.driver = driver

    def grades_files(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        grades = Select(self.driver.find_element_by_id(Data.grade))
        for i in range(2, len(grades.options)):
            grades.select_by_index(i)
            self.load.page_loading(self.driver)
            if grades.options[i].text in self.driver.page_source:
                print(grades.options[i].text ,'is displayed in chart ')
                self.load.page_loading(self.driver)
            else:
                print(grades.options[i].text ,'is not displayed ')
                count = count + 1
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = self.p.get_download_dir() + "/" + self.fname.pchart_grades()
            if os.path.isfile(self.filename) != True:
                print(grades.options[i].text,'csv file is not downloaded ')
                count = count + 1
            else:
                print(grades.options[i].text,"csv file is downloaded")
            os.remove(self.filename)
        self.load.page_loading(self.driver)
        return count
