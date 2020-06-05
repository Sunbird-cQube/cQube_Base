import re
import time
import unittest
from selenium import webdriver
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from TS.arg import arg
from TS.reuse_func import cqube
from get_dir import pwd
import pandas as pd


class SAR(unittest.TestCase):
    def setUp(self):
        driver_path = pwd()
        self.driver = webdriver.Chrome(driver_path.get_driver_path())

        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver = cqube(self.driver)
        driver.login_cqube()
        driver.navigate_to_semester_report()
        # driver.select_month_year('2019', 'August')

    def test_select_district_block_cluster(self):
        time.sleep(5)
        select_district = Select(self.driver.find_element_by_xpath(Data.select_sem_district))
        select_block = Select(self.driver.find_element_by_xpath(Data.select_sem_blocks))
        select_cluster = Select(self.driver.find_element_by_xpath(Data.select_sem_clusters))
        time.sleep(5)
        for x in select_district.options[1:]:
            select_district.select_by_visible_text(x.text)
            list = self.driver.find_elements_by_class_name(Data.dots)
            elem = self.driver.find_element_by_xpath(Data.No_sem_schools).text
            res = re.sub("\D", "", elem)
            district = set()
            if int(len(list) - 1) != int(res):
                district.add((x.text, 'Count Mismatch'))
            time.sleep(3)
            for y in select_block.options[1:]:
                select_block.select_by_visible_text(y.text)
                list = self.driver.find_elements_by_class_name(Data.dots)
                elem = self.driver.find_element_by_xpath(Data.No_sem_schools).text
                res = re.sub("\D", "", elem)
                block = set()
                if int(len(list) - 1) != int(res):
                    block.add((x.text, y.text, 'Count Mismatch'))
                time.sleep(3)
                c = 0
                for z in select_cluster.options[1:]:
                    select_cluster.select_by_visible_text(z.text)
                    # print(x.text, " ", y.text, " ", z.text)
                    time.sleep(3)
                    list = self.driver.find_elements_by_class_name(Data.dots)
                    elem = self.driver.find_element_by_xpath(Data.No_sem_schools).text
                    res = re.sub("\D", "", elem)
                    cluster = set()
                    if int(len(list)-1) != int(res):
                        cluster.add((x.text,y.text,z.text,'Count Mismatch'))
                    report=pd.DataFrame([district,block,cluster])
                    with open('sem-report.html','w') as fd:
                        fd.write(report.to_html())
                        # self.assertEqual(int(len(list) - 1), int(res), "no of dots is not equal to no of schools")

    def tearDown(self):
        self.driver.close()