import csv
import os
import re
import time
import unittest

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class school_map_blockwise():

    def __init__(self,driver):
        self.driver = driver
    def test_schools(self):
        p = pwd()
        self.cal = GetData()
        self.driver.implicitly_wait(100)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        select_block = Select(self.driver.find_element_by_id('choose_block'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            print(select_district.options[x].text)
            for y in range(1,len(select_block.options)):
                select_block.select_by_index(y)
                self.cal.page_loading(self.driver)
                nodata = self.driver.find_element_by_id("errMsg").text
                if nodata == "No data found":
                    print(select_district.options[x].text, "no data found!")
                    count = count + 1
                else:
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    if len(markers)-1 != 0:
                        self.driver.find_element_by_id(Data.Download).click()
                        time.sleep(4)
                        self.filename = p.get_download_dir() + "/Cluster_per_block_report.csv"
                        if not os.path.isfile(self.filename):
                            print(select_block.options[y].text,"csv is not dowloaded")
                        else:
                            with open(self.filename) as fin:
                                csv_reader = csv.reader(fin, delimiter=',')
                                header = next(csv_reader)
                                total = 0
                                schools = 0
                                for row in csv.reader(fin):
                                    schools += int(row[2])
                                school = self.driver.find_element_by_id("schools").text
                                sc= re.sub('\D', "", school)
                                if int(sc) != schools:
                                    print(select_block.options[y].text,"schools:",schools ,int(sc) ,"mismatch found" )
                                time.sleep(2)
                            os.remove(self.filename)
            return count
