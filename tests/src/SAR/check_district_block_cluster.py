import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class DistrictBlockCluster():
    def __init__(self, driver, year, month):
        self.driver = driver
        self.year = year.strip()
        self.month = month.strip()
    def remove_csv(self):
        os.remove(self.filename)

    def check_district_block_cluster(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    cal.page_loading(self.driver)
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    if len(markers) - 1 != 0:
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "No data")
                        count = count + 1
                    time.sleep(2)
                    self.driver.find_element_by_id('download').click()
                    time.sleep(2)
                    p = pwd()
                    self.filename =  p.get_download_dir() +"/School_per_cluster_report.csv"
                    if not os.path.isfile(self.filename):
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "csv is not downloaded")
                        count = count + 1
                    else:
                        with open(self.filename) as fin:
                            csv_reader = csv.reader(fin, delimiter=',')
                            header = next(csv_reader)
                            total = 0
                            for row in csv.reader(fin):
                                row = row[15].strip('\"')
                                row1= row.replace(',', "")
                                total += int(row1)
                            students = self.driver.find_element_by_id("students").text
                            res = re.sub('\D', "", students)

                            school = self.driver.find_element_by_id("schools").text
                            sc = re.sub('\D', "", school)

                            if int(res) != total:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text +"Cluster"+select_cluster.first_selected_option.text+"student count mismatched")
                                count = count + 1
                            if int(sc) != len(markers) - 1:
                                print("District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text +"Cluster"+select_cluster.first_selected_option.text+"school count mismatched")
                                count = count + 1
                        self.remove_csv()

        return count


