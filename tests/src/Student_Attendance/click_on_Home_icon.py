import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Home():
    def __init__(self, driver):
        self.driver = driver

    def click_HomeButton(self):
            self.driver.find_element_by_id(Data.home).click()
            cal = GetData()
            cal.page_loading(self.driver)
            cal.navigate_to_student_report()
            return self.driver.current_url

    def click_on_blocks_click_on_home_icon(self):
        self.driver.find_element_by_id(Data.SAR_Blocks_btn).click()
        cal = GetData()
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.homeicon).click()
        cal.page_loading(self.driver)

    #Student_Acedemic dropdown

    def check_academic_dropdown_is_present(self):
        cal = GetData()
        cal.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        cal.page_loading(self.driver)
        academic = Select(self.driver.find_element_by_id('academicYear'))
        options = len(academic.options)-1
        return options

    def check_academic_dropdown_options(self):
        cal = GetData()
        count = 0
        cal.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        cal.page_loading(self.driver)
        academic = Select(self.driver.find_element_by_id('academicYear'))
        options = len(academic.options) - 1
        for i in range(1,len(academic.options)):
            academic.select_by_index(i)
            print(academic.options[i].text,'is selected')
            count = count + 1
            time.sleep(2)
        cal.page_loading(self.driver)
        return count

    def download_yearwise_files_by_academic_year(self):
        cal = GetData()
        count = 0
        p = pwd()
        cal.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        cal.page_loading(self.driver)
        file = file_extention()
        academic = Select(self.driver.find_element_by_id('academicYear'))
        options = len(academic.options) - 1
        for i in range(1, len(academic.options)):
            academic.select_by_index(i)
            print(academic.options[i].text, 'is selected')
            self.driver.find_element_by_id('downloadRaw').click()
            time.sleep(5)
            self.filename = p.get_download_dir() +"/" + file.student_academic_files()+(academic.options[i].text).strip()+'.csv'
            print(self.filename)
            if os.path.isfile(self.filename) != True:
                print(academic.options[i].text,"academic csv file is not download")
                count = count + 1
            cal.page_loading(self.driver)
        return count


