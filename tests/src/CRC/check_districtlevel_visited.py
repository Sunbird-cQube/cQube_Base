import csv
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData

class districtwise_visits():
    def __init__(self, driver):
        self.driver = driver

    def test_districtwise_schoolvisited(self):
        p = pwd()
        self.cal = GetData()
        self.driver.implicitly_wait(20)
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            self.driver.find_element_by_id(Data.Download).click()
            time.sleep(3)
            self.filename = p.get_download_dir() + "/Block_level_CRC_Report.csv"
            count = 0
            with open(self.filename) as fin:
                csv_reader = csv.reader(fin, delimiter=',')
                header = next(csv_reader)
                tschools = 0
                vsts = 0
                vstd = 0
                for row in csv.reader(fin):
                    tschools += int(row[0])
                    vsts += int(row[2])
                    vstd += int(row[1])
                totalschools = self.driver.find_element_by_id("schools").text
                visited = self.driver.find_element_by_id("visited").text
                visits = self.driver.find_element_by_id("visits").text
                tsc = re.sub('\D', "", totalschools)
                vs = re.sub('\D', "", visits)
                vd = re.sub('\D', "", visited)
                if int(tsc) != tschools:
                    print(select_district.options[x].text, ":", "total no of schools  :", tschools,
                          int(tsc), "records are mismatch found")
                    count = count + 1
                if int(vs) != vsts:
                    print(select_district.options[x].text, ":", "total no of visits  :", int(vs), vsts,
                          "records are mismatch found")
                    count = count + 1
                if int(vd) != vstd:
                    print(select_district.options[x].text, ":", "total no of visits  :", int(vd), vstd,
                          "records are mismatch found")
                    count = count + 1

        return count
