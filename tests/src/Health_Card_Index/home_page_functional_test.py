import time
import unittest

from Health_Card_Index.check_healthcard_home_screen import health_card_homepage
from reuse_func import GetData


class Health_card_functionalTest(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_health_card_index()
        self.data.page_loading(self.driver)
        time.sleep(5)

    def test_cards_presence(self):
        fun = health_card_homepage(self.driver)
        method = fun.check_statelevel_cards_presence()
        self.assertNotEqual(0,method,msg='Some report cards are not present ')
        print('Checking All report card is present in home page ')
        self.data.page_loading(self.driver)

    def test_cards_information(self):
        fun = health_card_homepage(self.driver)
        method = fun.check_card_informations()
        self.assertNotEqual(0, method, msg='Some report cards are not present ')
        print('Checking All report card is information in home page ')
        self.data.page_loading(self.driver)

    def test_student_attendance_report(self):
        func = health_card_homepage(self.driver)
        res = func.check_click_to_access_student_report()
        self.assertEqual(0,res,msg='Student attendance report is not displayed')
        time.sleep(5)
        self.data.page_loading(self.driver)

    def test_semester_report(self):
        func = health_card_homepage(self.driver)
        res = func.check_click_to_access_sem_report()
        self.assertEqual(0,res,msg='Semester report is not displayed')
        self.data.page_loading(self.driver)

    def test_pat_report(self):
        func = health_card_homepage(self.driver)
        res = func.check_click_to_access_pat_report()
        self.assertEqual(0, res, msg='periodic report is not displayed')
        self.data.page_loading(self.driver)

    def test_infra_report(self):
        func = health_card_homepage(self.driver)
        res = func.check_click_to_access_infrastr_report()
        self.assertEqual(0, res, msg='Infrastructure report is not displayed')
        self.data.page_loading(self.driver)

    def test_udise_report(self):
        func = health_card_homepage(self.driver)
        res = func.check_click_to_access_udise_report()
        self.assertEqual(0, res, msg='udise report is not displayed')
        self.data.page_loading(self.driver)

    def test_crc_report(self):
        func = health_card_homepage(self.driver)
        res = func.check_click_to_access_crc_report()
        self.assertEqual(0, res, msg='crc report is not displayed')
        self.data.page_loading(self.driver)





    @classmethod
    def tearDownClass(cls):
        cls.driver.close()