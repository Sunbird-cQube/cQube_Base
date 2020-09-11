
from Data.parameters import Data
from reuse_func import GetData


class click_cluster_and_home():
    def __init__(self,driver):
        self.driver=driver
    def test_cluster(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.scm_dist).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.scm_blk).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.scm_clust).click()
        self.p.page_loading(self.driver)
        lists = self.driver.find_elements_by_class_name(Data.dots)
        count = len(lists)-1
        self.driver.find_element_by_id(Data.homeicon).click()
        self.p.page_loading(self.driver)
        return count