from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class Diksha_column_hyperlink():
    def __init__(self,driver):
        self.driver = driver

    def test_hyperlink(self):
        self.data = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        district  =Select(self.driver.find_element_by_name('timePeriod'))
        district.select_by_index(2)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)

