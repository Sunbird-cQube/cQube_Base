import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data

from get_dir import pwd
from reuse_func import GetData


class school_visits():
    def __init__(self,driver):
        self.driver = driver
    def test_visits(self):
        p = pwd()
        self.cal = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.cal.page_loading(self.driver)
        District_wise = Select(self.driver.find_element_by_id("downloader"))
        District_wise.select_by_visible_text(" Dist_Wise Report ")
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(2)
        self.filename = p.get_download_dir() + "/District_level_CRC_Report.csv"
        with open(self.filename) as fin:
            csv_reader = csv.reader(fin, delimiter=',')
            header = next(csv_reader)
            total = 0
            for row in csv.reader(fin):
                total += int(row[2])
            visit = self.driver.find_element_by_id("visits").text
            time.sleep(3)
            res = re.sub('\D',"",visit)
            time.sleep(1)
            return res , total


    def remove_file(self):
        os.remove(self.filename)

