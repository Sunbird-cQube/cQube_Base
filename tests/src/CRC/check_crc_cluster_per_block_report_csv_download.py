import os
import time
import unittest
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class cluster_csv():

    def __init__(self, driver):
        self.driver = driver
        self.filename =''
    def test_clusterlevel(self):
        self.cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        count = 0
        p =pwd()
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                self.cal.page_loading(self.driver)
                self.driver.find_element_by_id('download').click()
                time.sleep(2)
                filename = p.get_download_dir() + "/Cluster_level_CRC_Report"
                if os.path.isfile(filename) != True:
                    print("District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "csv is not downloaded")
                    count = count + 1
                if os.path.isfile(filename) == True:
                    os.remove(filename)

        return count



