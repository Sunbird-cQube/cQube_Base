import time

from Data.parameters import Data
from reuse_func import GetData


class CRC_report():
    def __init__(self,driver):
        self.driver = driver

    def test_crc_report(self):
        self.p = GetData()
        self.driver.implicitly_wait(10)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
