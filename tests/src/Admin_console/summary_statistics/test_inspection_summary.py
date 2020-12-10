

import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData
from summary_values import summary_records


class Test_inspection_summary(unittest.TestCase):

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

    def test_inspection_summary(self):
        self.records = summary_records()
        self.data.page_loading(self.driver)
        x = []
        rows = self.driver.find_elements_by_xpath("//*[@id='table5']/tbody/tr[1]/td")
        for i in range(len(rows)):
            x.append(rows[i].text)
        count = 0
        self.data.page_loading(self.driver)
        y = []
        y.append(self.records.get_inspection_master())
        y.append(self.records.get_insp_totalrecords())
        y.append(self.records.get_insp_blank_records())
        y.append(self.records.get_insp_duplicate_records())
        y.append(self.records.get_insp_datatypemismatch())
        y.append(self.records.get_insp_school_id())
        y.append(self.records.get_insp_inspection())
        y.append(self.records.get_insp_createon())
        y.append(self.records.get_insp_processedrec())

        z = x[:-2]
        print('Screen showing',z)
        print('In config file',y)
        if  z == y:
            print('Inspection summary is fine')
        else:
            print("Some values are mismatching on table ")
            count = count + 1
        self.assertEqual(0,count,msg="Records mismatch found ")
        self.data.page_loading(self.driver)