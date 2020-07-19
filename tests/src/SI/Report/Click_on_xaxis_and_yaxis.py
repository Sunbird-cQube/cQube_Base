
from selenium.common import exceptions
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class Graph_values():
    def __init__(self,driver):
        self.driver =driver

    def test_plots(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        try:
            x_axis = Select(self.driver.find_element_by_id(Data.x))
            y_axis = Select(self.driver.find_element_by_id(Data.y))
            self.p.page_loading(self.driver)
            for x in range(1, len(x_axis.options)):
                x_axis.select_by_index(x)
                self.p.page_loading(self.driver)
            for y in range(1, len(y_axis.options)):
                    y_axis.select_by_index(y)
                    self.p.page_loading(self.driver)
        except exceptions.NoSuchElementException:
            print("Both x and y axis are selectable ")


