
import time
from selenium.webdriver.support.select import Select
from Data.parameters import Data
from reuse_func import GetData


class test_Graph():
    def __init__(self ,driver):
        self.driver =driver

    def test_xaxis(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        xaxis_lists = Select(self.driver.find_element_by_id('x_axis'))
        self.p.page_loading(self.driver)
        count = len(xaxis_lists.options) - 1
        return count

    def test_yaxis(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        xaxis_lists = Select(self.driver.find_element_by_id('y_axis'))
        self.p.page_loading(self.driver)
        count = len(xaxis_lists.options) - 1
        return count

    def test_xplots(self):
        self.driver.implicitly_wait(30)
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_id("choose_dist"))
        dist.select_by_index(5)
        self.p.page_loading(self.driver)
        xaxis_lists = Select(self.driver.find_element_by_id('x_axis'))
        for i in range(len(xaxis_lists.options)):
            time.sleep(2)
            xaxis_lists.select_by_index(i)
            self.p.page_loading(self.driver)
        self.p.page_loading(self.driver)

    def test_yplots(self):
        self.driver.implicitly_wait(30)
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_id("choose_dist"))
        dist.select_by_index(5)
        self.p.page_loading(self.driver)
        yaxis_lists = Select(self.driver.find_element_by_id('y_axis'))
        for i in range(len(yaxis_lists.options)):
            time.sleep(2)
            yaxis_lists.select_by_index(i)
            self.p.page_loading(self.driver)
        self.p.page_loading(self.driver)