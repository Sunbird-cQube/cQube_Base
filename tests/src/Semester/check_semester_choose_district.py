import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class District():
    def __init__(self, driver):
        self.driver = driver
    def remove_csv(self):
        os.remove(self.filename)

    def check_district(self):
        cal = GetData()
        self.fname = file_extention()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_id('choose_dist'))
        count = 0
        for x in range(1, len(select_district.options)):
            select_district.select_by_index(x)
            cal.page_loading(self.driver)
            value = self.driver.find_element_by_id('choose_dist').get_attribute('value')
            value = value[4:]+'_'
            markers = self.driver.find_elements_by_class_name(Data.dots)
            time.sleep(3)
            if (len(markers) - 1) == 0 :
                print("District" + select_district.first_selected_option.text +"no data")
                count = count + 1
            else:
                time.sleep(2)
                self.driver.find_element_by_id('download').click()
                time.sleep(2)
                p = pwd()
                self.filename = p.get_download_dir() + "/" + self.fname.sr_districtwise()+value.strip()+cal.get_current_date()+'.csv'
                print(self.filename)
                if not os.path.isfile(self.filename):
                    print("District" + select_district.first_selected_option.text + "csv is not downloaded")
                    count = count + 1
                else:
                    with open(self.filename) as fin:
                        csv_reader = csv.reader(fin, delimiter=',')
                        header = next(csv_reader)
                        data = list(csv_reader)
                        row_count = len(data)
                        dots = len(markers)-1
                        if dots != row_count:
                            print('Markers records and csv file records are not matching ',dots,row_count)
                            count = count + 1
                    self.remove_csv()

        return count













