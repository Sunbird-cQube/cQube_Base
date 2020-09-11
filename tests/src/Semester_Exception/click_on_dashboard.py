import time

from Data.parameters import Data
from reuse_func import GetData


class sem_dashboard():
    def __init__(self, driver):
        self.driver = driver

    def test_click_on_dashboard(self):
        count = 0
        cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        cal.page_loading(self.driver)
        cal.navigate_to_semester_exception()
        cal.page_loading(self.driver)
        if 'sem-exception' in self.driver.current_url:
            print("Semester exception report is present ")
        else:
            print("Semester exception is not exist")
            count = count + 1
        return count
