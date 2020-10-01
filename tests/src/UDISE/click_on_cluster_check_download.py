import os
import time


from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class clusterwise_download():
    def __init__(self,driver):
        self.driver =driver

    def test_download(self):
        self.p = GetData()
        cal = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.scm_cluster).click()
        self.p.page_loading(self.driver)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        count =len(dots)-1
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(5)
        self.filename = cal.get_download_dir() + '/Cluster_wise_report.csv'
        self.p.page_loading(self.driver)
        file = os.path.isfile(self.filename)
        return file,count

