import time

from Data.parameters import Data
from reuse_func import GetData


class Home():
    def __init__(self, driver):
        self.driver = driver

    def click_on_blocks_click_on_home_icon(self):
        cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.block_btn).click()
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        cal.page_loading(self.driver)


    def click_HomeButton(self):
        count = 0
        cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        cal.page_loading(self.driver)
        if 'dashboard' in self.driver.current_url:
            print('Landing page is displayed')
        else:
            print('Home btn is not working ')
            count = count + 1
        cal.page_loading(self.driver)
        return count






