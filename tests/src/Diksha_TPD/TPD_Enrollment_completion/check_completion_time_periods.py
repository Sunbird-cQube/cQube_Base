import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class completion_time_periods():
    def __init__(self,driver):
        self.driver = driver

    def test_completion_overall(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        course_type = Select(self.driver.find_element_by_id(Data.coursetype))
        course_type.select_by_visible_text(' Completion ')
        self.data.page_loading(self.driver)
        timeseries = Select(self.driver.find_element_by_name(Data.timeperiods))
        timeseries.select_by_visible_text(' Overall ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print('No Data Available for Over All')
        else:
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(5)
            self.filename = self.p.get_download_dir() + '/all_completion_data.csv'
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_id(Data.coll_names))
            counter = len(collnames.options)-1
            for i in range(1,len(collnames.options)-1):
                collnames.select_by_index(i)
                self.data.page_loading(self.driver)
            if os.path.isfile(self.filename) != True:
                print('Completion Over all csv file is not downloaded ')
                count = count + 1
            self.data.page_loading(self.driver)
            os.remove(self.filename)
            return counter,count

    def test_completion_last_day(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        course_type = Select(self.driver.find_element_by_id(Data.coursetype))
        course_type.select_by_visible_text(' Completion ')
        self.data.page_loading(self.driver)
        timeseries = Select(self.driver.find_element_by_name(Data.timeperiods))
        timeseries.select_by_visible_text(' Last Day ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print('No Data Available for last day')
        else:
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = self.p.get_download_dir() + '/all_completion_data.csv'
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_id(Data.coll_names))
            counter = len(collnames.options)-1
            for i in range(1,len(collnames.options)-1):
                collnames.select_by_index(i)
                self.data.page_loading(self.driver)
            if os.path.isfile(self.filename) != True:
                print('Completion last day csv file is not downloaded ')
                count = count + 1
            self.data.page_loading(self.driver)
            os.remove(self.filename)
            # return counter,count

    def test_completion_last7_days(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        course_type = Select(self.driver.find_element_by_id(Data.coursetype))
        course_type.select_by_visible_text(' Completion ')
        self.data.page_loading(self.driver)
        timeseries = Select(self.driver.find_element_by_name(Data.timeperiods))
        timeseries.select_by_visible_text(' Last 7 Days ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print('No Data Available for last 7 days')
        else:
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(4)
            self.filename = self.p.get_download_dir() + '/all_completion_data.csv'
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_id(Data.coll_names))
            counter = len(collnames.options) - 1
            for i in range(1, len(collnames.options) - 1):
                collnames.select_by_index(i)
                self.data.page_loading(self.driver)
            if os.path.isfile(self.filename) != True:
                print('Completion last 7 days csv file is not downloaded ')
                count = count + 1
            self.data.page_loading(self.driver)
            os.remove(self.filename)
            # return counter, count

    def test_completion_last30_days(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        course_type = Select(self.driver.find_element_by_id(Data.coursetype))
        course_type.select_by_visible_text(' Completion ')
        self.data.page_loading(self.driver)
        timeseries = Select(self.driver.find_element_by_name(Data.timeperiods))
        timeseries.select_by_visible_text(' Last 30 Days ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print('No Data Available for last 30 days')
        else:
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = self.p.get_download_dir() + '/all_completion_data.csv'
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_id(Data.coll_names))
            counter = len(collnames.options) - 1
            for i in range(1, len(collnames.options) - 1):
                collnames.select_by_index(i)
                self.data.page_loading(self.driver)
            if os.path.isfile(self.filename) != True:
                print('Completion last 30 days csv file is not downloaded ')
                count = count + 1
            self.data.page_loading(self.driver)
            os.remove(self.filename)
            # return counter, count
