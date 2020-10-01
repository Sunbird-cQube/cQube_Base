import os
import time



from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Blockwise_csv_download():
    def __init__(self,driver):
         self.driver = driver
    def test_download_blockwise(self):
        self.p = GetData()
        cal = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.scm_block).click()
        self.p.page_loading(self.driver)
        markers = self.driver.find_elements_by_class_name(Data.dots)
        self.p.page_loading(self.driver)
        dots = len(markers)-1
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(4)
        self.filename = cal.get_download_dir() + '/Block_wise_report.csv'
        self.p.page_loading(self.driver)
        file = os.path.isfile(self.filename)
        return file ,dots

