import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class sc_map_districtwise():

    def __init__(self,driver):
        self.driver = driver

    def test_schools(self):
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
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                self.filename = p.get_download_dir() + "/Block_per_dist_report.csv"
                with open(self.filename) as fin:
                    csv_reader = csv.reader(fin, delimiter=',')
                    header = next(csv_reader)
                    schools = 0
                    for row in csv.reader(fin):
                        schools += int(row[2])
                    school = self.driver.find_element_by_id("schools").text
                    sc = re.sub('\D', "", school)
                    if int(sc) != schools:
                        print(select_district.options[x].text, "schools:", schools, int(sc), "mismatch found")
                    time.sleep(2)
                os.remove(self.filename)

