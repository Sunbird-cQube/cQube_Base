import re
from Data.parameters import Data
from reuse_func import GetData


class Data_not_recieved():
    def __init__(self, driver):
        self.driver = driver

    def test_total_not_recieved_data(self):
        cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        cal.page_loading(self.driver)

        school_not_recived = self.driver.find_element_by_id('schools').text
        notcount = re.sub("\D", "",school_not_recived)

        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.driver.find_element_by_id('block').click()
        cal.page_loading(self.driver)
        blockcount = self.driver.find_element_by_id('schools').text
        bcount = re.sub("\D", "",blockcount)
        cal.page_loading(self.driver)

        self.driver.find_element_by_id('cluster').click()
        cal.page_loading(self.driver)
        clustcount = self.driver.find_element_by_id('schools').text
        clustercount = re.sub("\D", "", clustcount)
        cal.page_loading(self.driver)

        self.driver.find_element_by_id('school').click()
        cal.page_loading(self.driver)
        sccount = self.driver.find_element_by_id('schools').text
        schoolcount = re.sub("\D", "", sccount)
        cal.page_loading(self.driver)

        return  notcount , bcount , clustercount,schoolcount





