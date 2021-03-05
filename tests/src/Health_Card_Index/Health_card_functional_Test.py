import time
import unittest

from Health_Card_Index.check_homebtn_and_hyperlink import Home_functionalities
from Health_Card_Index.check_levels_dropdown import levels_dropdown
from Health_Card_Index.check_with_healthcard_button import Health_card_btn
from Health_Card_Index.check_with_logout_btn import logout_button
from Health_Card_Index.access_to_reports import Access_to_Reports
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

    def test_healthcard_icon_from_landingpage(self):
        function = Health_card_btn(self.driver)
        method = function.check_landing_healthcard_icon()
        self.assertEqual(0,method,msg="Failed to health card icon is not working ")
        self.data.page_loading(self.driver)

    def test_navigation_from_dashboard_to_healthcard(self):
        function = Health_card_btn(self.driver)
        method = function.check_dashboard_health_board()
        self.assertEqual(0,method,msg="Failed in navigation to health card report ")
        self.data.page_loading(self.driver)

    def test_levels_dropdown(self):
        function = levels_dropdown(self.driver)
        method = function.check_level_options()
        self.assertNotEqual(0,method,msg='Level drop down does not contains options ')
        self.data.page_loading(self.driver)

    def test_click_on_submit_without_entering_level_and_id(self):
        function = levels_dropdown(self.driver)
        methond = function.click_on_submit_without_entering_level_and_id()
        # self.assertEqual(0,methond,msg="Error msg is not displayed as choose level and enter id or name ")
        self.data.page_loading(self.driver)

    def test_select_levels_click_on_submit_btn(self):
        function = levels_dropdown(self.driver)
        methond = function.select_levels_click_on_submit_btn()
        # self.assertEqual(0,methond,msg="Error msg is not displayed ")
        self.data.page_loading(self.driver)

    def test_select_level_as_Districts_text(self):
        function = levels_dropdown(self.driver)
        method = function.select_level_as_Districts_text()
        self.assertEqual(0,method,msg="Passed district name records are not displayed in health card")
        self.data.page_loading(self.driver)

    def test_select_level_as_blocks_text(self):
        function = levels_dropdown(self.driver)
        method = function.select_level_as_Blocks_text()
        self.assertEqual(0,method,msg="Passed Block name records are not displayed in health card")
        self.data.page_loading(self.driver)

    def test_select_level_as_clusters_text(self):
        function = levels_dropdown(self.driver)
        method = function.select_level_as_Clusters_text()
        self.assertEqual(0, method, msg="Passed Cluster name records are not displayed in health card")
        self.data.page_loading(self.driver)

    def test_select_level_as_school_text(self):
        function = levels_dropdown(self.driver)
        method = function.select_level_as_School_text()
        self.assertEqual(0, method, msg="Passed School name records are not displayed in health card")
        self.data.page_loading(self.driver)

    def test_select_level_as_Districts_id(self):
        function = levels_dropdown(self.driver)
        method = function.select_level_as_Districts_id()
        self.assertEqual(0, method, msg="Passed district id records displayed in health card")
        self.data.page_loading(self.driver)

    def test_select_level_as_blocks_id(self):
        function = levels_dropdown(self.driver)
        method = function.select_level_as_Blocks_id()
        self.assertEqual(0, method, msg="Passed Block id records are not displayed in health card")
        self.data.page_loading(self.driver)

    def test_select_level_as_clusters_id(self):
        function = levels_dropdown(self.driver)
        method = function.select_level_as_Clusters_id()
        self.assertEqual(0, method, msg="Passed Cluster id records are not displayed in health card")
        self.data.page_loading(self.driver)

    def test_select_level_as_school_id(self):
        function = levels_dropdown(self.driver)
        method = function.select_level_as_School_id()
        self.assertEqual(0, method, msg="Passed School id records are not displayed in health card")
        self.data.page_loading(self.driver)



    def test_Home_functionalities(self):
        function = Home_functionalities(self.driver)
        method = function.test_homebtn_funtion()
        self.assertEqual(0,method,msg="Home button is not working ")

    def test_check_logout_functionality(self):
        function = logout_button(self.driver)
        method = function.click_on_logout_btn()
        self.data.navigate_to_health_card_index()
        self.data.page_loading(self.driver)
        self.assertEqual(0,method,msg="Logout is not working ")
        self.data.page_loading(self.driver)


    def test_Access_districtwise_to_Reports(self):
        func = Access_to_Reports(self.driver)
        res = func.check_with_districts_all_reports()
        self.assertEqual(0, res, msg='Goto to report is failed ')

    def test_blocks_accesss_reports(self):
        func = Access_to_Reports(self.driver)
        res1 = func.check_with_blocks_all_report()
        self.assertEqual(0, res1, msg='Goto to report is failed ')

    def test_clusters_accesss_reports(self):
        func = Access_to_Reports(self.driver)
        res2 = func.check_with_clusters_all_report()
        self.assertEqual(0, res2, msg='Goto to report is failed ')

    def test_school_accesss_reports(self):
        func = Access_to_Reports(self.driver)
        res3 = func.check_with_school_all_report()
        self.assertEqual(0, res3, msg='Goto to report is failed ')




    @classmethod
    def tearDownClass(cls):
        cls.driver.close()