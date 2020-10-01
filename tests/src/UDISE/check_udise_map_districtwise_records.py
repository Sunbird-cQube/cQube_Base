import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class udise_map_districtwise():

    def __init__(self,driver):
        self.driver = driver

    def test_districtwise(self):
        p = pwd()
        self.cal = GetData()
        self.driver.implicitly_wait(30)
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            markers = self.driver.find_elements_by_class_name(Data.dots)
            if len(markers)-1 == 0:
                print(select_district.options[x].text,"has no data on map")
            else:
                count = 0
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                self.filename = p.get_download_dir() + "/Block_per_dist_report.csv"
                self.cal.page_loading(self.driver)
                file = os.path.isfile(self.filename)
                if True != file:
                    print(select_district.options[x].text, "file is not downloaded")
                    count = count + 1
                    time.sleep(2)
                os.remove(self.filename)
                return count

