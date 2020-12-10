




import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData
from summary_values import summary_records


class Test_udise_file_summary(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        self.driver.find_element_by_xpath(Data.summary_icon).click()
        self.data.page_loading(self.driver)

    def test_udise_file_summary(self):
        self.records = summary_records()
        self.data.page_loading(self.driver)
        x = []
        rows = self.driver.find_elements_by_xpath("//*[@id='table11']/tbody/tr[1]/td")
        for i in range(len(rows)):
            x.append(rows[i].text)
        count = 0
        self.data.page_loading(self.driver)
        y = []
        y.append(self.records.get_udise_filename())
        y.append(self.records.get_udise_totalrec())
        y.append(self.records.get_udise_blank_records())
        y.append(self.records.get_udise_duplicate_records())
        y.append(self.records.get_udise_schcode())
        y.append(self.records.get_udise_sectorno())
        y.append(self.records.get_udise_itemid())
        y.append(self.records.get_udise_classid())
        y.append(self.records.get_udise_streamid())
        y.append(self.records.get_udise_grade())
        y.append(self.records.get_udise_incentives())
        y.append(self.records.get_udise_casteid())
        y.append(self.records.get_udise_disability())
        y.append(self.records.get_udise_medinstr())
        y.append(self.records.get_udise_ageid())
        y.append(self.records.get_udise_itemgrp())
        y.append(self.records.get_udise_tchcode())
        y.append(self.records.get_udise_marks_range())
        y.append(self.records.get_udise_nsqf())
        y.append(self.records.get_udise_processedrec())



        z = x[:-2]
        print('Screen showing',z)
        print('In config file',y)
        if  z == y:
            print('Udise file summary is fine')
        else:
            print("Some values are mismatching on table ")
            count = count + 1
        self.assertEqual(0,count,msg="Records mismatch found ")
        self.data.page_loading(self.driver)