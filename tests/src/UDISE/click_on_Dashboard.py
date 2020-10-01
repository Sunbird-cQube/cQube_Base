import time

from Data.parameters import Data
from reuse_func import GetData


class click_dashboard_udise_report():
    def __init__(self,driver):
        self.driver = driver
    def test_dashboard(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.udise_drop).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.udise_report).click()
        self.p.page_loading(self.driver)
        count = 0
        if 'udise-report' in self.driver.current_url:
            print('UDISE map report is displayed')
        else:
            print('UDISE map report is not displayed')
            count = count + 1
        return count
