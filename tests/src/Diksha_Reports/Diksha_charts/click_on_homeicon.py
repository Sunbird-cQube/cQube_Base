

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class Diksha_homeicon():
    def __init__(self,driver):
        self.driver = driver

    def test_homeicon(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        district  =Select(self.driver.find_element_by_id('choose_dist'))
        district.select_by_index(4)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        if "home" in self.driver.current_url:
            print("Navigated to landing page")
        else:
            print('Home button is not working')
            count = count + 1
        self.data.navigate_to_diksha_graph()
        self.data.page_loading(self.driver)
        return count