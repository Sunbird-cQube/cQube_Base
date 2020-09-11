import time

from Data.parameters import Data
from reuse_func import GetData


class si_report():
    def __init__(self,driver):
        self.driver = driver
    def test_url(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        print("school infra report page")
        self.p.page_loading(self.driver)


