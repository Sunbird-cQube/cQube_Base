import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class visited():
    def __init__(self,driver):
        self.driver =driver

    def test_schools(self):
        p = pwd()
        self.driver.implicitly_wait(20)
        self.cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.cal.page_loading(self.driver)
        District_wise = Select(self.driver.find_element_by_id("downloader"))
        District_wise.select_by_visible_text(" Dist Wise Report ")
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = p.get_download_dir() + "/District_level_CRC_Report.csv"
        with open(self.filename) as fin:
            csv_reader = csv.reader(fin, delimiter=',')
            header = next(csv_reader)
            total = 0
            for row in csv.reader(fin):
                total += int(row[1])
            visit = self.driver.find_element_by_id("visited").text
            res = re.sub('\D',"",visit)
            time.sleep(2)
            return res,total

    def remove_file(self):
        os.remove(self.filename)

