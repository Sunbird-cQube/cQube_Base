import os
import time
from selenium.webdriver.support.select import Select
from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData

class download_districtwise():
    def __init__(self,driver):
        self.driver = driver

    def test_donwload(self):
        p = pwd()
        self.cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.cal.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_name("myDistrict"))
        dist.select_by_index(10)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = p.get_download_dir() + "/blockPerDistrict_report.csv"
        self.cal.page_loading(self.driver)
        return os.path.isfile(self.filename)

    def remove_csv(self):
        os.remove(self.filename)

