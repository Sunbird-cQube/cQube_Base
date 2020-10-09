

import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Districtwise_csv_download():
    def __init__(self, driver):
        self.driver = driver
    def remove_csv(self):
        os.remove(self.filename)

    def check_district(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            markers = self.driver.find_elements_by_class_name(Data.dots)
            time.sleep(3)
            if (len(markers) - 1) == 0 :
                print("District" + select_district.first_selected_option.text +"no data")
                count = count + 1
            else :
                time.sleep(2)
                self.driver.find_element_by_id('download').click()
                time.sleep(2)
                p = pwd()
                self.filename = p.get_download_dir() + "/Block_per_dist_report.csv"
                if not os.path.isfile(self.filename):
                    print("District" + select_district.first_selected_option.text + "csv is not downloaded")
                    count = count + 1

        return count













