from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class Semester_options():
    def __init__(self, driver):
        self.driver = driver

    def test_semester_option(self):
        self.data = GetData()
        count = 0
        self.data.page_loading(self.driver)
        sem = Select(self.driver.find_element_by_id('choose_semester'))
        sem.select_by_visible_text(' Semester 2 ')
        self.data.page_loading(self.driver)
        if ' Semester 2 ' in self.driver.page_source:
            print('Semester 2 is selected ')
        else:
            print('semester 2 is not selected')
            count = count + 1
        self.data.page_loading(self.driver)
        markers = self.driver.find_elements_by_class_name(Data.dots)
        sum = len(markers)-1
        return count , sum

