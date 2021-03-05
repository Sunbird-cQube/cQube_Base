import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Download_districtwise():

    def __init__(self,driver):
        self.driver = driver

    def download_all_district_records(self):
        self.p = pwd()
        cal = GetData()
        count = 0
        self.fname = file_extention()
        # self.year,self.month = cal.pat_month_and_year_values()
        year = Select(self.driver.find_element_by_id('year'))
        month = Select(self.driver.find_element_by_id('month'))
        self.year = (year.first_selected_option.text).strip()
        self.month = (month.first_selected_option.text).strip()
        self.driver.find_element_by_id(Data.home).click()
        cal.page_loading(self.driver)
        cal.navigate_to_heatchart_report()
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + '/' + self.fname.pchart_all_districts()+self.month+'_'+self.year+'_'+cal.get_current_date()+'.csv'
        print(self.filename)
        if os.path.isfile(self.filename) != True:
                print("Districtwise csv file is not downloaded")
        else:
             print('District wise csv file is downloaded ')
        os.remove(self.filename)
        cal.page_loading(self.driver)
        return count



