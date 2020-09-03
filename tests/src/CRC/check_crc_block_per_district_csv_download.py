import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class blockwise():

    def __init__(self, driver):
        self.driver = driver
        self.filename =''

    def test_blocklevel(self):
        self.cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            self.driver.find_element_by_id('download').click()
            time.sleep(3)
            p = pwd()
            self.filename = p.get_download_dir() + "/Block_level_CRC_Report.csv"
            self.cal.page_loading(self.driver)
            if os.path.isfile(self.filename) != True:
                print("District" + select_district.first_selected_option.text + "csv is not downloaded")
                count = count + 1
            if os.path.isfile(self.filename) == True:
                os.remove(self.filename)
        self.cal.page_loading(self.driver)
        return count
