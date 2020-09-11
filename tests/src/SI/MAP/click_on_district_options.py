

from Data.parameters import Data
from reuse_func import GetData


class District_options():
    def __init__(self,driver):
        self.driver = driver
    def test_options(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        Districts = self.driver.find_elements_by_xpath(Data.sc_choosedist)
        count = len(Districts)-1
        for i in range(len(Districts)):
            Districts[i].click()
            self.p.page_loading(self.driver)
            print(Districts[i].text)

        return count
