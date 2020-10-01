from selenium.webdriver.support.select import Select

from Data.parameters import Data
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
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        grade =Select(self.driver.find_element_by_id(Data.Grade))
        for i in range(len(grade.options)):
            grade.select_by_index(i)
            dots = self.driver.find_elements_by_class_name(Data.dots)
            markers = len(dots)-1
            self.data.page_loading(self.driver)
            print(grade.options[i].text)
            self.data.page_loading(self.driver)
        print("clicking on each grades ")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def select_subjects_dropdown(self):
        self.data = GetData()
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
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def check_subject_dropdown(self):
        self.data = GetData()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.data.page_loading(self.driver)
        grade =Select(self.driver.find_element_by_id(Data.Grade))
        grade.select_by_index(1)
        subjects = Select(self.driver.find_element_by_id(Data.Subject))
        self.data.page_loading(self.driver)
        subcount = len(subjects.options) - 1
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        return subcount
