import csv
import os
import re
import time
import unittest

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class check_DistrictwiseCsv():

    def __init__(self, driver):
        self.driver = driver

    def click_download_csv_of_districts(self):
        cal = GetData()
        count = 0
        self.fname = file_extention()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        p = pwd()
        self.filename = p.get_download_dir() + "/" + self.fname.exception_district()
        cal.page_loading(self.driver)
        if not os.path.isfile(self.filename):
            print("Districtwise csv is not downloaded")
            count = count + 1
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                schools = 0
                for row in csv.reader(fin):
                    schools += int(row[3])
                school = self.driver.find_element_by_id("schools").text
                sc = re.sub('\D', "", school)
                if int(sc) != int(schools):
                    print("school count mismatched",int(sc) , int(schools))
                    count = count + 1
            os.remove(self.filename)
        return count


