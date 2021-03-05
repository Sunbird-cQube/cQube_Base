import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class timeseries():
    def __init__(self,driver):
        self.driver =driver

    def test_options_times(self):
        data = GetData()
        data.page_loading(self.driver)
        times = Select(self.driver.find_element_by_id('period'))
        count = len(times.options)
        return count

    def time_over_all(self):
        data = GetData()
        p = pwd()
        count =0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        data.page_loading(self.driver)
        dist =Select(self.driver.find_element_by_id('choose_dist'))
        times = Select(self.driver.find_element_by_id('period'))
        for i in range(1,len(times.options)):
            times.select_by_index(i)
            time.sleep(3)
            if '' in self.driver.page_source:
                print(times.options[i].text,'has no data found')
            else:
                for j in range(1,len(dist.options)):
                    dist.select_by_index(j)
                    value = self.driver.find_element_by_id('choose_dist').get_attribute('value')
                    value = value[3:]+'_'
                    time.sleep(2)
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    dots = len(markers) -1
                    self.driver.find_element_by_id(Data.Download).click()
                    time.sleep(4)
                    self.filename = p.get_download_dir() + '/' + self.fname.pat_districtwise()+value.strip()+data.get_current_date()+'.csv'
                    print(self.filename)
                    time.sleep(2)
                    if os.path.isfile(self.filename) !=True:
                        print( dist.options[i],"district csv file not downloaded ")
                        count = count + 1
                    else:
                        markers = self.driver.find_element_by_class_name(Data.dots)
                        dots = len(markers) - 1
                        with open(self.filename) as fin:
                            csv_reader = csv.reader(fin, delimiter=',')
                            header = next(csv_reader)
                            data = list(csv_reader)
                            row_count = len(data)
                            if int(dots) != row_count:
                                print("Markers and csv file records count mismatched", dots, row_count)
                                count = count + 1
                        os.remove(self.filename)
            return count
