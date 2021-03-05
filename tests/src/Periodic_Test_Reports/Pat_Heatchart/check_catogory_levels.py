import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Catagory_series():
    def __init__(self,driver):
        self.driver = driver

    def viewbys_options(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        year = Select(self.driver.find_element_by_id('year'))
        month = Select(self.driver.find_element_by_id('month'))
        self.year = (year.first_selected_option.text).strip()
        self.month = (month.first_selected_option.text).strip()

        grades = Select(self.driver.find_element_by_id(Data.grade))
        grades.select_by_index(2)
        gradename = grades.options[2].text
        gradenum = re.sub('\D','',gradename).strip()
        self.load.page_loading(self.driver)

        view_by = Select(self.driver.find_element_by_id(Data.view_by))
        view_by.select_by_visible_text(' Question Id ')
        self.load.page_loading(self.driver)
        self.load.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + "/" + self.fname.pchart_views() + gradenum + '_' + Data.question_id + self.month + '_' \
                        + self.year + '_' + self.load.get_current_date() + '.csv'
        print(self.filename)
        if os.path.isfile(self.filename) != True:
            print(Data.question_id, 'csv file is not downloaded')
            count = count + 1
        view_by.select_by_visible_text(' Indicator ')
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.file = self.p.get_download_dir() + "/" + self.fname.pchart_views() + gradenum + '_' + Data.indicator_id + self.month + '_' \
                    + self.year + '_' + self.load.get_current_date() + '.csv'
        print(self.file)
        if os.path.isfile(self.file) != True:
            print(Data.indicator_id, 'csv file is not downloaded')
            count = count + 1

        os.remove(self.filename)
        os.remove(self.file)
        return count



    def test_questions_records(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        grade = Select(self.driver.find_element_by_id(Data.grade))
        grade.select_by_index(2)
        self.load.page_loading(self.driver)
        view_by = Select(self.driver.find_element_by_id(Data.view_by))
        view_by.select_by_index(1)
        self.load.page_loading(self.driver)
        if view_by.options[1].text in self.driver.page_source:
            print(view_by.options[1].text, 'is displayed records in heat chart')
        else:
            print(view_by.options[1].text, 'Records are not displayed')
            count = count + 1
        self.load.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + "/" + self.fname.pchart_views()
        if os.path.isfile(self.filename) != True:
            print(view_by.options[1].text, 'csv file is not downloaded')
            count = count + 1
        else:
            print(view_by.options[1].text, 'csv file is downloaded')
        os.remove(self.filename)
        return count

    def test_indicator_records(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        grade = Select(self.driver.find_element_by_id(Data.grade))
        grade.select_by_index(4)
        self.load.page_loading(self.driver)
        view_by = Select(self.driver.find_element_by_id(Data.view_by))
        view_by.select_by_visible_text(' Indicator ')
        self.load.page_loading(self.driver)
        if view_by.options[2].text in self.driver.page_source:
            print(view_by.options[2].text, 'is displayed records in heat chart')
        else:
            print(view_by.options[2].text, 'Records are not displayed')
            count = count + 1
        self.load.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + "/Grade_wise_report.csv"
        if os.path.isfile(self.filename) != True:
            print(view_by.options[2].text, 'csv file is not downloaded')
            count = count + 1
        else:
            print(view_by.options[2].text, 'csv file is downloaded')
        os.remove(self.filename)
        return count
