
from selenium.common import exceptions

from Data.parameters import Data
from reuse_func import GetData


class click_on_logout():
    def __init__(self,driver):
        self.driver =driver
    def test_logout(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        try:
            self.driver.find_element_by_xpath(Data.hyper_link).click()
            self.p.page_loading(self.driver)
            self.driver.find_element_by_id(Data.logout).click()
            self.p.page_loading(self.driver)
            return self.driver.title
        except exceptions.ElementClickInterceptedException:
            print("logout is working ")

