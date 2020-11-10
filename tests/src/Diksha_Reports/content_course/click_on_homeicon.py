

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

    def test_homebutton(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        self.data.navigate_to_diksha_content_course()
        self.data.page_loading(self.driver)

    def test_searchbox(self):
        count = 0
        self.data = GetData()
        self.data.page_loading(self.driver)
        search = self.driver.find_element_by_xpath("//*[@id='table_filter']/label/input")
        search.send_keys('Mathematics')
        self.data.page_loading(self.driver)
        if 'Mathematics' in self.driver.page_source:
            print("Search box is working ")
        else:
            print('Search box is not working')
            count = count + 1
        return count