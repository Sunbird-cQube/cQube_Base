
from Data.parameters import Data
from reuse_func import GetData


class click_schoolinfra():
    def __init__(self,driver):
        self.driver = driver
    def test_schoolinfra(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
