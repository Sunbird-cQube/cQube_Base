from Data.parameters import Data
from reuse_func import GetData


class ruser():
    def __init__(self,driver):
        self.driver = driver

    def test_ruser_page(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id("lnk").click()
        if "Regular User" in self.driver.find_element_by_tag_name("h2").text:
            print("Regular user page is present ")
        else:
            print("Regular user page is not exists")
        self.driver.find_element_by_xpath(Data.back_btn).click()
        self.cal.page_loading(self.driver)