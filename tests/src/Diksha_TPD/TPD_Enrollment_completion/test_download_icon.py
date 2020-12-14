import csv
import os
import re
import time

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Click_download_icon():
    def __init__(self,driver):
        self.driver = driver

    def test_check_download_icon(self):
        self.data = GetData()
        count = 0
        self.p = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename =self.p.get_download_dir() + '/all_enrollment_data.csv'
        if os.path.isfile(self.filename) != True:
            print('Districtwise csv file is not downloaded')
            count = count + 1
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                enrolls = 0
                for row in csv.reader(fin):
                    enrolls += int(row[6].replace(',',''))
                totalenrollment = self.driver.find_element_by_id("totalCount").text
                enrol = re.sub('\D', "", totalenrollment)
                if int(enrol) != int(enrolls):
                    print(int(enrol) != int(enrolls), 'mis match found at enrollment count')
                    count = count + 1
        os.remove(self.filename)
        return count

