import os
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class blocks():
    def __init__(self,driver):
        self.driver = driver

    def Blocks_select_box(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        dists = Select(self.driver.find_element_by_id(Data.district_dropdown))
        Blocks = Select(self.driver.find_element_by_id(Data.blocks_dropdown))
        grade = Select(self.driver.find_element_by_id(Data.grade))
        self.load.page_loading(self.driver)
        for k in range(1,len(grade.options)):
            grade.select_by_index(k)
            self.load.page_loading(self.driver)
            for i in range(len(dists.options)-1, len(dists.options)):
                dists.select_by_index(i)
                self.load.page_loading(self.driver)
                for j in range(len(Blocks.options)-1, len(Blocks.options)):
                    Blocks.select_by_index(j)
                    self.load.page_loading(self.driver)
                    self.driver.find_element_by_id(Data.Download).click()
                    time.sleep(3)
                    self.filename = self.p.get_download_dir() + '/' + self.fname.pchart_clusters()
                    file = os.path.isfile(self.filename)
                    if file != True:
                        print(Blocks.options[i].text,'Block wise records csv file is not downloaded ')
                        count = count + 1
                os.remove(self.filename)

            self.load.page_loading(self.driver)
        return count

