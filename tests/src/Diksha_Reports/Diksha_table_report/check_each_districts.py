import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class district_list():
    def __init__(self,driver):
        self.driver = driver

    def test_each_districts(self):
        self.data = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        districts  =Select(self.driver.find_element_by_id('choose_dist'))
        count = len(districts.options) - 1
        for x in range(1,len(districts.options)):
            districts.select_by_index(x)
            print(districts.options[x].text)
            self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)
        return count
