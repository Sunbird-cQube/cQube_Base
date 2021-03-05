import unittest
from Diksha_Reports.content_course.check_course_records_last7days import course_districtwise_lastweek_record
from Diksha_Reports.content_course.check_course_records_lastday import course_districtwise_lastday_records
from Diksha_Reports.content_course.check_course_records_lastmonth import course_districtwise_lastmonth_chart
from Diksha_Reports.content_course.check_with_lastday_records import Districtwise_lastday_records
from Diksha_Reports.content_course.check_with_lastweek_records import Districtwise_lastweek_records

from Diksha_Reports.content_course.check_with_monthwise_records import Districtwise_monthwise_records
from Diksha_Reports.content_course.check_with_order_of_table import Table_orderwise
from Diksha_Reports.content_course.click_on_homeicon import Diksha_homeicon
from Diksha_Reports.content_course.click_on_hyperlink import Diksha_hyperlink
from Diksha_Reports.content_course.click_on_logout import content_course_logout

from Diksha_Reports.content_course.download_alldistricts_csvfile import course_districtwise_records
from Diksha_Reports.content_course.navigate_to_diskha_report import Diksha_page

from reuse_func import GetData


class cQube_content_course_regression(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.driver.implicitly_wait(100)
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_diksha_content_course()
            self.data.page_loading(self.driver)


    def test_diksha_page(self):
        b = Diksha_page(self.driver)
        res = b.test_navigation()
        self.assertEqual(res, 0, msg='content course page is present but url is not matching to report')
        self.data.page_loading(self.driver)

    def test_content_course_hyperlink(self):
        self.data.page_loading(self.driver)
        b = Diksha_hyperlink(self.driver)
        res = b.test_hyperlink()
        print("checked with hyper link functionality ")
        self.data.page_loading(self.driver)

    def test_course_districtwise_records(self):
        b = course_districtwise_records(self.driver)
        res = b.test_alldata_districts()
        self.assertEqual(0, res, msg='Records are not present on table ')
        self.data.page_loading(self.driver)

    def test_course_districtwise_lastweek_record(self):
        b = course_districtwise_lastweek_record(self.driver)
        res = b.test_each_districts()
        self.assertEqual(res, 0, msg='records count mismatch in downloaded file and table records')
        print('checked with last 7days records ')
        self.data.page_loading(self.driver)

    def test_course_districtwise_lastday_record(self):
        b = course_districtwise_lastday_records(self.driver)
        res = b.test_each_districts()
        self.assertEqual(res, 0, msg='records count mismatch in downloaded file and table records')
        print('checked with last day records ')
        self.data.page_loading(self.driver)

    def test_course_districtwise_lastmonth_chart(self):
        b = course_districtwise_lastmonth_chart(self.driver)
        res = b.test_each_districts()
        self.assertEqual(res, 0, msg='records count mismatch in downloaded file and table records')
        print('checked with last 30 days records ')
        self.data.page_loading(self.driver)

    def test_Districtwise_lastday_records(self):
        b = Districtwise_lastday_records(self.driver)
        res = b.test_districts()
        self.assertEqual(res, 0, msg='Some districts does not have table records')
        self.data.page_loading(self.driver)

    def test_Districtwise_lastweek_records(self):
        b = Districtwise_lastweek_records(self.driver)
        res = b.test_districts()
        self.assertEqual(res, 0, msg='Some districts does not have table records')
        self.data.page_loading(self.driver)

    def test_Districtwise_monthwise_records(self):
        b = Districtwise_monthwise_records(self.driver)
        res = b.test_districts()
        self.assertEqual(res, 0, msg='Some districts does not have table records')
        self.data.page_loading(self.driver)

    def test_homeicon(self):
        b = Diksha_homeicon(self.driver)
        res = b.test_homeicon()
        print('Home icon is working ')
        self.data.page_loading(self.driver)

    def test_Table_orderwise(self):
        b = Table_orderwise(self.driver)
        res = b.test_tablevalue()
        print("checking order of the table and working as per requirement ")
        self.data.page_loading(self.driver)

    def test_content_course_logout(self):
        b = content_course_logout(self.driver)
        res = b.test_logout()
        self.assertEqual(res, 'Log in to cQube', msg="logout button is not working")
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_diksha_content_course()
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()