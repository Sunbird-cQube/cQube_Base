import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class Click_on_each_districts():
    def __init__(self,driver):
        self.driver = driver

    def test_districtlist(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        Districts = Select(self.driver.find_element_by_id('choose_dist'))
        self.p.page_loading(self.driver)
        count = 0
        for i in range(1,len(Districts.options)):
            Districts.select_by_index(i)
            self.p.page_loading(self.driver)
            markers = self.driver.find_elements_by_class_name(Data.dots)
            value = len(markers)-1
            self.p.page_loading(self.driver)
            if value == 0:
                print(Districts.options[i].text , " does not have markers on map")
                count = count + 1
        return count

