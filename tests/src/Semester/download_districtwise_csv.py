import csv
import os
import re
import time
import unittest

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class DistrictwiseCsv():

    def __init__(self, driver):
        self.driver = driver

    def click_download_icon_of_district(self):
        cal = GetData()
        count = 0
        self.fname = file_extention()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        markers = self.driver.find_elements_by_class_name(Data.dots)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.sr_district()+cal.get_current_date()+'.csv'
        print(self.filename)
        if os.path.isfile(self.filename) != True:
           return "File Not Downloaded"
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                data = list(csv_reader)
                row_count = len(data)
                dots = len(markers) - 1
                if dots != row_count:
                    print('Markers records and csv file records are not matching ', dots, row_count)
                    count = count + 1
            os.remove(self.filename)
        return count



