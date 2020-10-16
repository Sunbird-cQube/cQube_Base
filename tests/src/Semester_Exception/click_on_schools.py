import os
import time

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class semeste_schools():
    def __init__(self, driver):
        self.driver = driver

    def check_markers_on_school_map(self):
        self.driver.find_element_by_id('school').click()
        cal = GetData()
        self.fname = file_extention()
        cal.page_loading(self.driver)
        result= self.driver.find_elements_by_class_name(Data.dots)
        cal.page_loading(self.driver)
        markers = len(result) - 1
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.exception_school()
        if os.path.isfile(self.filename) != True:
            return "File Not Downloaded"
        if os.path.isfile(self.filename) == True:
            os.remove(self.filename)
        return markers
