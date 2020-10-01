
import unittest
from reuse_func import GetData
from Data.parameters import Data
from Diksha_Reports.Diksha_table_report.check_with_order_of_table import Table_orderwise
from Diksha_Reports.Diksha_table_report.check_each_districts import district_list
from Diksha_Reports.Diksha_table_report.click_on_homeicon import Diksha_homeicon
from Diksha_Reports.Diksha_table_report.click_on_hyperlink import Diksha_hyperlink

from Diksha_Reports.Diksha_table_report.click_on_logout import Diksha_logout
from Diksha_Reports.Diksha_table_report.navigate_to_diskha_report import Diksha_page
from Diksha_Reports.Diksha_table_report.check_with_timeperiods import timeperiod_options


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
        self.data.page_loading(self.driver)

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
        self.assertEqual(0, count, msg="Diksha chart icon is not working ")
        self.data.page_loading(self.driver)

    def test_hyperlink(self):
        b = Diksha_hyperlink(self.driver)
        result = b.test_hyperlink()
        self.data.page_loading(self.driver)

    def test_choosedistricts(self):
        b = district_list(self.driver)
        res = b.test_each_districts()
        self.assertNotEqual(0, res, msg="Districts are missing ")
        self.data.page_loading(self.driver)

    def test_timeperiods(self):
        b = timeperiod_options(self.driver)
        res = b.test_districts()
        self.assertNotEqual(0, res, msg="Time period options are not exists ")
        self.data.page_loading(self.driver)

    def test_Diksha_homeicon(self):
        b = Diksha_homeicon(self.driver)
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
        self.data.navigate_to_diksha_table()
        self.data.page_loading(self.driver)

    def test_Diksha_logout(self):
        b = Diksha_logout(self.driver)
        res = b.test_logout()
        self.assertEqual(res, 'Log in to cQube', msg="Logout is not working")
        self.data.page_loading(self.driver)

    def test_searchbox(self):
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_tag_name('input').send_keys('G')
        self.data.page_loading(self.driver)
        subject = self.driver.find_element_by_xpath("//*[@id='table']/tbody/tr[1]/td[5]").text
        if 'Hindi' in subject:
            print("Search box is working fine ")
        else:
            print("search box is not working ")
        self.data.page_loading(self.driver)

    def test_tableorder(self):
        b = Table_orderwise(self.driver)
        res = b.test_tablevalue()
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()