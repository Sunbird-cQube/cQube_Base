

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class Diksha_column_homeicon():
    def __init__(self,driver):
        self.driver = driver

    def test_homeicon(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        choose = Select(self.driver.find_element_by_name('timePeriod'))
        choose.select_by_index(2)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        self.data.page_loading(self.driver)

    def test_homebutton(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        # self.data.navigate_to_column_course()
        self.driver.find_element_by_id('dcc').click()
        self.data.page_loading(self.driver)
        if 'usage-by-course' in self.driver.current_url:
            print('Home button is working')
        else:
            print("Home button is not working ")
            count = count + 1
        return count
