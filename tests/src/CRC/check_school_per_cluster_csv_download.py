import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class SchoolsPerClusterCsvDownload():
    def __init__(self, driver, year, month):
        self.driver = driver

    def remove_csv1(self):
        os.remove(self.filename)
    def check_csv_download1(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        for x in range(1, int(len(select_district.options)/4)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    cal.page_loading(self.driver)
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    if len(markers) - 1 == 0:
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "No data")
                        count = count + 1
                    time.sleep(2)
                    self.driver.find_element_by_id('download').click()
                    time.sleep(2)
                    p = pwd()
                    self.filename = p.get_download_dir_SAR_Download1() + "/Schools_per_cluster_report_.csv"
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
                                row = row[6].strip('\"')
                                row1 = row.replace(',', "")
                                total += int(row1)
                            students = self.driver.find_element_by_id("students").text
                            res = re.sub('\D', "", students)

                            school = self.driver.find_element_by_id("schools").text
                            sc = re.sub('\D', "", school)

                            if int(res) != total:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "student count mismatched")
                                count = count + 1
                            if int(sc) != len(markers) - 1:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "school count mismatched")
                                count = count + 1
                            # assert (int(res) == total), "total students are not matching"
                            # assert (int(sc) == len(markers) - 1 ), "total schools are not matching"
                        self.remove_csv1()

        return count
    def remove_csv2(self):
        os.remove(self.filename)
    def check_csv_download2(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        for x in range(int(len(select_district.options)/4), int(len(select_district.options)/2)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    cal.page_loading(self.driver)
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    if len(markers) - 1 == 0:
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "No data")
                        count = count + 1
                    # assert (len(markers) - 1 != 0), "markers are not present on map"
                    time.sleep(2)
                    self.driver.find_element_by_id('download').click()
                    time.sleep(2)
                    p = pwd()
                    self.filename = p.get_download_dir_SAR_Download2() + "/Schools_per_cluster_report_" + self.month + "_" + self.year + ".csv"
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
                                row = row[6].strip('\"')
                                row1 = row.replace(',', "")
                                total += int(row1)
                            students = self.driver.find_element_by_id("students").text
                            res = re.sub('\D', "", students)

                            school = self.driver.find_element_by_id("schools").text
                            sc = re.sub('\D', "", school)

                            if int(res) != total:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "student count mismatched")
                                count = count + 1
                            if int(sc) != len(markers) - 1:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "school count mismatched")
                                count = count + 1
                            # assert (int(res) == total), "total students are not matching"
                            # assert (int(sc) == len(markers) - 1 ), "total schools are not matching"
                        self.remove_csv2()

        return count
    def remove_csv3(self):
        os.remove(self.filename)
    def check_csv_download3(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        for x in range(int(len(select_district.options)/2), int(3*len(select_district.options)/4)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    cal.page_loading(self.driver)
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    if len(markers) - 1 == 0:
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "No data")
                        count = count + 1
                    # assert (len(markers) - 1 != 0), "markers are not present on map"
                    time.sleep(2)
                    self.driver.find_element_by_id('download').click()
                    time.sleep(2)
                    p = pwd()
                    self.filename = p.get_download_dir_SAR_Download3() + "/Schools_per_cluster_report_" + self.month + "_" + self.year + ".csv"
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
                                row = row[6].strip('\"')
                                row1 = row.replace(',', "")
                                total += int(row1)
                            students = self.driver.find_element_by_id("students").text
                            res = re.sub('\D', "", students)

                            school = self.driver.find_element_by_id("schools").text
                            sc = re.sub('\D', "", school)

                            if int(res) != total:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "student count mismatched")
                                count = count + 1
                            if int(sc) != len(markers) - 1:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "school count mismatched")
                                count = count + 1
                            # assert (int(res) == total), "total students are not matching"
                            # assert (int(sc) == len(markers) - 1 ), "total schools are not matching"
                        self.remove_csv3()

        return count
    def remove_csv4(self):
        os.remove(self.filename)
    def check_csv_download4(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        select_block = Select(self.driver.find_element_by_name('myBlock'))
        select_cluster = Select(self.driver.find_element_by_name('myCluster'))
        count = 0
        for x in range(int(3*len(select_district.options)/4), len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            for y in range(1, len(select_block.options)):
                select_block.select_by_index(y)
                cal.page_loading(self.driver)
                for z in range(1, len(select_cluster.options)):
                    select_cluster.select_by_index(z)
                    cal.page_loading(self.driver)
                    markers = self.driver.find_elements_by_class_name(Data.dots)
                    if len(markers) - 1 == 0:
                        print(
                            "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "No data")
                        count = count + 1
                    # assert (len(markers) - 1 != 0), "markers are not present on map"
                    time.sleep(2)
                    self.driver.find_element_by_id('download').click()
                    time.sleep(2)
                    p = pwd()
                    self.filename = p.get_download_dir_SAR_Download4() + "/Schools_per_cluster_report_" + self.month + "_" + self.year + ".csv"
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
                                row = row[6].strip('\"')
                                row1 = row.replace(',', "")
                                total += int(row1)
                            students = self.driver.find_element_by_id("students").text
                            res = re.sub('\D', "", students)

                            school = self.driver.find_element_by_id("schools").text
                            sc = re.sub('\D', "", school)

                            if int(res) != total:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "student count mismatched")
                                count = count + 1
                            if int(sc) != len(markers) - 1:
                                print(
                                    "District" + select_district.first_selected_option.text + "Block" + select_block.first_selected_option.text + "Cluster" + select_cluster.first_selected_option.text + "school count mismatched")
                                count = count + 1
                            # assert (int(res) == total), "total students are not matching"
                            # assert (int(sc) == len(markers) - 1 ), "total schools are not matching"
                        self.remove_csv4()

        return count







