
from Data.parameters import Data
from reuse_func import GetData


class Home():
    def __init__(self, driver):
        self.driver = driver

    def click_HomeButton(self):
            self.driver.find_element_by_id(Data.homeicon).click()
            cal = GetData()
            cal.page_loading(self.driver)
            return self.driver.page_source

    def click_on_blocks_click_on_home_icon(self):
        self.driver.find_element_by_id(Data.SAR_Blocks_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)




