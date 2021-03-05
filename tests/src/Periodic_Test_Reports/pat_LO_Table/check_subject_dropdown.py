import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class subject_levels():
    def __init__(self ,driver):
        self.driver = driver

    def subjects_types(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_id(Data.home).click()
        self.load.page_loading(self.driver)
        self.load.navigate_to_lo_table_report()
        self.load.page_loading(self.driver)
        self.year ,self.month = self.load.get_pat_month_and_year_values()
        grade = Select(self.driver.find_element_by_id(Data.grade))
        grade.select_by_index(4)
        gradename = (grade.options[4].text).strip()
        gradenum = re.sub('\D', '', gradename)
        self.load.page_loading(self.driver)
        subject = Select(self.driver.find_element_by_id(Data.subjects))
        for i in range(2, len(subject.options)):
            subject.select_by_index(i)
            self.load.page_loading(self.driver)
            if subject.options[i].text in self.driver.page_source:
                print(subject.options[i].text, 'is displayed chart table ')
                self.load.page_loading(self.driver)
            else:
                print(subject.options[i].text, 'is not displayed ')
                count = count + 1
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = self.p.get_download_dir() + '/' + self.fname.patlo_subjects() + gradenum + '_' + (
                subject.options[i].text).strip() + \
                            '_allDistricts_' + self.month + '_' + self.year + '_' + self.load.get_current_date() + '.csv'
            print(self.filename)
            if os.path.isfile(self.filename) != True:
                print(subject.options[i].text, 'csv file is not downloaded')
                count = count + 1
            self.load.page_loading(self.driver)
            os.remove(self.filename)
        return count


