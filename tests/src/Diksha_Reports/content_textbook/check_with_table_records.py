
import pandas as pd

from Data.parameters import Data
from reuse_func import GetData


class check_with_all_records():
    def __init__(self,driver):
        self.driver = driver


    def test_table_data(self):
        self.p = GetData()
        self.driver.implicitly_wait(20)
        self.driver.find_element_by_xpath(Data.hyper).click()
        self.p.page_loading(self.driver)
        table_data = []
        li2 = self.driver.find_elements_by_xpath('//*[@id="table"]/tbody/tr')
        for x in li2:
            table_data_rows = x.text
            table_data_rows = table_data_rows.split()
            table_data.append(table_data_rows)

        for i in range(len(table_data)):
            for j in range(len(table_data[i])-1):
                if table_data[i][j].isalpha() and table_data[i][j].isalpha():
                    table_data[i][j] = table_data[i][j] + table_data[i][j + 1]

        for x in range(len(table_data)):
            for y in range(len(table_data[x])):
                if table_data[x][y].isalpha() and table_data[x][y + 1].isalpha():
                    del (table_data[x][y + 1])
                break
        df = pd.DataFrame(table_data)
        index = df.index
        number_of_rows = len(index)
        print('Checked with records are present in all fields of table ')
        table_data.clear()
