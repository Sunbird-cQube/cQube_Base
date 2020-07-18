import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class districtlevel_school():
    def __init__(self,driver):
        self.driver = driver

    def test_districtwise_schoolscount(self):
        p = pwd()
        self.cal = GetData()
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            markers = self.driver.find_elements_by_class_name(Data.dots)
            count = len(markers)
            self.cal.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = p.get_download_dir() + "/Block_Per_dist_report.csv"
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                schools = 0
                for row in csv.reader(fin):
                    schools += int(row[2])
                school = self.driver.find_element_by_id("schools").text
                sc = re.sub('\D', "", school)
                self.cal.page_loading(self.driver)
                os.remove(self.filename)
                if int(sc) == schools:
                    print(select_district.options[x].text, ":", "schools:", schools, int(sc))
                else:
                    print(select_district.options[x].text, ":", "schools:", schools, int(sc))
            self.cal.page_loading(self.driver)
            return count
