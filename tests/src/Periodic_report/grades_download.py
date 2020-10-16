


import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class periodic_grades_downlaod():
    def __init__(self, driver):
        self.driver = driver

    def check_grade_dropdown_options(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade =Select(self.driver.find_element_by_id(Data.Grade))
        counter = len(grade.options)-1
        if counter > 0:
            print("Grade drop down having options ")
        else:
            print("Grade dropdown does not contains options ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        return count

    def click_each_grades(self):
        self.data = GetData()
        count = 0
        p = pwd()
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade =Select(self.driver.find_element_by_id(Data.Grade))
        for i in range(1,len(grade.options)):
            time.sleep(2)
            grade.select_by_index(i)
            print(grade.options[i].text)
            self.data.page_loading(self.driver)
            dots = self.driver.find_elements_by_class_name(Data.dots)
            markers = len(dots)-1
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = p.get_download_dir() + "/" + self.fname.pat_district()
            if os.path.isfile(self.filename) != True:
                return "File Not Downloaded"
            else:
                file = open(self.filename)
                d = file.read()
                os.remove(self.filename)
                if grade.options[i].text in d:
                    print(grade.options[i].text ,"is present")
                self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)

    def select_subjects_dropdown(self):
        self.data = GetData()
        count = 0
        p = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade = Select(self.driver.find_element_by_id(Data.Grade))
        subjects = Select(self.driver.find_element_by_id(Data.Subject))
        subcount = len(subjects.options)-1
        for i in range(1,len(grade.options)):
            grade.select_by_index(i)
            self.data.page_loading(self.driver)
            print(grade.options[i].text)
            for j in range(1,len(subjects.options)):
                grade.select_by_index(j)
                self.data.page_loading(self.driver)
                print(subjects.options[j].text)
                self.driver.find_element_by_id(Data.Download).click()
                self.filename = p.get_download_dir() + '/Dist_wise_report.csv'
                if os.path.isfile(self.filename) != True:
                    print('District wise csv file is not downloaded')
                else:
                    file = open(self.filename)
                    read = file.read()
                    if grade.options[j].text in read:
                        print(grade.options[j].text, "is present")
                    self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)


