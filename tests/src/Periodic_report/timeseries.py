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
            for j in range(1,len(dist.options)):
                dist.select_by_index(j)
                time.sleep(2)
                markers = self.driver.find_elements_by_class_name(Data.dots)
                dots = len(markers) -1
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(4)
                self.filename = p.get_download_dir() + '/' + self.fname.pat_districtwise()
                time.sleep(2)
                if os.path.isfile(self.filename) !=True:
                    print( dist.options[i],"district csv file not downloaded ")
                    count = count + 1
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        total = 0
                        schools = 0
                        for row in csv.reader(fin):
                            total += int(row[4].replace(',',''))
                            schools += int(row[5].replace(',',''))
                        students = self.driver.find_element_by_id("students").text
                        res = re.sub('\D', "", students)

                        school = self.driver.find_element_by_id("schools").text
                        sc = re.sub('\D', "", school)
                        if int(res) != total:
                            print("student count mismatched")
                            count = count + 1
                        if int(sc) != schools:
                            print("school count mismatched")
                            count = count + 1
                    os.remove(self.filename)
            return count
