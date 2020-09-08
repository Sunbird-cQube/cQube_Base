import unittest

from reuse_func import GetData


class Googleauth_testing(unittest.TestCase):
    @classmethod
    def setUp(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)

    def test_username(self):
        count = 0
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        user = self.driver.find_element_by_id("kc-attempted-username").text
        username = self.data.get_username()
        self.assertEqual(user,username,msg="User name is mis matching ")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
