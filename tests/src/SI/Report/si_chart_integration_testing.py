import unittest

from reuse_func import GetData


class cQube_si_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.logger = self.data.get_integration_log()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.data.navigate_to_school_infrastructure()
        self.data.page_loading(self.driver)

    def test_dashboard_si_report(self):
        self.data.navigate_to_school_infrastructure()
        self.data.page_loading(self.driver)
        if "school-infrastructure" in self.driver.current_url:
            print("School chart  report page is present")
        else:
            print("School chart report is not exist")
        self.data.page_loading(self.driver)

    def test_home(self):
        self.driver.find_element_by_id("homeBtn").click()
        if "home" in self.driver.current_url:
            print("Home page of cQube is displayed")
        else:
            print("cQube home page is not displayed")
        self.data.navigate_to_school_infrastructure()
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
