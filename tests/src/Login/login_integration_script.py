import unittest

from Login.login_to_cqube import Login_to_cqube
from reuse_func import GetData


class cQube_Login_integration_Test(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.total_tests = 1
        self.tests = [0] * 2
        self.data = GetData()
        self.logger = self.data.get_smoke_log()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)

    def test_login_to_cqube(self):
        self.tests.pop()
        self.logger.info("test_login_to_cqube" + " " + "Total :" + " " + str(
            self.total_tests) + " " + "Remaining :" + " " + str(len(self.tests) - 1))
        b = Login_to_cqube(self.driver)
        res = b.test_login()
        self.assertEqual("cQube", self.driver.title, msg="login is not working")
        self.logger.info("test_login_to_cqube is completed...")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
