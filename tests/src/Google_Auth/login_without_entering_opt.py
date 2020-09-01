import unittest
import time

from Data.parameters import Data
from reuse_func import GetData


class Googleauth_testing(unittest.TestCase):
    @classmethod
    def setUp(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)

    def test_random_wrong_otp(self):
        count = 0
        self.data.login_cqube(self.driver)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.login).click()
        time.sleep(2)
        if "Invalid authenticator code." in self.driver.page_source:
            print("Invalid authenticator code.")
        else:
            print("login to  cqube with previous otp ")
            count = count + 1
        self.assertEqual(0,count,msg="logined with previous otp ")
    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
