import csv
import os
import re
import time


from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Block_level_records():

    def __init__(self, driver):
        self.driver = driver

    def click_download_icon_of_blocks(self):
        cal = GetData()
        self.fname = file_extention()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.block_btn).click()
        cal.page_loading(self.driver)
        marker = self.driver.find_elements_by_class_name(Data.dots)
        counts = len(marker)-1
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        p = pwd()
        count = 0
        self.filename = p.get_download_dir() + "/" + self.fname.pat_block()
        if os.path.isfile(self.filename) != True:
            return "File Not Downloaded"
        if os.path.isfile(self.filename) == True:
            os.remove(self.filename)
        return counts
