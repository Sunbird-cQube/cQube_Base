import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class block_btn_scores():
    def __init__(self,driver):
        self.driver = driver

    def test_click_blocks(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id('block').click()
        count = 0
        self.p.page_loading(self.driver)
        scores = Select(self.driver.find_element_by_id("choose_infra"))
        for i in range(1,len(scores.options)-1):
            time.sleep(2)
            scores.select_by_index(i)
            time.sleep(3)
            markers = self.driver.find_elements_by_class_name(Data.dots)
            dots = len(markers)-1
            if dots == 0:
                # print(scores.options[i].text , 'does not contains markers on map ')
                count = count + 1
        self.p.page_loading(self.driver)
        return count