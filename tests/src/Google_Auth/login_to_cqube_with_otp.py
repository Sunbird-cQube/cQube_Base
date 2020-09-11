import unittest

from Data.parameters import Data
from reuse_func import GetData

class cQube_Authentication(unittest.TestCase):
    @classmethod
    def setUp(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        # self.data.login_cqube(self.driver)
        self.driver.find_element_by_id(Data.email).send_keys()
        self.driver.find_element_by_id(Data.passwd).send_keys()
        self.driver.find_element_by_id(Data.login).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_tag_name('button').click()
        self.data.page_loading(self.driver)

    def test_login_cqube(self):
        self.data.page_loading(self.driver)
        print("\n")
        i = input("enter the input")
        self.driver.find_element_by_id("otp").send_keys(i)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.login).click()
        if "home" in self.driver.current_url:
            print("cQube home page")
        else:
            print("logined is failed")

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()