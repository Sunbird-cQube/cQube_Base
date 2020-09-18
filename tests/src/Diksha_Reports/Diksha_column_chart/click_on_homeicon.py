

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class Diksha_column_homeicon():
    def __init__(self,driver):
        self.driver = driver

    def test_homeicon(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        choose = Select(self.driver.find_element_by_id('coll_type'))
        choose.select_by_index(2)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        self.data.page_loading(self.driver)
