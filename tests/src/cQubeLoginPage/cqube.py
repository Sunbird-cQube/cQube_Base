import unittest

from reuse_func import GetData


class CqubeLogin(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()
        self.driver = self.cal.get_driver()
        self.driver.implicitly_wait(30)

    def test_login_page(self):
        self.cal.open_cqube_appln(self.driver)
        print(self.driver.title)
        self.assertEqual("Log in to cQube",self.driver.title,"cqube application is not working")


    @classmethod
    def tearDownClass(self):
        self.driver.close()