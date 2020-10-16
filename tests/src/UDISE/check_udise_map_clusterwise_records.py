import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class test_school_map_schoollevel_records():

    def __init__(self,driver):
        self.driver = driver
    def remove_csv1(self):
        os.remove(self.filename)

    def check_download_csv1(self):
        p = pwd()
        self.cal = GetData()
        self.driver.implicitly_wait(100)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        select_block = Select(self.driver.find_element_by_id('choose_block'))
        select_cluster = Select(self.driver.find_element_by_id('choose_cluster'))
        count = 0
        self.fname = file_extention()
        for x in range( int(len(select_district.options))-1, int(len(select_district.options))):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            for y in range(1,len(select_block.options)):
                select_block.select_by_index(y)
                self.cal.page_loading(self.driver)
                for z in range(1,len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    self.cal.page_loading(self.driver)
                    nodata = self.driver.find_element_by_id("errMsg").text
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    if len(markers)-1 == 0:
                            print(select_cluster.options[z].text,"does not contains markers on map")
                    else:
                        self.driver.find_element_by_id(Data.Download).click()
                        time.sleep(3)
                        self.filename = p.get_download_dir() + "/" + self.fname.udise_clusterwise()
                        if not os.path.isfile(self.filename):
                            print(select_district.options[x].text,select_block.options[y].text,select_cluster.options[z].text ,"csv file is not downloaded!")
                            count = count + 1
                        self.remove_csv1()
        return count
