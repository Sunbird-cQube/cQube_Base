import time

from Data.parameters import Data
from reuse_func import GetData


class check_with_graph():
    def __init__(self,driver):
        self.driver = driver

    def test_graph(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        if "myChart" in self.driver.page_source:
            print("Scattor plot is present")
        else:
            print("Scattor plot is not present")
        self.p.page_loading(self.driver)
