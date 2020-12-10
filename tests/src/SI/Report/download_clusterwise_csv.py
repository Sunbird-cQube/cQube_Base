import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class donwload_clusterwise_csv():
    def __init__(self,driver):
        self.driver = driver

    def test_clusterwise(self):
        self.p = GetData()
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        p =pwd()
        District_wise=Select(self.driver.find_element_by_name("downloadType"))
        District_wise.select_by_index(3)
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download_scator).click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/" + self.fname.sc_cluster()
        self.p.page_loading(self.driver)
        return os.path.isfile(self.filename)

    def remove_csv(self):
        os.remove(self.filename)


