






import time
import unittest

from Health_Card_Index.check_levels_dropdown import levels_dropdown
from Health_Card_Index.check_with_all_access_to_report import Access_to_all_Reports
from Health_Card_Index.check_with_healthcard_button import Health_card_btn
from Health_Card_Index.check_with_logout_btn import logout_button
from reuse_func import GetData


class Health_card_system_test(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(200)
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.data.navigate_to_health_card_index()
        self.data.page_loading(self.driver)
        time.sleep(20)

    def test_healthcard_icon_from_landingpage(self):
        function = Health_card_btn(self.driver)
        method = function.check_landing_healthcard_icon()
        self.assertEqual(0,method,msg="Failed to health card icon is not working ")
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


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()