import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class District():
    def __init__(self, driver):
        self.driver = driver
    def remove_csv(self):
        os.remove(self.filename)

    def check_district(self):
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        count = 0
        for x in range(len(select_district.options)-3, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            markers = self.driver.find_elements_by_class_name(Data.dots)
            time.sleep(3)
            if (len(markers)- 1) == 0 :
                print("District" + select_district.first_selected_option.text +"no data")
                count = count + 1
            else :
                self.driver.find_element_by_id('download').click()
                time.sleep(4)
                p = pwd()
                self.filename = p.get_download_dir() + "/Block_per_dist_report.csv"
                if not os.path.isfile(self.filename):
                    print("District" + select_district.first_selected_option.text + "csv is not downloaded")
                    count = count + 1
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        total = 0
                        schools = 0
                        for row in csv.reader(fin):
                            total += int(row[4])
                            schools += int(row[5])
                        students = self.driver.find_element_by_id("students").text
                        res = re.sub('\D', "", students)

                        school = self.driver.find_element_by_id("schools").text
                        sc = re.sub('\D', "", school)
                        if int(res) != total:
                            print(
                                "District" + select_district.first_selected_option.text + "student count mismatched")
                            count = count + 1
                        if int(sc) != schools:
                            print(
                                "District" + select_district.first_selected_option.text  + "school count mismatched")
                            count = count + 1
                    self.remove_csv()

                    return count











