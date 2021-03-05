import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Check_Districtwise():
    def __init__(self,driver):
        self.driver = driver

    def test_coursetype_with_all_districts(self):
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.implicitly_wait(100)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        Districts = Select(self.driver.find_element_by_id(Data.sar_district))
        course_type = Select(self.driver.find_element_by_id(Data.coursetype))
        time = (self.driver.find_element_by_id('time_range').text).strip()
        for i in range(1, len(course_type.options)):
            course_type.select_by_index(i)
            self.data.page_loading(self.driver)
            cname = course_type.options[i].text
            course = cname.strip()
            for j in range(len(Districts.options)-5,len(Districts.options)):
                Districts.select_by_index(j)
                self.data.page_loading(self.driver)
                self.driver.find_element_by_id(Data.Download).click()
                self.data.page_loading(self.driver)
                dname = self.driver.find_element_by_id(Data.sar_district).get_attribute('value')
                value = dname[4:] + '_'

                self.filename = self.p.get_download_dir()+"/"+"enrollment_completion_"+course.lower()+'_overall'+'_'+value.strip()+self.data.get_current_date()+".csv"
                print(self.filename)
                if os.path.isfile(self.filename) != True:
                    print(course_type.options[i].text, Districts.options[j].text, 'csv file not downloaded')
                    count = count + 1
                    self.data.page_loading(self.driver)
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        enrolls = 0
                        for row in csv.reader(fin):
                            enrolls += int(row[8].replace(',',''))
                        totalenrollment = self.driver.find_element_by_id("totalCount").text
                        enrol = re.sub('\D', "", totalenrollment)
                        if int(enrol) != int(enrolls):
                            print(int(enrol) != int(enrolls),'mis match found at enrollment count')
                            count = count + 1
                os.remove(self.filename)
        return count


















