import os
import time
import unittest

from selenium import webdriver
from selenium.common import exceptions
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class download_schoolwise_csv():
    def __init__(self,driver):
        self.driver = driver

    def test_schoolwise_csv(self):
            self.cal  = GetData()
            self.driver.find_element_by_xpath(Data.hyper).click()
            self.cal.page_loading(self.driver)
            p =pwd()
            District_wise=Select(self.driver.find_element_by_id("downloader"))
            District_wise.select_by_visible_text(" School_Wise Report ")
            self.cal.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/School_level_CRC_Report.csv"
            self.cal.page_loading(self.driver)
            return os.path.isfile(self.filename)


    def remove_file(self):
        os.remove(self.filename)


