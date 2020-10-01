

import unittest

from Data.parameters import Data
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
            self.driver.implicitly_wait(50)
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_diksha_column_chart()
            self.data.page_loading(self.driver)

    def test_column_icon(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('dcc').click()
        self.data.page_loading(self.driver)
        if 'diksha-column-chart' in self.driver.current_url:
            print("diksha column report is displayed ")
        else:
            print('diksha column report icon is not working')
            count = count + 1
        self.assertEqual(0,count,msg='diksha column icon is failed for navigate to column report')
        self.data.page_loading(self.driver)

    def test_dashboard_diksha_column(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        self.data.navigate_to_diksha_column_chart()
        self.data.page_loading(self.driver)
        if 'diksha-column-chart' in self.driver.current_url:
            print("diksha column report is displayed ")
        else:
            print('diksha column report is not working')
            count = count + 1
        self.assertEqual(0,count,msg='diksha column is failed for navigate to column report')
        self.data.page_loading(self.driver)

    def test_hyperlink(self):
        b = Diksha_column_hyperlink(self.driver)
        result = b.test_hyperlink()
        self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)


    def test_download_alltype(self):
        b = All_records_download(self.driver)
        res = b.test_download_csv()
        self.assertTrue(res, msg='Alltype records file is not downloaded')
        self.data.page_loading(self.driver)

    def test_download_coursetype(self):
        b = course_records_download(self.driver)
        res = b.test_download_csv()
        self.assertTrue(res, msg='coursetype records file is not downloaded')
        self.data.page_loading(self.driver)

    def test_download_textbooktype(self):
        b = textbook_records_download(self.driver)
        res = b.test_download_csv()
        self.assertTrue(res, msg='textbooktype records file is not downloaded')
        self.data.page_loading(self.driver)

    def test_download_otherstype(self):
        b = others_records_download(self.driver)
        res = b.test_download_csv()
        # self.assertTrue(res , msg='otherstype records file is not downloaded')
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


