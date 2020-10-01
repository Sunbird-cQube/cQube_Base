
import unittest

from Diksha_Reports.Diksha_table_report.check_with_timeperiods import timeperiod_options
from Diksha_Reports.Diksha_table_report.click_on_hyperlink import Diksha_hyperlink
from reuse_func import GetData

from Diksha_Reports.Diksha_table_report.check_all_records_with_lastday import All_Districtwise_lastday_records
from Diksha_Reports.Diksha_table_report.check_with_order_of_table import Table_orderwise
from Diksha_Reports.Diksha_table_report.check_each_districts import district_list
from Diksha_Reports.Diksha_table_report.navigate_to_diskha_report import Diksha_page


class cQube_diskha_regression(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_diksha_table()
            self.data.page_loading(self.driver)

    def test_navigate_dikshareport(self):
        b = Diksha_page(self.driver)
        result = b.test_navigation()
        print("Navigation to diksha report is working")
        self.data.page_loading(self.driver)

    def test_timeperiods(self):
        b = timeperiod_options(self.driver)
        res = b.test_districts()
        self.assertNotEqual(0, res, msg="Time period options are not exists ")

    def test_choosedistricts(self):
        b = district_list(self.driver)
        res = b.test_each_districts()
        print('Each districts are displaying records on screen')
        self.assertNotEqual(0, res, msg="Districts are missing ")
        self.data.page_loading(self.driver)

    def test_all_lastday(self):
        b = All_Districtwise_lastday_records(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")
        self.data.page_loading(self.driver)

    def test_hyperlink(self):
        b = Diksha_hyperlink(self.driver)
        result = b.test_hyperlink()
        print("Checking with hyper link")
        self.data.page_loading(self.driver)

    def test_tableorder(self):
        b = Table_orderwise(self.driver)
        res = b.test_tablevalue()
        print("diksha table order is changed by clicking table headers")
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()