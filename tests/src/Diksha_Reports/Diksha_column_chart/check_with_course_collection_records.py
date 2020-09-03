import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from reuse_func import GetData


class course_records():

    def __init__(self,driver):
        self.driver = driver

    def courserecords_of_last30days(self):
        self.data = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        colltype = Select(self.driver.find_element_by_name('collection_type'))
        colltype.select_by_visible_text(' Course ')
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_name('timePeriod'))
        timeperiod.select_by_visible_text(' Last 30 Days ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print("Last 30 days dont have records")
        else:
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_name('collectionName'))
            colnames = len(collnames.options) - 1
            for i in range(len(collnames.options)):
                collnames.select_by_index(i)
                time.sleep(2)
            return colnames

    def courserecords_of_last7days(self):
        self.data = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        colltype = Select(self.driver.find_element_by_name('collection_type'))
        colltype.select_by_visible_text(' Course ')
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_name('timePeriod'))
        timeperiod.select_by_visible_text(' Last 7 Days ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print("Last 7 days dont have records")
        else:
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_name('collectionName'))
            colnames = len(collnames.options) - 1
            for i in range(len(collnames.options)):
                collnames.select_by_index(i)
                time.sleep(2)
            return colnames

    def courserecords_of_lastday(self):
        self.data = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        colltype = Select(self.driver.find_element_by_name('collection_type'))
        colltype.select_by_visible_text(' Course ')
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_name('timePeriod'))
        timeperiod.select_by_visible_text(' Last Day ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print("Last day dont have records")
        else:
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_name('collectionName'))
            colnames = len(collnames.options) - 1
            for i in range(len(collnames.options)):
                collnames.select_by_index(i)
                time.sleep(2)
            return colnames