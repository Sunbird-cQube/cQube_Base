import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class test_course_based_on_timeperiods():
    def __init__(self,driver):
        self.driver = driver

    def test_last30_days(self):
        self.data = GetData()
        self.p = pwd()
        self.msg = file_extention()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeperiod =Select(self.driver.find_element_by_name('timePeriod'))
        # timeperiod.select_by_visible_text(' Last 30 Days ')
        timeperiod.select_by_index(3)
        self.data.page_loading(self.driver)
        if self.msg.no_data_available() in self.driver.page_source:
            print("Last 30 days does not having data")
        else:
            self.driver.find_element_by_id('download').click()
            time.sleep(3)
            self.filename = self.p.get_download_dir() + "/"+'usage_by_textbook_all_'+self.data.get_current_date()+".csv"
            print(self.filename)
            if not os.path.isfile(self.filename):
                print("Diksha course type of  last 30 days data csv file not downloaded")
            else:
                with open(self.filename) as fin:
                    csv_reader = csv.reader(fin, delimiter=',')
                    header = next(csv_reader)
                    contentplays = 0
                    for row in csv.reader(fin):
                        contentplays += int(row[0])
                    play_count = self.driver.find_element_by_id('totalCount').text
                    pc = re.sub('\D', "", play_count)
                    if int(pc) != int(contentplays):
                        print("Course type of last 30 days has difference between screen count value and csv file count ")
                        count = count + 1
                    self.data.page_loading(self.driver)
                os.remove(self.filename)
        return count

    def test_last7_days(self):
        self.data = GetData()
        self.p = pwd()
        self.msg = file_extention()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_name('timePeriod'))
        # timeperiod.select_by_visible_text(' Last 30 Days ')
        timeperiod.select_by_index(2)
        self.data.page_loading(self.driver)
        if self.msg.no_data_available() in self.driver.page_source:
            print("Last 7 days does not having data")
        else:
            self.driver.find_element_by_id('download').click()
            time.sleep(3)
            self.filename = self.p.get_download_dir() + "/"+'usage_by_textbook_all_'+self.data.get_current_date()+".csv"
            print(self.filename)
            if not os.path.isfile(self.filename):
                print("Diksha course type of  last 30 days data csv file not downloaded")
            else:
                with open(self.filename) as fin:
                    csv_reader = csv.reader(fin, delimiter=',')
                    header = next(csv_reader)
                    contentplays = 0
                    for row in csv.reader(fin):
                        contentplays += int(row[0])
                    play_count = self.driver.find_element_by_id('totalCount').text
                    pc = re.sub('\D', "", play_count)
                    if int(pc) != int(contentplays):
                        print("Course type of last 30 days has difference between screen count value and csv file count ")
                        count = count + 1
                    self.data.page_loading(self.driver)
                os.remove(self.filename)
        return count

    def test_last_day(self):
        self.data = GetData()
        self.p = pwd()
        self.msg = file_extention()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_name('timePeriod'))
        # timeperiod.select_by_visible_text(' Last 30 Days ')
        timeperiod.select_by_index(1)
        self.data.page_loading(self.driver)
        if self.msg.no_data_available() in self.driver.page_source:
            print("Last day does not having data")
        else:
            self.driver.find_element_by_id('download').click()
            time.sleep(3)
            self.filename = self.p.get_download_dir() + "/"+'usage_by_textbook_all_'+self.data.get_current_date()+".csv"
            print(self.filename)
            if not os.path.isfile(self.filename):
                print("Diksha course type of  last 30 days data csv file not downloaded")
            else:
                with open(self.filename) as fin:
                    csv_reader = csv.reader(fin, delimiter=',')
                    header = next(csv_reader)
                    contentplays = 0
                    for row in csv.reader(fin):
                        contentplays += int(row[0])
                    play_count = self.driver.find_element_by_id('totalCount').text
                    pc = re.sub('\D', "", play_count)
                    if int(pc) != int(contentplays):
                        print("Course type of last 30 days has difference between screen count value and csv file count ")
                        count = count + 1
                    self.data.page_loading(self.driver)
                os.remove(self.filename)
        return count
