from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Random_test():
    def __init__(self,driver):
        self.driver = driver

    def test_randoms(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)

        grades = Select(self.driver.find_element_by_id(Data.grade))
        grades.select_by_index(4)
        if grades.options[4].text in self.driver.page_source:
            print(grades.options[4].text, 'is displayed in chart ')
            self.load.page_loading(self.driver)
        else:
            print(grades.options[4].text, 'is not displayed ')
            count = count + 1
        subject = Select(self.driver.find_element_by_id(Data.subjects))
        subject.select_by_index(3)
        if subject.options[3].text in self.driver.page_source:
            print(subject.options[3].text, 'is displayed in chart ')
            self.load.page_loading(self.driver)
        else:
            print(subject.options[3].text, 'is not displayed ')
            count = count + 1
        self.load.page_loading(self.driver)

        grades = Select(self.driver.find_element_by_id(Data.grade))
        grades.select_by_index(3)
        if grades.options[3].text in self.driver.page_source:
            print(grades.options[3].text, 'is displayed in chart ')
            self.load.page_loading(self.driver)
        else:
            print(grades.options[3].text, 'is not displayed ')
            count = count + 1
        subject = Select(self.driver.find_element_by_id(Data.subjects))
        subject.select_by_index(2)
        if subject.options[2].text in self.driver.page_source:
            print(subject.options[2].text, 'is displayed in chart ')
            self.load.page_loading(self.driver)
        else:
            print(subject.options[2].text, 'is not displayed ')
            count = count + 1
        self.load.page_loading(self.driver)
        return count
