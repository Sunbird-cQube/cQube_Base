
from Data.parameters import Data
from reuse_func import GetData


class check_dashboard():
    def __init__(self,driver):
        self.driver = driver

    def test_menulist(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.School_infra).click()
        self.driver.find_element_by_id(Data.Report).click()
        self.p.page_loading(self.driver)
