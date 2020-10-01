import os
import time

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class udise_districts_csv():
    def __init__(self,driver):
        self.driver = driver
    def test_districtwise(self):
        self.p = GetData()
        cal = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = cal.get_download_dir() + '/District_wise_report.csv'
        self.p.page_loading(self.driver)
        file = os.path.isfile(self.filename)
        if True == file:
            print('Udise districtwise csv file is downloaded')
        else:
            print('Districtwise csv file is not downloaded ')
            count = count + 1
        self.p.page_loading(self.driver)
        return count
