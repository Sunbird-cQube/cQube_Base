import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class udise_districtwise_schoolvalue():

    def __init__(self,driver):
        self.driver = driver

    def test_districtwise_schools_count(self):
        p = pwd()
        count = 0
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
                schools = self.driver.find_element_by_id(Data.schoolcount).text
                sc = re.sub('\D', "", schools)
                if int(sc) == 0:
                    print(select_district.options[x],'has no no of school count')
                    count = count + 1
                time.sleep(2)

        return count

