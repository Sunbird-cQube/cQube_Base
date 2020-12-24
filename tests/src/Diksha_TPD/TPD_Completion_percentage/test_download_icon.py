import os
import time

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Click_download_icon():
    def __init__(self,driver):
        self.driver = driver

    def test_check_download_icon(self):
        self.data = GetData()
        count = 0
        self.p = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename =self.p.get_download_dir() + '/overall_data.csv'
        if os.path.isfile(self.filename) != True:
            print('Districtwise csv file is not downloaded')
            count = count + 1
        self.data.page_loading(self.driver)
        os.remove(self.filename)
        return count
