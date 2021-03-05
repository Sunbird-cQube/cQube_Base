import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class grade_subject_dropdowns():
    def __init__(self, driver):
        self.driver = driver


    def check_grade_dropdown_options(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade =Select(self.driver.find_element_by_id(Data.Grade))
        counter = len(grade.options)
        for i in range(1,len(grade.options)):
            grade.select_by_index(i)
            print(grade.options[i].text)
            self.data.page_loading(self.driver)
        return counter

    def click_each_grades(self):
        self.data = GetData()
        count = 0
        p = pwd()
        files = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade =Select(self.driver.find_element_by_id(Data.Grade))
        for i in range(1,len(grade.options)):
            grade.select_by_index(i)
            gradename = (grade.options[i].text).strip()
            gradenum = re.sub('\D','',gradename)
            dots = self.driver.find_elements_by_class_name(Data.dots)
            markers = len(dots)-1
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = p.get_download_dir() + '/'+ files.sr_gradewise()+gradenum.strip()+'__alldistrict_'+self.data.get_current_date()+'.csv'
            print(self.filename)
            if os.path.isfile(self.filename) != True:
                print('Grade wise csv file is not downloaded')
                count = count + 1
            else:
                file = open(self.filename)
                read = file.read()
                os.remove(self.filename)
                if grade.options[i].text in read:
                    print(grade.options[i].text ,"is present")
                self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)
        return count

    def select_subjects_dropdown(self):
        self.data = GetData()
        p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade = Select(self.driver.find_element_by_id(Data.Grade))
        subjects = Select(self.driver.find_element_by_id(Data.Subject))
        subcount = len(subjects.options)-1
        files = file_extention()
        for i in range(1,len(grade.options)):
            grade.select_by_index(i)
            self.data.page_loading(self.driver)
            gradename = (grade.options[i].text).strip()
            gradenum = re.sub('\D','',gradename)
            for j in range(1,len(subjects.options)):
                subjects.select_by_index(j)
                self.data.page_loading(self.driver)
                sub = (subjects.options[j].text).strip()
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                self.filename = p.get_download_dir() + '/' + files.sr_gradewise()+gradenum.strip()+'_'+sub+'_alldistrict_' + self.data.get_current_date()+'.csv'
                print(self.filename)
                if os.path.isfile(self.filename) != True:
                    print(files.sr_gradewise()+gradenum.strip() ,' wise csv file is not downloaded')
                    count = count + 1

                os.remove(self.filename)
                self.data.page_loading(self.driver)
        return count


