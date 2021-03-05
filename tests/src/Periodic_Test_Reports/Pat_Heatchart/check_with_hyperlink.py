import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class heatchart_hyperlink():
    def __init__(self,driver):
        self.driver = driver

    def click_on_hyperlinks(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_id(Data.district_dropdown))
        dist.select_by_index(1)
        self.p.page_loading(self.driver)
        block = Select(self.driver.find_element_by_id(Data.blocks_dropdown))
        block.select_by_index(1)
        self.p.page_loading(self.driver)
        cluster = Select(self.driver.find_element_by_id(Data.cluster_dropdown))
        cluster.select_by_index(1)
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.school_hyper).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.cluster_hyper).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.dist_hyper).click()
        self.p.page_loading(self.driver)
        result1 = self.driver.find_element_by_id(Data.blocks_dropdown).is_displayed()
        self.p.page_loading(self.driver)
        result2 = self.driver.find_element_by_name(Data.cluster_dropdown).is_displayed()
        self.p.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_name(Data.district_dropdown))
        choose_dist = dist.first_selected_option.text
        self.p.page_loading(self.driver)
        return result1, result2, choose_dist

    def test_hypers(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        examdates = Select(self.driver.find_element_by_id('grade'))
        examdates.select_by_index(4)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
