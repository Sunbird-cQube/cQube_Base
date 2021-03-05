import unittest

from Data.parameters import Data
from Diksha_Reports.Diksha_column_chart.check_course_type_content_play_counts import test_course_types_data
from Diksha_Reports.Diksha_column_chart.check_overall_type_content_play_counts import test_overall_types_data
from Diksha_Reports.Diksha_column_chart.check_textbook_type_content_plays_count import test_textbook_types_data
from Diksha_Reports.Diksha_column_chart.check_with_all_collection_records import All_records
from Diksha_Reports.Diksha_column_chart.check_with_course_collection_records import course_records
from Diksha_Reports.Diksha_column_chart.check_with_others_collection_records import others_records
from Diksha_Reports.Diksha_column_chart.check_with_textbook_collection_records import textbook_records

from Diksha_Reports.Diksha_column_chart.click_on_homeicon import Diksha_column_homeicon
from Diksha_Reports.Diksha_column_chart.click_on_hyperlink import Diksha_column_hyperlink
from Diksha_Reports.Diksha_column_chart.click_on_logout import Diksha_column_logout
from Diksha_Reports.Diksha_column_chart.download_all_collection_records import All_records_download
from Diksha_Reports.Diksha_column_chart.download_course_collection_records import course_records_download

from Diksha_Reports.Diksha_column_chart.download_other_collection_records import others_records_download
from Diksha_Reports.Diksha_column_chart.download_textbook_collection_records import textbook_records_download

from reuse_func import GetData


class cQube_diskha_column_report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_diksha_column_chart()
            self.data.page_loading(self.driver)

    def test_Diksha_homeicon(self):
        b = Diksha_column_homeicon(self.driver)
        res = b.test_homeicon()
        #self.assertEqual(res, 0, msg="Homeicon is not working ")
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
        self.assertEqual(0,count,msg="Home button is not working")
        self.driver.find_element_by_xpath("//img[@alt='dikshaColumn']").click()
        self.data.page_loading(self.driver)

    def test_Diksha_logout(self):
        b = Diksha_column_logout(self.driver)
        res = b.test_logout()
        self.assertEqual(res, 'Log in to cQube', msg="Logout is not working")
        self.data.page_loading(self.driver)

    def test_hyperlink(self):
        b = Diksha_column_hyperlink(self.driver)
        result = b.test_hyperlink()
        self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)

    def test_all_lastmonth(self):
        b = All_records(self.driver)
        res = b.allrecords_of_last30days()
        self.assertNotEqual(0,res,msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_all_lastweek(self):
        b = All_records(self.driver)
        res = b.allrecords_of_last7days()
        self.assertNotEqual(0,res,msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_all_lastday(self):
        b = All_records(self.driver)
        res = b.allrecords_of_lastday()
        self.assertNotEqual(0, res, msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_course_lastmonth(self):
        b = course_records(self.driver)
        res = b.courserecords_of_last30days()
        self.assertNotEqual(0,res,msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_course_lastweek(self):
        b = course_records(self.driver)
        res = b.courserecords_of_last7days()
        self.assertNotEqual(0,res,msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_course_lastday(self):
        b = course_records(self.driver)
        res = b.courserecords_of_lastday()
        self.assertNotEqual(0, res, msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_textbook_lastmonth(self):
        b = textbook_records(self.driver)
        res = b.textbookrecords_of_last30days()
        self.assertNotEqual(0, res, msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_textbook_lastweek(self):
        b = textbook_records(self.driver)
        res = b.textbookrecords_of_last7days()
        self.assertNotEqual(0, res, msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_textbook_lastday(self):
        b = textbook_records(self.driver)
        res = b.textbookrecords_of_lastday()
        self.assertNotEqual(0, res, msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_others_lastmonth(self):
        b = others_records(self.driver)
        res = b.othersrecords_of_last30days()
        self.assertNotEqual(0, res, msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_others_lastweek(self):
        b = others_records(self.driver)
        res = b.othersrecords_of_last7days()
        self.assertNotEqual(0, res, msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_others_lastday(self):
        b = others_records(self.driver)
        res = b.othersrecords_of_lastday()
        self.assertNotEqual(0, res, msg="Collection names list is empty")
        self.data.page_loading(self.driver)

    def test_download_alltype(self):
        b = All_records_download(self.driver)
        res = b.test_download_csv()
        self.assertTrue(res , msg='Alltype records file is not downloaded')
        self.data.page_loading(self.driver)

    def test_download_coursetype(self):
        b =course_records_download(self.driver)
        res = b.test_download_csv()
        self.assertTrue(res , msg='coursetype records file is not downloaded')
        self.data.page_loading(self.driver)

    def test_download_textbooktype(self):
        b =textbook_records_download(self.driver)
        res = b.test_download_csv()
        self.assertTrue(res , msg='textbooktype records file is not downloaded')
        self.data.page_loading(self.driver)

    def test_download_otherstype(self):
        b =others_records_download(self.driver)
        res = b.test_download_csv()
        # self.assertTrue(res , msg='otherstype records file is not downloaded')
        self.data.page_loading(self.driver)

    def test_check_course_last30_contentplays(self):
        b = test_course_types_data(self.driver)
        res = b.test_last30_days()
        self.assertEqual(0,res,msg="Mismatch found at csv file sum of content play count and  ui content play count")
        self.data.page_loading(self.driver)

    def test_check_course_lastday_contentplays(self):
        b = test_course_types_data(self.driver)
        res = b.test_last_day()
        self.assertEqual(0, res, msg="Mismatch found at csv file sum of content play count and  ui content play count")
        self.data.page_loading(self.driver)

    def test_check_course_lastweek_contentplays(self):
        b = test_course_types_data(self.driver)
        res = b.test_last7_days()
        self.assertEqual(0, res, msg="Mismatch found at csv file sum of content play count and  ui content play count")
        self.data.page_loading(self.driver)

    def test_check_overall_last30days_plays(self):
        b = test_overall_types_data(self.driver)
        res = b.test_last30_days()
        self.assertEqual(0, res, msg="Mismatch found at csv file sum of content play count and  ui content play count")
        self.data.page_loading(self.driver)

    def test_check_overall_last7days_plays(self):
        b = test_overall_types_data(self.driver)
        res = b.test_last7_days()
        self.assertEqual(0, res, msg="Mismatch found at csv file sum of content play count and  ui content play count")
        self.data.page_loading(self.driver)

    def test_check_overall_lastday_plays(self):
        b = test_overall_types_data(self.driver)
        res = b.test_last_day()
        self.assertEqual(0, res, msg="Mismatch found at csv file sum of content play count and  ui content play count")
        self.data.page_loading(self.driver)

    def test_check_textbook_last30days_content(self):
        b = test_textbook_types_data(self.driver)
        res = b.test_last30_days()
        self.assertEqual(0, res, msg="Mismatch found at csv file sum of content play count and  ui content play count")
        self.data.page_loading(self.driver)

    def test_check_textbook_last7days_content(self):
        b = test_textbook_types_data(self.driver)
        res = b.test_last7_days()
        self.assertEqual(0, res, msg="Mismatch found at csv file sum of content play count and  ui content play count")
        self.data.page_loading(self.driver)

    def test_check_textbook_lastday_content(self):
        b = test_textbook_types_data(self.driver)
        res = b.test_last_day()
        self.assertEqual(0, res, msg="Mismatch found at csv file sum of content play count and  ui content play count")
        self.data.page_loading(self.driver)



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()