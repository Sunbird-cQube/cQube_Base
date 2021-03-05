
from Data.parameters import Data
from reuse_func import GetData


class exception_Home():
    def __init__(self, driver):
        self.driver = driver

    def click_on_blocks_click_on_home_icon(self):
        self.driver.find_element_by_id('block').click()
        cal = GetData()
        count = 0
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        cal = GetData()
        cal.page_loading(self.driver)
        if 'sem-exception' in self.driver.current_url:
            print("Semester exception report is present ")
        else:
            print("Semester exception is not exist")
            count = count + 1
        return count





