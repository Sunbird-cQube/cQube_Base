
import csv
import os
import re
import time
from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Schoolwise_footers():

    def __init__(self, driver):
        self.driver = driver

    def check_with_footers(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.schoolbtn).click()
        time.sleep(10)
        markers = self.driver.find_elements_by_class_name(Data.dots)
        dots = len(markers )-1
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(15)
        p = pwd()
        count = 0
        self.filename = p.get_download_dir() + "/School_wise_report.csv"
        if os.path.isfile(self.filename) != True:
            return "File Not Downloaded"
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                tschools = 0
                tstudents = 0
                for row in csv.reader(fin):
                     # tschools += int(row[5])
                     tstudents += int(row[9])
                # totalschools = self.driver.find_element_by_id("schools").text
                # schools = re.sub('\D', "", totalschools)

                totalstudents = self.driver.find_element_by_id('students').text
                students = re.sub('\D' ,"" ,totalstudents)

                # if int(schools )!= int(tschools):
                #     print("School level footer value mis match found !" ,int(schools) ,"!=" ,int(tschools))
                #     count = count + 1

                if int(students )!= int(tstudents):
                    print("school level footer value mis match found !" ,int(students) ,"!=" ,int(tstudents))
                    count = count + 1



        os.remove(self.filename)
        return dots , count

