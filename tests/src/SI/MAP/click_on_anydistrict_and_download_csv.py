import time


from Data.parameters import Data
from reuse_func import GetData


class download_icon():
    def __init__(self,driver):
        self.driver = driver

    def test_donwload(self):
        self.p =GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.scm_dist).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        self.p.page_loading(self.driver)

