import os
import time

from selenium.common import exceptions
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class school_wise_donwload():
    def __init__(self,driver):
        self.driver = driver

    def test_schoolwise(self):
        self.data = GetData()
        self.fname =file_extention()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.data.page_loading(self.driver)
        try:
            p = pwd()
            District_wise=Select(self.driver.find_element_by_name("downloadType"))
            District_wise.select_by_index(4)
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download_scator).click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/" + self.fname.sc_school()
            time.sleep(10)
            return os.path.isfile(self.filename)

        except exceptions.NoSuchElementException:
            print("school wise csv downloaded")

    def remove_csv(self):
        os.remove(self.filename)

