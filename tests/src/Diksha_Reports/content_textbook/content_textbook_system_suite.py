import unittest

from Diksha_Reports.content_textbook.check_with_lastday_records import Districtwise_lastday_records
from Diksha_Reports.content_textbook.check_with_lastweek_records import Districtwise_lastweek_records
from Diksha_Reports.content_textbook.check_with_monthwise_records import Districtwise_monthwise_records
from Diksha_Reports.content_textbook.check_with_order_of_table import Table_orderwise
from Diksha_Reports.content_textbook.download_alldistricts_csvfile import course_districtwise_records
from Diksha_Reports.content_textbook.navigate_to_diskha_report import Diksha_page

from reuse_func import GetData


class cQube_content_textbook_systemtest(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.driver.implicitly_wait(100)
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.page_loading(self.driver)
            self.data.navigate_to_diksha_content_textbook()
            self.data.page_loading(self.driver)

    def test_diksha_page(self):
        b = Diksha_page(self.driver)
        res = b.test_navigation()
        self.assertEqual(res,0,msg='content course page is present but url is not matching to report')
        self.data.page_loading(self.driver)

    def test_textbook_districtwise_records(self):
        b =course_districtwise_records(self.driver)
        res = b.test_alldata_districts()
        self.assertEqual(0,res,msg='Records are not present on table ')
        self.data.page_loading(self.driver)



    def test_Districtwise_lastday_records(self):
        b = Districtwise_lastday_records(self.driver)
        res = b.test_districts()
        self.assertEqual(res,0,msg='Some districts does not have table records')
        self.data.page_loading(self.driver)

    def test_Districtwise_lastweek_records(self):
        b = Districtwise_lastweek_records(self.driver)
        res = b.test_districts()
        self.assertEqual(res,0,msg='Some districts does not have table records')
        self.data.page_loading(self.driver)

    def test_Districtwise_monthwise_records(self):
        b = Districtwise_monthwise_records(self.driver)
        res = b.test_districts()
        self.assertEqual(res, 0, msg='Some districts does not have table records')
        self.data.page_loading(self.driver)


    def test_Table_orderwise(self):
        b = Table_orderwise(self.driver)
        res = b.test_tablevalue()
        print("checking order of the table and working as per requirement ")
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()