import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class collection_records():
    def __init__(self,driver):
        self.driver = driver

    def test_download_collection_options(self):
        self.data = GetData()
        count = 0
        self.p = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        colls = Select(self.driver.find_element_by_id(Data.coll_names))
        colcount = len(colls.options)-1
        for i in range(1,len(colls.options)):
            colls.select_by_index(i)
            time.sleep(5)
            self.data.page_loading(self.driver)
            name = colls.options[i].text
            # self.driver.find_element_by_id(Data.Download).click()
            # time.sleep(3)
            # self.filename = self.p.get_download_dir() +"/completion_percentage_overall_undefined_"+self.data.get_current_date()+".csv"
            # print(self.filename)
            # if os.path.isfile(self.filename) != True:
            #     print(colls.options[i].text,"csv file is not downloaded ")
            #     count = count + 1
            #     self.data.page_loading(self.driver)
            # os.remove(self.filename)
        return colcount,count

    def test_districtwise_collections(self):
        self.data = GetData()
        count = 0
        self.p = pwd()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        district = Select(self.driver.find_element_by_id(Data.sar_district))
        colls = Select(self.driver.find_element_by_id(Data.coll_names))
        colcount = len(colls.options) - 1
        self.data.page_loading(self.driver)
        for j in range(len(district.options)-3,len(district.options)):
            district.select_by_index(j)
            self.data.page_loading(self.driver)
            value = self.driver.find_element_by_id(Data.sar_district).get_attribute('value')
            value = value[4:]
            for i in range(1, len(colls.options)):
                colls.select_by_index(i)
                self.data.page_loading(self.driver)
                self.driver.find_element_by_id(Data.Download).click()
                time.sleep(3)
                self.filename = self.p.get_download_dir() + "/" + "completion_percentage_overall_" + value.strip() + '_' + self.data.get_current_date() + ".csv"
                print(self.filename)
                if os.path.isfile(self.filename) != True:
                    print(colls.options[i].text, "csv file is not downloaded ")
                    count = count + 1
                    self.data.page_loading(self.driver)
                os.remove(self.filename)
        return colcount, count

    def test_blockwise_collections(self):
        self.data = GetData()
        count = 0
        self.p = pwd()
        self.driver.implicitly_wait(100)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        district = Select(self.driver.find_element_by_id(Data.sar_district))
        block = Select(self.driver.find_element_by_id(Data.sar_block))
        colls = Select(self.driver.find_element_by_id(Data.coll_names))
        colcount = len(colls.options) - 1
        self.data.page_loading(self.driver)
        for j in range(1,len(district.options)-32):
            district.select_by_index(j)
            for k in range(1, len(block.options)-2):
                block.select_by_index(k)
                self.data.page_loading(self.driver)
                value = self.driver.find_element_by_id(Data.sar_block).get_attribute('value')
                value = value[5:]+'_'
                for i in range(1, len(colls.options)):
                    colls.select_by_index(i)
                    self.data.page_loading(self.driver)
                    self.driver.find_element_by_id(Data.Download).click()
                    time.sleep(3)
                    self.filename = self.p.get_download_dir() + "/" + "completion_percentage_overall_" + value.strip() + '_' + self.data.get_current_date() + ".csv"
                    print(self.filename)
                    if os.path.isfile(self.filename) != True:
                        print(colls.options[i].text, "csv file is not downloaded ")
                        count = count + 1
                        self.data.page_loading(self.driver)
                    os.remove(self.filename)
        return colcount, count

    def test_clusterwise_collections(self):
        self.data = GetData()
        count = 0
        self.p = pwd()
        self.driver.implicitly_wait(100)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        district = Select(self.driver.find_element_by_id(Data.sar_district))
        block = Select(self.driver.find_element_by_id(Data.sar_block))
        cluster = Select(self.driver.find_element_by_id(Data.sar_cluster))
        colls = Select(self.driver.find_element_by_id(Data.coll_names))
        colcount = len(colls.options) - 1
        self.data.page_loading(self.driver)
        for j in range(1, len(district.options)-32):
            district.select_by_index(j)
            for k in range(1, len(block.options)-3):
                block.select_by_index(k)
                for m in range(1, len(cluster.options)):
                    cluster.select_by_index(m)
                    self.data.page_loading(self.driver)
                    value = self.driver.find_element_by_id(Data.sar_cluster).get_attribute('value')
                    value = value[5:]+'_'
                    for i in range(1, len(colls.options)):
                        colls.select_by_index(i)
                        self.data.page_loading(self.driver)
                        self.driver.find_element_by_id(Data.Download).click()
                        time.sleep(3)
                        self.filename = self.p.get_download_dir() + "/" + "completion_percentage_overall_" + value.strip() + '_' + self.data.get_current_date() + ".csv"
                        print(self.filename)
                        if os.path.isfile(self.filename) != True:
                            print(colls.options[i].text, "csv file is not downloaded ")
                            count = count + 1
                            self.data.page_loading(self.driver)
                        os.remove(self.filename)
        return colcount, count