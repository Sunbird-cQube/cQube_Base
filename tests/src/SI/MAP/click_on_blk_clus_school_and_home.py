import time


from Data.parameters import Data
from reuse_func import GetData


class click_on_home():
    def __init__(self,driver):
        self.driver =driver
    def test_home(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)

        self.driver.find_element_by_id(Data.scm_block).click()
        self.p.page_loading(self.driver)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        self.p.page_loading(self.driver)
        count1 = len(dots) - 1

        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.scm_cluster).click()
        self.p.page_loading(self.driver)
        time.sleep(20)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        self.p.page_loading(self.driver)
        count2 = len(dots) - 1
        self.p.page_loading(self.driver)

        self.driver.find_element_by_id(Data.scm_school).click()
        self.p.page_loading(self.driver)
        time.sleep(30)
        dots = self.driver.find_elements_by_class_name(Data.dots)
        self.p.page_loading(self.driver)
        count3 = len(dots) - 1
        self.driver.find_element_by_id(Data.homeicon).click()
        self.p.page_loading(self.driver)
        return count1 , count2 ,count3
