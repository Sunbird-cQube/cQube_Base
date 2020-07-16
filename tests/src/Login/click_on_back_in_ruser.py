from Data.parameters import Data
from reuse_func import GetData


class test_backbtn():
    def __init__(self,driver):
        self.driver = driver

    def test_ruser_back(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("lnk").click()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.back_btn).click()
        self.cal.page_loading(self.driver)

