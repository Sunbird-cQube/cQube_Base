import time
import unittest
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class schoolwise_tabledata():
    def __init__(self,driver):
        self.driver =driver
    def test_table_data(self):

        self.driver.find_element_by_xpath(Data.hyper).click()
        self. p = GetData()
        self.p.page_loading(self.driver)
        table_data = []

        li2 = self.driver.find_elements_by_xpath('//*[@id="table"]/tbody/tr')
        # print(len(li2))
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
        return number_of_rows

