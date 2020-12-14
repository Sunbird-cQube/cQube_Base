import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class donwload_blockwise_csv():
    def __init__(self,driver):
        self.driver = driver

    def test_blockwise(self):
        p =pwd()
        self.cal  = GetData()
        self.fname = file_extention()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.cal.page_loading(self.driver)
        District_wise=Select(self.driver.find_element_by_id("downloader"))
        District_wise.select_by_visible_text(" Block Wise Report ")
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = p.get_download_dir() + '/' + self.fname.crc_block()
        return os.path.isfile(self.filename)
    def remove_file(self):
        os.remove(self.filename)

