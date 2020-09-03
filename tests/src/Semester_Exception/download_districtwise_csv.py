import os
import re
import time
import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class check_DistrictwiseCsv():

    def __init__(self, driver):
        self.driver = driver

    def click_download_csv_of_districts(self):
        cal = GetData()
        count = 0
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        p = pwd()
        self.filename = p.get_download_dir() + "/District_wise_report.csv"
        if os.path.isfile(self.filename) != True:
           return "File Not Downloaded"

        if os.path.isfile(self.filename) == True:
            os.remove(self.filename)

