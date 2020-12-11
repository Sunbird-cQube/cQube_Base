import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class DistrictBlockCluster():
    def __init__(self, driver):
        self.driver = driver
    def remove_csv(self):
        os.remove(self.filename)

    def check_district_block_cluster(self):
        self.cal = GetData()
        self.driver.implicitly_wait(50)
        self.cal.click_on_state(self.driver)
        self.cal.page_loading(self.driver)
        self.fname = file_extention()
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        select_block = Select(self.driver.find_element_by_id('choose_block'))
        select_cluster = Select(self.driver.find_element_by_id('choose_cluster'))
        count = 0
        for x in range(len(select_district.options)-1,len(select_district.options)):
            select_district.select_by_index(x)
            self.cal.page_loading(self.driver)
            for y in range(len(select_block.options)-1, len(select_block.options)):
                select_block.select_by_index(y)
                self.cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    self.cal.page_loading(self.driver)
                    time.sleep(3)
                    nodata = self.driver.find_element_by_id("errMsg").text
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    if len(markers) - 1 == 0:
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "No data")
                        count = count + 1
                    self.driver.find_element_by_id('download').click()
                    time.sleep(3)
                    p = pwd()
                    self.filename = p.get_download_dir() +"/" + self.fname.pat_clusterwise()
                    if not os.path.isfile(self.filename):
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "csv is not downloaded")
                        count = count + 1
                    else:
                        with open(self.filename) as fin:
                            csv_reader = csv.reader(fin, delimiter=',')
                            header = next(csv_reader)
                            total = 0
                            schools = 0
                            for row in csv.reader(fin):
                                total += int(row[9])
                                # schools += int(row[5])
                            students = self.driver.find_element_by_id("students").text
                            res = re.sub('\D', "", students)

                            # school = self.driver.find_element_by_id("schools").text
                            # sc = re.sub('\D', "", school)
                            if int(res) != total:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "student count mismatched")
                                count = count + 1
                            # if int(sc) != schools:
                            #     print(
                            #         "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text ,select_cluster.first_selected_option.text + "school count mismatched")
                            #     count = count + 1
                        self.remove_csv()

                return count

