import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class crc_schoolevel_records():

    def __init__(self,driver):
        self.driver = driver

    def remove_csv1(self):
        os.remove(self.filename)

    def check_csv_download(self):
        p = pwd()
        self.cal = GetData()
        self.fname =file_extention()
        self.driver.implicitly_wait(60)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        for x in range(int(len(select_district.options))-1, int(len(select_district.options))):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            for y in range(len(select_block.options)-1, len(select_block.options)):
                select_block.select_by_index(y)
                self.cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    self.cal.page_loading(self.driver)
                    nodata = self.driver.find_element_by_id("errMsg").text
                    if nodata == "No data found":
                        print(select_district.options[x].text,select_block.options[y].text,select_cluster.options[z].text,"no data found!")
                        count = count + 1
                    else:
                        self.driver.find_element_by_id(Data.Download).click()
                        time.sleep(3)
                        self.filename = p.get_download_dir() + '/' + self.fname.crc_clusterwise()
                        if not os.path.isfile(self.filename):
                            print(select_cluster.options[z].text ," csv file not downloaded")
                        else:
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

                            self.remove_csv1()

        return count

