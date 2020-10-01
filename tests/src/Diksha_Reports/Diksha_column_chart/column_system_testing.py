import unittest
import time
from Data.parameters import Data
from Diksha_Reports.Diksha_column_chart.click_on_hyperlink import Diksha_column_hyperlink
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
            self.driver.implicitly_wait(50)
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_diksha_column_chart()
            self.data.page_loading(self.driver)

    def test_dashboard(self):
        count = 0
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.data.navigate_to_diksha_column_chart()
        self.data.page_loading(self.driver)
        if 'diksha-column-chart' in self.driver.current_url:
            print('Diksha table report is displayed ')
        else:
            print('Dashboard to diksha table is failed ')
            count = count + 1
        self.assertEqual(0,count,msg='Dashboard to diksha table report is failed in navigation')
        time.sleep(5)
        self.data.page_loading(self.driver)

    def test_hyperlink(self):
        b = Diksha_column_hyperlink(self.driver)
        result = b.test_hyperlink()
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



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()