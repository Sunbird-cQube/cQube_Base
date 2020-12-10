


import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData
from summary_values import summary_records


class Test_diksha_data_summary(unittest.TestCase):

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

    def test_diksha_file_summary(self):
        self.records = summary_records()
        self.data.page_loading(self.driver)
        x = []
        rows = self.driver.find_elements_by_xpath("//*[@id='table10']/tbody/tr[1]/td")
        for i in range(len(rows)):
            x.append(rows[i].text)
        count = 0
        self.data.page_loading(self.driver)
        y = []
        y.append(self.records.get_diksha_filename())
        y.append(self.records.get_diksha_totalrec())

        y.append(self.records.get_diksha_blank_records())
        y.append(self.records.get_diksha_duplicate_records())
        y.append(self.records.get_diksha_datamismatch())
        y.append(self.records.get_diksha_contentview())
        y.append(self.records.get_diksha_dimpdata())
        y.append(self.records.get_diksha_dimension_pid())
        y.append(self.records.get_diksha_contentname())
        y.append(self.records.get_diksha_contentboard())
        y.append(self.records.get_diksha_contentmimetype())
        y.append(self.records.get_diksha_contentmedium())
        y.append(self.records.get_diksha_contentgradelevel())
        y.append(self.records.get_diksha_contentsubject())
        y.append(self.records.get_diksha_objectid())
        y.append(self.records.get_diksha_objrollup())
        y.append(self.records.get_diksha_locstate())
        y.append(self.records.get_diksha_locdistrict())
        y.append(self.records.get_diksha_usersignin())
        y.append(self.records.get_diksha_userlogintype())
        y.append(self.records.get_diksha_collectiontype())
        y.append(self.records.get_diksha_totalcount())
        y.append(self.records.get_diksha_totaltimespent())
        y.append(self.records.get_diksha_processedrec())

        z = x[:-2]
        print('Screen showing',z)
        print('In config file',y)
        if  z == y:
            print('Diksha file summary is fine')
        else:
            print("Some values are mismatching on table ")
            count = count + 1
        self.assertEqual(0,count,msg="Records mismatch found ")
        self.data.page_loading(self.driver)