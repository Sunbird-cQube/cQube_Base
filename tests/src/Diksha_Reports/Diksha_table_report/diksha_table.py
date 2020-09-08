import time
import unittest
from reuse_func import GetData
from Data.parameters import Data

from Diksha_Reports.Diksha_table_report.check_all_records_with_last7days import All_Districtwise_lastweek_record
from Diksha_Reports.Diksha_table_report.check_all_records_with_lastday import All_Districtwise_lastday_records
from Diksha_Reports.Diksha_table_report.check_all_records_with_lastmonth import All_Districtwise_lastmonth_chart
from Diksha_Reports.Diksha_table_report.check_course_records_last7days import course_districtwise_lastweek_record
from Diksha_Reports.Diksha_table_report.check_course_records_lastday import course_districtwise_lastday_records

from Diksha_Reports.Diksha_table_report.check_course_records_lastmonth import course_districtwise_lastmonth_chart
from Diksha_Reports.Diksha_table_report.check_textbook_records_of_last7days import textbook_districtwise_lastweek_record
from Diksha_Reports.Diksha_table_report.check_textbook_records_of_lastday import textbook_districtwise_lastday_records
from Diksha_Reports.Diksha_table_report.check_textbook_records_of_lastmonth import textbook_districtwise_lastmonth_chart
from Diksha_Reports.Diksha_table_report.check_with_order_of_table import Table_orderwise

from Diksha_Reports.Diksha_table_report.check_records_with_lastday_records import Districtwise_lastday_records
from Diksha_Reports.Diksha_table_report.check_with_lastweek_records import Districtwise_lastweek_records
from Diksha_Reports.Diksha_table_report.check_with_monthwise_records import Districtwise_monthwise_records
from Diksha_Reports.Diksha_table_report.check_each_districts import district_list
from Diksha_Reports.Diksha_table_report.click_on_homeicon import Diksha_homeicon

from Diksha_Reports.Diksha_table_report.click_on_hyperlink import Diksha_hyperlink
from Diksha_Reports.Diksha_table_report.click_on_logout import Diksha_logout
from Diksha_Reports.Diksha_table_report.navigate_to_diskha_report import Diksha_page
from Diksha_Reports.Diksha_table_report.check_with_timeperiods import timeperiod_options


class cQube_diskha_report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_diksha_table()
            time.sleep(5)

    def test_Diksha_homeicon(self):
        b = Diksha_homeicon(self.driver)
        res = b.test_homeicon()
        #self.assertEqual(res, 0, msg="Homeicon is not working ")

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
        self.assertEqual(0,count,msg="Home button is not working")
        self.data.navigate_to_diksha_table()
        self.data.page_loading(self.driver)

    def test_Diksha_logout(self):
        b = Diksha_logout(self.driver)
        res = b.test_logout()
        self.assertEqual(res, 'Log in to cQube', msg="Logout is not working")

    def test_navigate_dikshareport(self):
        b = Diksha_page(self.driver)
        result = b.test_navigation()
        self.data.page_loading(self.driver)

    def test_hyperlink(self):
        b = Diksha_hyperlink(self.driver)
        result = b.test_hyperlink()
        self.data.page_loading(self.driver)

    def test_choosedistricts(self):
        b = district_list(self.driver)
        res = b.test_each_districts()
        self.assertNotEqual(0, res, msg="Districts are missing ")

    def test_all_last7days(self):
        b = All_Districtwise_lastweek_record(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")

    def test_all_lastday(self):
        b = All_Districtwise_lastday_records(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")

    def test_all_lastmonth(self):
        b = All_Districtwise_lastmonth_chart(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")


    def test_course_last7days(self):
        b = course_districtwise_lastweek_record(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")

    def test_course_lastday(self):
        b = course_districtwise_lastday_records(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")

    def test_course_lastmonth(self):
        b = course_districtwise_lastmonth_chart(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")

    def test_textbook_last7days(self):
        b = textbook_districtwise_lastweek_record(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")

    def test_textbook_lastday(self):
        b = textbook_districtwise_lastday_records(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")

    def test_textbook_lastmonth(self):
        b = textbook_districtwise_lastmonth_chart(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0, res, msg="Some mismatch found at file records and table records")


    def test_districtiwise_lastdayrecords(self):
        b = Districtwise_lastday_records(self.driver)
        res = b.test_each_districts()

    def test_districtwise_lastweekrecords(self):
        b =Districtwise_lastweek_records(self.driver)
        res = b.test_districts()


    def test_districtwise_lastmonthrecords(self):
        b = Districtwise_monthwise_records(self.driver)
        res  = b.test_districts()


    def test_searchbox(self):
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_tag_name('input').send_keys('Hindi')
        self.data.page_loading(self.driver)
        subject = self.driver.find_element_by_xpath("//*[@id='table']/tbody/tr[1]/td[5]").text
        if 'Hindi' in subject:
            print("Search box is working fine ")
        else:
            print("search box is not working ")
        self.data.page_loading(self.driver)

    def test_timeperiods(self):
        b = timeperiod_options(self.driver)
        res = b.test_districts()
        self.assertNotEqual(0,res,msg="Time period options are not exists ")

    def test_tableorder(self):
        b = Table_orderwise(self.driver)
        res = b.test_tablevalue()

    def test_click_on_diksha_reporticon(self):
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_xpath("//img[@alt='dikshaTable']").click()
        self.data.page_loading(self.driver)
        if "diksha-table" in self.driver.current_url:
            print("Diksha Table report page is present ")
        else:
            print("Diksha Table report page is not exist")
            count = count + 1
        self.assertEqual(0,count,msg="Diksha chart icon is not working ")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()