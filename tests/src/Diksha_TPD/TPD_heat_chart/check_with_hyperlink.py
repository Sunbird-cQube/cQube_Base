import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class lpdchart_hyperlink():
    def __init__(self,driver):
        self.driver = driver


    def test_hypers(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        examdates = Select(self.driver.find_element_by_id(Data.timeperiods))
        examdates.select_by_index(2)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)

    def test_download_function(self):
        self.p = GetData()
        self.file = pwd()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.file.get_download_dir() + '/' + self.fname.lpd_districts()
        if os.path.isfile(self.filename) != True:
            print("Download icon is not working ")
            count = count + 1
        else:
            print('Download icon is working ')
        os.remove(self.filename)
        self.p.page_loading(self.driver)
        return count