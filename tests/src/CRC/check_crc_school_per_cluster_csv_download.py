import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class crc_schoollevel():

    def __init__(self, driver):
        self.driver = driver

    def test_schoollevel(self):
        self.cal = GetData()
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        p =pwd()
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                self.cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    self.cal.page_loading(self.driver)
                    self.driver.find_element_by_id('download').click()
                    time.sleep(2)
                    filename = p.get_download_dir() + "/School_level_CRC_Report.csv"
                    self.cal.page_loading(self.driver)
                    if os.path.isfile(filename) != True:
                        print("District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "csv is not downloaded")
                        count = count + 1
                    if os.path.isfile(filename) == True:
                        os.remove(filename)
        return count
