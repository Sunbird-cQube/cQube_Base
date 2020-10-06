import csv
import os
import re
import time
import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class ClusterwiseCsv():

    def __init__(self, driver):
        self.driver = driver

    def click_download_icon_of_clusters(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.cluster_btn).click()
        cal.page_loading(self.driver)
        markers = self.driver.find_elements_by_class_name(Data.dots)
        dots = len(markers)-1
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(10)
        p = pwd()
        count = 0
        self.filename = p.get_download_dir() + "/Cluster_wise_report.csv"
        if os.path.isfile(self.filename) != True:
            return "File Not Downloaded"
        if os.path.isfile(self.filename) == True:
            os.remove(self.filename)
        return dots


