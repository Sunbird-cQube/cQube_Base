from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class scattor_graph():
    def __init__(self,driver):
        self.driver = driver

    def test_scattor_graph(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_id("dist"))
        dist.select_by_index(5)
        self.p.page_loading(self.driver)
        xaxis = Select(self.driver.find_element_by_id("x_axis"))
        yaxis = Select(self.driver.find_element_by_id("y_axis"))
        for i in range(len(xaxis.options)):
            xaxis.select_by_index(i)
        for j in range(len(yaxis.options)):
            yaxis.select_by_index(j)
        self.p.page_loading(self.driver)