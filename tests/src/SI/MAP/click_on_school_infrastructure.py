
from Data.parameters import Data
from reuse_func import GetData


class School_infra_test():
    def __init__(self,driver):
        self.driver = driver

    def test_dashboard_option(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.School_infra).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Reportmap).click()
        self.p.page_loading(self.driver)



   