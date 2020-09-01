import time
import unittest
from reuse_func import GetData

class cQube_Authentication(unittest.TestCase):
    @classmethod
    def setUp(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_cqube(self.driver)

    def test_otp_page(self):
        count = 0
        self.data.page_loading(self.driver)
        time.sleep(3)
        if "One-time code" in self.driver.page_source:
            print("one time code page exists")
        else:
            print("one time code page is not exist")
            count  = count + 1
        self.assertEqual(0,count,msg="one time code is not present")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()