import csv
import os
import re
import time
from selenium.webdriver.support.select import Select
from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class course_records():

    def __init__(self,driver):
        self.driver = driver

    def courserecords_of_last30days(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_name('timePeriod'))
        timeperiod.select_by_visible_text(' Last 30 Days ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print("Last 30 days dont have records")
        else:
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_name('collectionName'))
            for i in range(1, len(collnames.options)):
                time.sleep(1)
                collnames.select_by_index(i)
                name = "collectionType_textbook_data_of" + collnames.options[i].text
                fname = name.replace(' ', '_')
                time.sleep(2)
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                cname = fname.rstrip('_')
                print(fname, "fname" , cname ,"cname")
                self.filename = self.p.get_download_dir() + '/' + cname + '.csv'
                file = os.path.isfile(self.filename)
                if file == True:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        content = 0
                        for row in csv.reader(fin):
                            content += int(row[4])
                        usage = self.driver.find_element_by_id("totalCount").text
                        tsc = re.sub('\D', "", usage)
                        if int(tsc) != content:
                            print(collnames.options[i].text, ":", int(content), int(tsc),
                                  "usage content  mismatch found")
                            count = count + 1
                    os.remove(self.filename)
                else:
                    alname = fname[:-1] + '.csv'
                    print('current fname', alname)
                    self.filename = self.p.get_download_dir() + '/' + alname
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        content = 0
                        for row in csv.reader(fin):
                            content += int(row[4])
                        usage = self.driver.find_element_by_id("totalCount").text
                        tsc = re.sub('\D', "", usage)
                        if int(tsc) != content:
                            print(collnames.options[i].text, ":", int(content), int(tsc),
                                  "usage content  mismatch found")
                            count = count + 1
                    os.remove(self.filename)
        return count

    def courserecords_of_last7days(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_name('timePeriod'))
        timeperiod.select_by_visible_text(' Last 7 Days ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print("Last 7 days dont have records")
        else:
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_name('collectionName'))
            for i in range(1,len(collnames.options)):
                time.sleep(1)
                collnames.select_by_index(i)
                name = "collectionType_textbook_data_of"+collnames.options[i].text
                fname = name.replace(' ','_')
                time.sleep(2)
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                cname = fname.rstrip('_')
                print(cname ,"cname")
                self.filename = self.p.get_download_dir()+'/'+cname+'.csv'
                file = os.path.isfile(self.filename)
                if file == True:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        content = 0
                        for row in csv.reader(fin):
                            content += int(row[4])
                        usage = self.driver.find_element_by_id("totalCount").text
                        tsc = re.sub('\D', "", usage)
                        if int(tsc) != content:
                            print(collnames.options[i].text, ":", int(content), int(tsc),
                                  "usage content  mismatch found")
                            count = count + 1
                    os.remove(self.filename)
                else:
                    alname = fname[:-1] +'.csv'
                    print('current fname',alname)
                    self.filename = self.p.get_download_dir() + '/' +alname
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        content = 0
                        for row in csv.reader(fin):
                            content += int(row[4])
                        usage = self.driver.find_element_by_id("totalCount").text
                        tsc = re.sub('\D', "", usage)
                        if int(tsc) != content:
                            print(collnames.options[i].text, ":", int(content), int(tsc),
                                  "usage content  mismatch found")
                            count = count + 1
                    os.remove(self.filename)
        return count

    def courserecords_of_lastday(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        timeperiod = Select(self.driver.find_element_by_name('timePeriod'))
        timeperiod.select_by_visible_text(' Last Day ')
        self.data.page_loading(self.driver)
        if ' No Data Available ' in self.driver.page_source:
            print("Last day dont have records")
        else:
            self.data.page_loading(self.driver)
            collnames = Select(self.driver.find_element_by_name('collectionName'))
            for i in range(1, len(collnames.options)):
                time.sleep(1)
                collnames.select_by_index(i)
                name = "collectionType_textbook_data_of" + collnames.options[i].text
                fname = name.replace(' ', '_')
                time.sleep(2)
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                cname = fname.rstrip('_')
                print(cname, "cname")
                self.filename = self.p.get_download_dir() + '/' + cname + '.csv'
                file = os.path.isfile(self.filename)
                if file == True:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        content = 0
                        for row in csv.reader(fin):
                            content += int(row[4])
                        usage = self.driver.find_element_by_id("totalCount").text
                        tsc = re.sub('\D', "", usage)
                        if int(tsc) != content:
                            print(collnames.options[i].text, ":", int(content), int(tsc),
                                  "usage content  mismatch found")
                            count = count + 1
                    os.remove(self.filename)
                else:
                    alname = fname[:-1] + '.csv'
                    print('current fname', alname)
                    self.filename = self.p.get_download_dir() + '/' + alname
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        content = 0
                        for row in csv.reader(fin):
                            content += int(row[4])
                        usage = self.driver.find_element_by_id("totalCount").text
                        tsc = re.sub('\D', "", usage)
                        if int(tsc) != content:
                            print(collnames.options[i].text, ":", int(content), int(tsc),
                                  "usage content  mismatch found")
                            count = count + 1
                    os.remove(self.filename)
        return count