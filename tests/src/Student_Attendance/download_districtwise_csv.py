import csv
import os
import re
import time

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class DistrictwiseCsv():

    def __init__(self, driver,year,month):
        self.driver = driver
        self.year = year.strip()
        self.month =month.strip()

    def click_download_icon_of_district(self):
        cal = GetData()
        count = 0
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        p = pwd()
        self.filename = p.get_download_dir() + "/District_wise_report_"+self.month+"_"+self.year+".csv"
        if not os.path.isfile(self.filename):
            print("Districtwise csv is not downloaded")
            count = count + 1
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                total = 0
                schools = 0
                for row in csv.reader(fin):
                    total += int(row[3])
                    schools += int(row[4])
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
        return  count