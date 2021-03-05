import time
from selenium.webdriver.support.select import Select
from Data.parameters import Data
from reuse_func import GetData


class plot_values():
    def __init__(self,driver):
        self.driver =driver

    def test_plots(self):
        self.driver.implicitly_wait(30)
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_id("dist"))
        dist.select_by_index(5)
        self.p.page_loading(self.driver)
        xaxis_lists = Select(self.driver.find_element_by_id('x_axis'))
        yaxis_lists = Select(self.driver.find_element_by_id('y_axis'))
        count1 = len(xaxis_lists.options)-1
        count2 = len(yaxis_lists.options)-1
        for i in range(len(xaxis_lists.options)):
            time.sleep(2)
            xaxis_lists.select_by_index(i)
            self.p.page_loading(self.driver)

        for i in range(len(yaxis_lists.options)):
            time.sleep(2)
            yaxis_lists.select_by_index(i)
            self.p.page_loading(self.driver)
        return count1,count2
