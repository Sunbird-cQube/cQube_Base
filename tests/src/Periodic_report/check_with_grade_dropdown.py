import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class periodic_grades():
    def __init__(self, driver):
        self.driver = driver

    def check_grade_dropdown_options(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade =Select(self.driver.find_element_by_id(Data.Grade))
        for i in range(1,len(grade.options)):
            grade.select_by_index(i)
            print(grade.options[i].text)
        counter = len(grade.options)
        self.data.page_loading(self.driver)

    def click_each_grades(self):
        self.data = GetData()
        count = 0
        p = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade =Select(self.driver.find_element_by_id(Data.Grade))
        for i in range(len(grade.options)):
            grade.select_by_index(i)
            dots = self.driver.find_elements_by_class_name(Data.dots)
            markers = len(dots)-1
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = p.get_download_dir() + '/Dist_wise_report.csv'
            if os.path.isfile(self.filename) != True:
                print('District wise csv file is not downloaded')
            else:
                file = open(self.filename)
                read = file.read()
                os.remove(self.filename)
                if grade.options[i].text in read:
                    print(grade.options[i].text ,"is present")
                self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)

    def select_subjects_dropdown(self):
        self.data = GetData()
        p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade = Select(self.driver.find_element_by_id(Data.Grade))
        subjects = Select(self.driver.find_element_by_id(Data.Subject))
        subcount = len(subjects.options)-1
        for i in range(len(grade.options)):
            grade.select_by_index(i)
            self.data.page_loading(self.driver)
            print(grade.options[i].text)
            for j in range(len(subjects.options)):
                grade.select_by_index(j)
                self.data.page_loading(self.driver)
                print(subjects.options[j].text)
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                self.filename = p.get_download_dir() + '/Dist_wise_report.csv'
                if os.path.isfile(self.filename) != True:
                    print('District wise csv file is not downloaded')
                else:
                    file = open(self.filename)
                    read = file.read()
                    os.remove(self.filename)
                    if grade.options[j].text in read:
                        print(grade.options[j].text, "is present")
        self.data.page_loading(self.driver)

