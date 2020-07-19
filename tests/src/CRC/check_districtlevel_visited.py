import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData

class districtwise_visits():
    def __init__(self, driver):
        self.driver = driver

    def test_districtwise_schoolvisited(self):
        p = pwd()
        self.cal = GetData()
        self.driver.implicitly_wait(20)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = p.get_download_dir() + "/Block_level_CRC_Report.csv"
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                schools = 0
                for row in csv.reader(fin):
                    schools += int(row[0])
                schoolvisited = self.driver.find_element_by_id("visited").text
                sc= re.sub('\D', "", schoolvisited)
                self.cal.page_loading(self.driver)
                os.remove(self.filename)
                if int(sc) == schools:
                    print(select_district.options[x].text ,":" ,"total no of schools visited :" ,schools ,int(sc))
                else:
                    print(select_district.options[x].text, ": records are mischated ")

                self.cal.page_loading(self.driver)
