import unittest

from reuse_func import GetData


class Googleauth_testing(unittest.TestCase):
    @classmethod
    def setUp(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)

    def test_restart_icon(self):
        count = 0
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("reset-login").click()
        self.data.page_loading(self.driver)
        title = self.driver.find_element_by_id("kc-page-title").text
        self.assertIn("Log In",title,msg="Login page not exist")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
