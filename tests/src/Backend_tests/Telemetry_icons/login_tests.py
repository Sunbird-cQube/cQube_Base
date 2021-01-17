import unittest

from Backlog_scripts.login_without_credentials import login_no_credentials
from Data.parameters import Data
from reuse_func import GetData

class cQube_login_page_test(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)

    def test_logintocqube(self):
        self.data.page_loading(self.driver)
        self.data.login_cqube(self.driver)
        if 'homePage' in self.driver.current_url:
            print('Login to cQube is successfull ')
        self.driver.find_element_by_id(Data.logout).click()
        print(self.driver.title)
        self.data.page_loading(self.driver)

    def test_invalidusernameandpassword(self):
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id('username').send_keys('abc')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('password').send_keys('abc@123')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.login).click()
        self.data.page_loading(self.driver)
        error = self.driver.find_element_by_class_name("kc-feedback-text").text
        print(error)
        if error in self.driver.page_source:
            print('login failed due to invalid credentials')
        else:
            print('login is succesfull for invalid credentials')
        self.driver.find_element_by_id('username').clear()
        self.driver.find_element_by_id('password').clear()
        self.data.page_loading(self.driver)

    def test_invalidusername(self):
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id('username').send_keys('abc')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('password').send_keys('Tibil@123')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.login).click()
        self.data.page_loading(self.driver)
        error = self.driver.find_element_by_class_name("kc-feedback-text").text
        if str(error) in self.driver.page_source:
            print('login failed due to invalid credentials')
        else:
            print('login is succesfull for invalid credentials')
        self.driver.find_element_by_id('username').clear()
        self.driver.find_element_by_id('password').clear()
        self.data.page_loading(self.driver)

    def test_invalidpassword(self):
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id('username').send_keys('abc')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('password').send_keys('abc@123')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.login).click()
        self.data.page_loading(self.driver)
        error = self.driver.find_element_by_class_name("kc-feedback-text").text
        if str(error) in self.driver.page_source:
            print('login failed due to invalid credentials')
        else:
            print('login is succesfull for invalid credentials')
        self.driver.find_element_by_id('username').clear()
        self.driver.find_element_by_id('password').clear()
        self.data.page_loading(self.driver)

    def test_login_no_credentials(self):
        b = login_no_credentials(self.driver)
        res = b.test_login_without_credentials()
        self.assertEqual(0,res,msg='Error message is not correct')
        self.data.page_loading(self.driver)





    @classmethod
    def tearDownClass(cls):
        cls.driver.close()