import time
import unittest
import pandas as pd
from selenium import webdriver
from selenium.common import exceptions
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class districtwise_tabledata():
    def __init__(self,driver):
        self.driver = driver
    def test_table_data(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        select_district = Select(self.driver.find_element_by_name('myDistrict'))
        count = 0
        for k in range(1, len(select_district.options)):
            select_district.select_by_index(k)
            self.p.page_loading(self.driver)
            table_data = []

            li2 = self.driver.find_elements_by_xpath('//*[@id="table"]/tbody/tr')
            for x in li2:
                table_data_rows = x.text
                table_data_rows = table_data_rows.split()
                table_data.append(table_data_rows)

            for i in range(len(table_data)):
                for j in range(len(table_data[i])):
                    if table_data[i][j].isalpha() and table_data[i][j + 1].isalpha():
                        table_data[i][j] = table_data[i][j] + table_data[i][j + 1]

            for x in range(len(table_data)):
                for y in range(len(table_data[x])):
                    if table_data[x][y].isalpha() and table_data[x][y + 1].isalpha():
                        del (table_data[x][y + 1])
                    break

            df = pd.DataFrame(table_data)

            index = df.index
            number_of_rows = len(index)
            table_data.clear()
            if number_of_rows == 0:
                count = count + 1
                print("District" + select_district.first_selected_option.text + "table data not found")
        return count


