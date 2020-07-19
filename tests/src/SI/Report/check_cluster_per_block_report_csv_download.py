import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class clusterlevel_csv():
    def __init__(self,driver):
        self.driver = driver
        self.filename =''
    def test_search(self):
        self.p = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        count = 0
        p =pwd()
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.p.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                self.driver.find_element_by_id('download').click()
                self.p.page_loading(self.driver)
                self.filename = p.get_download_dir() + "/clusterPerBlock_report.csv"
                if os.path.isfile(self.filename) != True:
                    print("District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "csv is not downloaded")
                    count = count + 1
                if os.path.isfile(self.filename) == True:
                    os.remove(self.filename)
        return count







