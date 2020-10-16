import csv
import os
import re
import time
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class composite_schoolevel_records():

    def __init__(self,driver):
        self.driver = driver

    def remove_csv1(self):
        os.remove(self.filename)

    def check_csv_download(self):
        p = pwd()
        self.cal = GetData()
        self.driver.implicitly_wait(60)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        self.fname = file_extention()
        for x in range(1, int(len(select_district.options))-30):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                self.cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    self.cal.page_loading(self.driver)
                    nodata = self.driver.find_element_by_id("errMsg").text
                    if nodata == "No data found":
                        print(select_district.options[x].text,select_block.options[y].text,select_cluster.options[z].text,"no data found!")
                        count = count + 1
                    else:
                        self.driver.find_element_by_id(Data.Download).click()
                        time.sleep(3)
                        self.filename = p.get_download_dir() + "/" + self.fname.composite_clusterwise()
                        self.cal.page_loading(self.driver)
                        self.file = os.path.isfile(self.filename)
                        os.remove(self.filename)
                    return self.file

