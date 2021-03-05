import csv
import os
import re
import time

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Check_with_all_clusters():
    def __init__(self ,driver):
        self.driver = driver

    def test_clusters_selectbox(self):
        self.driver.implicitly_wait(100)
        self.data = GetData()
        self.p = pwd()
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        districts = Select(self.driver.find_element_by_id(Data.sar_district))
        blocks = Select(self.driver.find_element_by_id(Data.sar_block))
        clusters = Select(self.driver.find_element_by_id(Data.sar_cluster))
        collections =Select(self.driver.find_element_by_id(Data.coll_names))
        coll_count = len(collections.options) - 1
        for i in range(len(districts.options)-1,len(districts.options)):
            districts.select_by_index(i)
            print(districts.options[i].text)
            self.data.page_loading(self.driver)
            for j in range(1,len(blocks.options)):
                blocks.select_by_index(j)
                print(blocks.options[j].text)
                self.data.page_loading(self.driver)
                for k in range(len(clusters.options)-1, len(clusters.options)):
                    clusters.select_by_index(k)
                    name = self.driver.find_element_by_id(Data.sar_cluster).get_attribute('value')
                    value = name[4:]+'_'
                    self.data.page_loading(self.driver)
                    self.driver.find_element_by_id(Data.Download).click()
                    time.sleep(3)
                    self.filename = self.p.get_download_dir() + "/"+'completion_percentage_overall_'+value.strip()+self.data.get_current_date()+".csv"
                    print(self.filename)
                    if os.path.isfile(self.filename) != True:
                        print(districts.options[i].text,blocks.options[j].text,clusters.options[k].text,'csv file is not downloaded')
                        count = count + 1
                    else:
                        with open(self.filename) as fin:
                            csv_reader = csv.reader(fin, delimiter=',')
                            header = next(csv_reader)
                            # enrolls = 0
                            # for row in csv.reader(fin):
                            #     enrolls += int(row[12])
                            # totalenrollment = self.driver.find_element_by_id("totalCount").text
                            # enrol = re.sub('\D', "", totalenrollment)
                            # if int(enrol) != int(enrolls):
                            #     print(int(enrol) != int(enrolls), 'mis match found at enrollment count')
                            #     count = count + 1
                    os.remove(self.filename)
                    self.data.page_loading(self.driver)

        return count, coll_count

