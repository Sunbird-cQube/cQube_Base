import time



from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class click_on_home():
    def __init__(self,driver):
        self.driver = driver


    def test_homeicon(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        dist = Select(self.driver.find_element_by_name("myDistrict"))
        dist.select_by_index(2)
        self.p.page_loading(self.driver)
        block = Select(self.driver.find_element_by_name("myBlock"))
        block.select_by_index(2)
        self.p.page_loading(self.driver)
        cluster = Select(self.driver.find_element_by_name("myCluster"))
        cluster.select_by_index(2)
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        self.p.page_loading(self.driver)


