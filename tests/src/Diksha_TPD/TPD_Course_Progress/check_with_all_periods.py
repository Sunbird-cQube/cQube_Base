import csv
import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Time_periods():
    def __init__(self,driver):
        self.driver = driver

    def check_last_day_districtwise_download(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        periods = Select(self.driver.find_element_by_id(Data.timeperiods))
        periods.select_by_visible_text(' Last Day ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + "/" + self.fname.lpd_districts()
        if os.path.isfile(self.filename) != True:
            print('Last Day Districtwise csv file is not downloaded ')
            count = count + 1
        else:
            print('Last day districtwise csv file is downloaded')
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                data = list(csv_reader)
                row_count = len(data)
            os.remove(self.filename)
            time.sleep(2)
            if row_count == 0:
                print("records are not found in csv file ")
                count = count + 1
        return count

    def check_last_30_day_districtwise_download(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        periods = Select(self.driver.find_element_by_id(Data.timeperiods))
        periods.select_by_visible_text(' Last 30 Days ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + "/" + self.fname.lpd_districts()
        if os.path.isfile(self.filename) != True:
            print('Last Day Districtwise csv file is not downloaded ')
            count = count + 1
        else:
            print('Last day districtwise csv file is downloaded')
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                data = list(csv_reader)
                row_count = len(data)
            os.remove(self.filename)
            time.sleep(2)
            if row_count == 0:
                print("records are not found in csv file ")
                count = count + 1
        return count

    def check_last_7_days_districtwise_download(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        periods = Select(self.driver.find_element_by_id(Data.timeperiods))
        periods.select_by_visible_text(' Last 7 Days ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + "/" + self.fname.lpd_districts()
        if os.path.isfile(self.filename) != True:
            print('Last Day Districtwise csv file is not downloaded ')
            count = count + 1
        else:
            print('Last day districtwise csv file is downloaded')
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                data = list(csv_reader)
                row_count = len(data)
            os.remove(self.filename)
            time.sleep(2)
            if row_count == 0:
                print("records are not found in csv file ")
                count = count + 1
        return count

    def check_all_districtwise_download(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + "/" + self.fname.lpd_districts()
        if os.path.isfile(self.filename) != True:
            print('All Districtwise csv file is not downloaded ')
            count = count + 1
        else:
            print('All districtwise csv file is downloaded')
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                data = list(csv_reader)
                row_count = len(data)
            os.remove(self.filename)
            time.sleep(2)
            if row_count == 0:
                print("records are not found in csv file ")
                count = count + 1
        return count