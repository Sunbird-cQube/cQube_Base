import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from filenames import file_extention
from get_dir import pwd
from reuse_func import GetData


class Clusterswise():
    def __init__(self, driver):
        self.driver = driver

    def Clusters_select_box(self):
        self.p = pwd()
        self.load = GetData()
        count = 0
        self.fname = file_extention()
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.load.page_loading(self.driver)
        self.year, self.month = self.load.get_pat_month_and_year_values()
        clust = Select(self.driver.find_element_by_id(Data.cluster_dropdown))
        dists = Select(self.driver.find_element_by_id(Data.district_dropdown))
        Blocks = Select(self.driver.find_element_by_id(Data.blocks_dropdown))
        grade = Select(self.driver.find_element_by_id(Data.grade))
        self.load.page_loading(self.driver)
        for m in range(2, len(grade.options)):
            grade.select_by_index(m)
            gradename = grade.options[m].text
            gradenum = re.sub('\D', '', gradename).strip()
            self.load.page_loading(self.driver)
            for i in range(len(dists.options) - 1, len(dists.options)):
                dists.select_by_index(i)
                self.load.page_loading(self.driver)
                for j in range(len(Blocks.options) - 1, len(Blocks.options)):
                    Blocks.select_by_index(j)
                    self.load.page_loading(self.driver)
                    for k in range(1, len(clust.options)):
                        clust.select_by_index(k)
                        self.load.page_loading(self.driver)
                        value = self.driver.find_element_by_id(Data.cluster_dropdown).get_attribute('value')
                        values = value[3:]+'_'
                        self.driver.find_element_by_id(Data.Download).click()
                        time.sleep(3)
                        self.filename = self.p.get_download_dir() + '/' + self.fname.patlo_schools() + gradenum + "_schools_of_cluster_" + values.strip() + self.month + '_' + self.year + '_' + \
                                        self.load.get_current_date() + '.csv'
                        print(self.filename)
                        file = os.path.isfile(self.filename)
                        if file != True:
                            print(clust.options[k].text, 'Cluster wise records csv file is not downloaded')
                            count = count + 1
                        else:
                            with open(self.filename) as fin:
                                csv_reader = csv.reader(fin, delimiter=',')
                                header = next(csv_reader)
                                data = list(csv_reader)
                                row_count = len(data)
                            os.remove(self.filename)
                            tablecount = self.driver.find_elements_by_tag_name('tr')
                            records = int(len(tablecount)) - 2
                            time.sleep(2)
                            if row_count != records:
                                print(dists.options[i].text,Blocks.options[j].text,clust.options[k].text,
                                      "records count mismatch in downloaded file and table records")
                                count = count + 1

                        return count
