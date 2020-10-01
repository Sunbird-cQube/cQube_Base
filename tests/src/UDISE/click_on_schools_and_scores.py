import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class schools_btn_scores():
    def __init__(self,driver):
        self.driver = driver

    def test_click_schools(self):
        self.p = GetData()
        count =0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id('school').click()
        time.sleep(15)
        scores = Select(self.driver.find_element_by_id("choose_infra"))
        for i in range(1,len(scores.options)):
            # scores.select_by_index(i)
            print(scores.options[i].text,"is selected as indices")
            markers = self.driver.find_elements_by_class_name(Data.dots)
            dots = len(markers) - 1
            if dots == 0:
                print(scores.options[i].text, 'does not contains markers on map ')
                count = count + 1
        self.p.page_loading(self.driver)
        return count