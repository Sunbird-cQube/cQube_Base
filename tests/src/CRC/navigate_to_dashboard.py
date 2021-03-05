from Data.parameters import Data
from reuse_func import GetData

class Dashboard_menu():
    def __init__(self,driver):
        self.driver = driver
    def test_dashboard(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        title = self.driver.find_element_by_id(Data.Dashboard).text
        self.p.navigate_to_crc_report()
        self.p.page_loading(self.driver)
        return title


