import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class DateRange():
    def __init__(self, driver):
        self.driver = driver

    def check_date_range(self):
        count =0
        cal = GetData()
        cal.click_on_state(self.driver)
        cal.page_loading(self.driver)
        year = []
        month = []
        select_year = Select(self.driver.find_element_by_id(Data.sar_year))
        select_month = Select(self.driver.find_element_by_id(Data.sar_month))
        self.driver.find_element_by_id('dateRange')
        for x in select_year.options:
            year.append(x.text)

        for y in select_month.options:
            month.append(y.text)

        for x in range(1, len(year)):
            for y in range(1, len(month)):
                sel_year = Select(self.driver.find_element_by_id('year'))
                sel_month = Select(self.driver.find_element_by_id('month'))
                sel_year.select_by_visible_text(year[x])
                sel_month.select_by_visible_text(month[y])
                s1 =  str(sel_month.first_selected_option.get_attribute("value"))
                s1 = s1.split()
                dateRange = self.driver.find_element_by_id('dateRange')
                s = dateRange.text
                if str(s1[1]) == '10' or  str(s1[1]) == '11' or str(s1[1]) == '12':
                    self.s2 = str(s1[1])
                else :
                    self.s2 = str("0" + s1[1])
                s3 = str(year[x]).strip()
                if re.search(s3, s) and re.search(self.s2, s):
                    print("Data Range correct for"+" "+s3+" "+self.s2)
                else:
                    count = count +1
        return count

















