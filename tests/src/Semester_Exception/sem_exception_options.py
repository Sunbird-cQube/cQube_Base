import os

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class sem_options():
    def __init__(self,driver):
        self.driver = driver

    def sem_exception_options_test(self):
        self.data = GetData()
        p = pwd()
        count = 0
        fname = file_extention()
        choose = Select(self.driver.find_element_by_id('choose_semester'))
        choose.select_by_index(1)
        if 'no data found' in self.driver.page_source:
            print("Semester 1 has not data")
        self.driver.find_element_by_id(Data.Download).click()
        self.filename = p.get_download_dir() + '/' + fname.exception_district()
        if os.path.isfile(self.filename) == True:
            print('districtwise csv file download')
            count = count + 1
        return count