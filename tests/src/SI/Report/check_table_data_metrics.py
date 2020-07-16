import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class download_report():
    def __init__(self,driver):
        self.driver = driver
    def test_schools(self):
        p = pwd()
        self.cal = GetData()
        self.driver.implicitly_wait(20)  # seconds
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.cal.page_loading(self.driver)
        District_wise = Select(self.driver.find_element_by_id("downloader"))
        District_wise.select_by_visible_text(" Dist_Wise Report ")
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(2)
        self.filename = p.get_download_dir() + "/Dist_level_Infra_Report.csv"
        self.cal.page_loading(self.driver)
        value =  os.path.isfile(self.filename)
        return value
    def remove_csv(self):
        os.remove(self.filename)
