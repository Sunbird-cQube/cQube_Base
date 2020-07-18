import time


from Data.parameters import Data
from reuse_func import GetData


class School_infra_options():
    def __init__(self,driver):
        self.driver = driver

    def test_options(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.School_infra).click()
        self.p.page_loading(self.driver)
        report = self.driver.find_element_by_id(Data.Report).text
        mapreport = self.driver.find_element_by_id(Data.Reportmap).text
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Reportmap).click()
        return report , mapreport



