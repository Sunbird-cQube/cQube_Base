import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data

from get_dir import pwd
from reuse_func import GetData


class click_on_hyperlinks():
    def __init__(self,driver):
        self.driver = driver

    def test_hyperlink(self):
        self.p = GetData()
        self.driver.implicitly_wait(30)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_name("myDistrict"))
        dist.select_by_index(1)
        self.p.page_loading(self.driver)
        block = Select(self.driver.find_element_by_name("myBlock"))
        block.select_by_index(1)
        self.p.page_loading(self.driver)
        cluster = Select(self.driver.find_element_by_name("myCluster"))
        cluster.select_by_index(1)
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.school_hyper).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.cluster_hyper).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.dist_hyper).click()
        self.p.page_loading(self.driver)


