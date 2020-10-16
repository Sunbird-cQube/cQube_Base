import csv
import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Test_schoolwise():
    def __init__(self,driver):
        self.driver = driver
    def remove_csv1(self):
        os.remove(self.filename)
    def check_csv_download1(self):
        p = pwd()
        self.cal = GetData()
        self.fname =file_extention()
        self.driver.implicitly_wait(50)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        for x in range(int(len(select_district.options))-1, int(len(select_district.options))):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            print(select_district.options[x].text)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                self.cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    self.cal.page_loading(self.driver)
                    nodata = self.driver.find_element_by_id("errMsg").text
                    if nodata == "No data found":
                        print(select_district.options[x].text,select_block.options[y],select_cluster.options[z].text, "no data found!")
                        count = count + 1
                    else:
                        self.driver.find_element_by_id(Data.Download).click()
                        time.sleep(3)
                        self.filename = p.get_download_dir() + "/" + self.fname.sc_clusterwise()
                        if not os.path.isfile(self.filename):
                            print(select_cluster.options[z].text,"csv is not downloaded..")
                        else:
                            with open(self.filename) as fin:
                                csv_dict = [row for row in csv.DictReader(self.filename)]
                                if len(csv_dict) == 0:
                                    print(select_district.options[z].text,"does not contain Table records")
                            self.remove_csv1()
        return  count

