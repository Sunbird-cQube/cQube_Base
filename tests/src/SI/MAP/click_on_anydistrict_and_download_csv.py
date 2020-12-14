import csv
import os
import re
import time


from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class download_icon():
    def __init__(self,driver):
        self.driver = driver

    def test_donwload(self):
        self.p =GetData()
        cal = pwd()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        time.sleep(2)
        self.p.navigate_to_school_infrastructure_map()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Download).click()
        time.sleep(3)
        self.filename = cal.get_download_dir() + '/' + self.fname.scmap_district()
        self.p.page_loading(self.driver)
        if not os.path.isfile(self.filename):
            print("Districtwise csv is not downloaded")
            count = count + 1
        else:
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                schools = 0
                for row in csv.reader(fin):
                    schools += int(row[0])
                school = self.driver.find_element_by_id("schools").text
                sc = re.sub('\D', "", school)
                print( int(sc) , int(schools))
                if int(sc) != int(schools):
                    print("school count mismatched")
                    count = count + 1
            os.remove(self.filename)
        return  count


