import csv
import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class school_blockwise():

    def __init__(self,driver):
        self.driver = driver

    def test_blockwise(self):
        p = pwd()
        self.cal = GetData()
        self.driver.implicitly_wait(60)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                self.cal.page_loading(self.driver)
                nodata = self.driver.find_element_by_id("errMsg").text
                if nodata == "No data found":
                    print(select_block.options[y].text, "no data found!")
                    count = count + 1
                else:
                    self.driver.find_element_by_id(Data.Download).click()
                    time.sleep(3)
                    self.filename = p.get_download_dir() + "/clusterPerBlock_report.csv"
                    if not os.path.isfile(self.filename):
                        print(select_block.options[y].text,"csv file is not downloaded")
                    else:
                        with open(self.filename) as fin:
                            csv_dict = [row for row in csv.DictReader(self.filename)]
                            if len(csv_dict) == 0:
                                print(select_district.options[y].text,"Does not Table records")
                        os.remove(self.filename)
        return count

