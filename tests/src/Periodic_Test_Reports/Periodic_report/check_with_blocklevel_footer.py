
import csv
import os
import re
import time


from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Block_level_footers():

    def __init__(self, driver):
        self.driver = driver

    def check_with_footervalues(self):
        cal = GetData()
        files = file_extention()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.block_btn).click()
        cal.page_loading(self.driver)
        marker = self.driver.find_elements_by_class_name(Data.dots)
        counts = len(marker ) -1
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        p = pwd()
        count = 0
        self.filename = p.get_download_dir() + "/"+files.pat_block()+cal.get_current_date()+'.csv'
        print(self.filename)
        if os.path.isfile(self.filename) != True:
            return "File Not Downloaded"
        else:
            markers = self.driver.find_elements_by_class_name(Data.dots)
            dots = len(markers) - 1
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                data = list(csv_reader)
                row_count = len(data)
                if int(dots) != row_count:
                    print("Markers and csv file records count mismatched", dots, row_count)
                    count = count + 1
            os.remove(self.filename)
        return counts , count
