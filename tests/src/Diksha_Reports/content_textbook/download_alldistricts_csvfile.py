import csv
import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class course_districtwise_records():
    def __init__(self,driver):
        self.driver = driver

    def test_alldata_districts(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = self.p.get_download_dir() + "/" + 'Diksha_All_Data_all.csv'
        file = os.path.isfile(self.filename)
        self.data.page_loading(self.driver)
        with open(self.filename) as fin:
            csv_reader = csv.reader(fin, delimiter=',')
            header = next(csv_reader)
            data = list(csv_reader)
            row_count = len(data)
        os.remove(self.filename)
        tablecount = self.driver.find_elements_by_tag_name('tr')
        records = int(len(tablecount)) - 2
        time.sleep(2)
        if row_count != records:
            print("records count mismatch in downloaded file and table records")
            count = count + 1
        return count
