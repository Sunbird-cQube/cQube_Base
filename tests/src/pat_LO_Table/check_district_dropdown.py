import csv
import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class districtwise():
    def __init__(self, driver):
        self.driver = driver

    def District_select_box(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        dists = Select(self.driver.find_element_by_id(Data.district_dropdown))
        view_by = Select(self.driver.find_element_by_id(Data.view_by))
        for j in range(len(view_by.options)):
            view_by.select_by_index(j)
            self.load.page_loading(self.driver)
            for i in range(len(dists.options)-3, len(dists.options)):
                dists.select_by_index(i)
                self.load.page_loading(self.driver)
                time.sleep(2)
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                self.filename = self.p.get_download_dir() + '/' + self.fname.pchart_blocks()
                file = os.path.isfile(self.filename)
                if file != True:
                    print(dists.options[i].text,'District wise records csv file is not downloaded')
                    count = count + 1
                self.load.page_loading(self.driver)
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
                    print(dists.options[i].text, "records count mismatch in downloaded file and table records")
                    count = count + 1

        return count
