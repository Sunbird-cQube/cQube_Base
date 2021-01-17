from Data.parameters import Data
from reuse_func import GetData


class Diksha_page():
    def __init__(self,driver):
        self.driver = driver

    def test_navigation(self):
        self.data = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        if "diksha-chart" in self.driver.current_url:
            print("Diksha chart page is Displayed")
        else:
            print("Diksha page is not exist ")
        self.data.page_loading(self.driver)

