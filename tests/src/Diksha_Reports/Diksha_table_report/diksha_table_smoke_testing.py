import unittest

from Data.parameters import Data

from Diksha_Reports.Diksha_table_report.check_each_districts import district_list
from Diksha_Reports.Diksha_table_report.check_records_with_lastday_records import Districtwise_lastday_records
from Diksha_Reports.Diksha_table_report.check_with_lastweek_records import Districtwise_lastweek_records
from Diksha_Reports.Diksha_table_report.check_with_monthwise_records import Districtwise_monthwise_records
from Diksha_Reports.Diksha_table_report.check_with_order_of_table import Table_orderwise
from Diksha_Reports.Diksha_table_report.check_with_timeperiods import timeperiod_options
from Diksha_Reports.Diksha_table_report.click_on_hyperlink import Diksha_hyperlink
from Diksha_Reports.Diksha_table_report.click_on_logout import Diksha_logout
from Diksha_Reports.Diksha_table_report.navigate_to_diskha_report import Diksha_page

from reuse_func import GetData


class cQube_diskha_report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.driver.implicitly_wait(60)
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_diksha_table()
            self.data.page_loading(self.driver)

    def test_homebtn(self):
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        if "home" in self.driver.current_url:
            print("Navigated to landing page")
        else:
            print('Home button is not working')
            count = count + 1
        self.assertEqual(0, count, msg="Home button is not working")
        self.data.navigate_to_diksha_table()
        self.data.page_loading(self.driver)

    def test_Diksha_logout(self):
        b = Diksha_logout(self.driver)
        res = b.test_logout()
        self.assertEqual(res, 'Log in to cQube', msg="Logout is not working")
        self.data.page_loading(self.driver)

    def test_navigate_dikshareport(self):
        b = Diksha_page(self.driver)
        result = b.test_navigation()
        self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)


    def test_hyperlink(self):
        b = Diksha_hyperlink(self.driver)
        result = b.test_hyperlink()
        self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)


    def test_choosedistricts(self):
        b = district_list(self.driver)
        res = b.test_each_districts()
        self.assertNotEqual(0, res, msg="Districts are missing ")
        self.data.page_loading(self.driver)



    def test_districtiwise_lastdayrecords(self):
        b = Districtwise_lastday_records(self.driver)
        res = b.test_each_districts()
        self.data.page_loading(self.driver)


    def test_districtwise_lastweekrecords(self):
        b =Districtwise_lastweek_records(self.driver)
        res = b.test_districts()
        self.data.page_loading(self.driver)



    def test_districtwise_lastmonthrecords(self):
        b = Districtwise_monthwise_records(self.driver)
        res  = b.test_districts()
        self.data.page_loading(self.driver)


    def test_timeperiods(self):
        b = timeperiod_options(self.driver)
        res = b.test_districts()
        self.assertNotEqual(0,res,msg="Time period options are not exists ")
        self.data.page_loading(self.driver)


    def test_tableorder(self):
        b = Table_orderwise(self.driver)
        res = b.test_tablevalue()
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()