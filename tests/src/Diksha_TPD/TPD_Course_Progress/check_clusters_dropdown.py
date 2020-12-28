import csv
import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class School_wise_records():
    def __init__(self, driver):
        self.driver = driver

    def Clusters_select_box(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        clust = Select(self.driver.find_element_by_id(Data.cluster_dropdown))
        dists = Select(self.driver.find_element_by_id(Data.district_dropdown))
        Blocks = Select(self.driver.find_element_by_id(Data.blocks_dropdown))
        for i in range( len(dists.options)-1, len(dists.options)):
            dists.select_by_index(i)
            self.load.page_loading(self.driver)
            for j in range(len(Blocks.options)-1, len(Blocks.options)):
                Blocks.select_by_index(j)
                self.load.page_loading(self.driver)
                for k in range(1, len(clust.options)):
                    clust.select_by_index(k)
                    self.load.page_loading(self.driver)
                    self.driver.find_element_by_id(Data.Download).click()
                    time.sleep(3)
                    self.filename = self.p.get_download_dir() + '/' + self.fname.lpd_school()
                    file = os.path.isfile(self.filename)
                    if file != True:
                        print(dists.options[i].text,Blocks.options[j].text,clust.options[i].text, 'School wise records csv file is not downloaded')
                        count = count + 1
                    else:
                        with open(self.filename) as fin:
                            csv_reader = csv.reader(fin, delimiter=',')
                            header = next(csv_reader)
                            data = list(csv_reader)
                            row_count = len(data)
                        os.remove(self.filename)
                        time.sleep(2)
                        if row_count == 0:
                            print("records are not found in csv file ")
                            count = count + 1
                        self.load.page_loading(self.driver)
        return count