import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class download_clusterwise_csv():
    def __init__(self,driver):
        self.driver = driver
        self.filename =''
    def test_clusterwise(self):
        self.driver.implicitly_wait(20)
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        p =pwd()
        District_wise=Select(self.driver.find_element_by_id("downloader"))
        District_wise.select_by_visible_text(" Cluster Wise Report ")
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/Cluster_level_CRC_Report.csv"
        self.p.page_loading(self.driver)
        return os.path.isfile(self.filename)

    def remove_file(self):
        os.remove(self.filename)

