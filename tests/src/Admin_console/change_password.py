import time
import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class change_password(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        time.sleep(2)

    def test_chpassword_icon(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('addUser').click()
        self.data.page_loading(self.driver)
        head = self.driver.find_element_by_id('head').text
        self.assertEqual("Create User", head, msg="create user page is not exists")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_hamburger_change_password(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.change_pass).click()
        self.data.page_loading(self.driver)
        head = self.driver.find_element_by_id('head').text
        self.assertEqual("Change Password", head, msg="create user page is not exists")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_click_changepass_without_inputs(self):
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.change_pass).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('btn').click()
        if 'This field is required' in self.driver.page_source:
            print("Error msg displayed while without entering inputs and password not changed")
        else:
            print('Password changed without entering new password and conf password')
            count = count + 1
        self.assertEqual(0,count,msg='Password changed without inputs')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_mismatch_new_and_conf_passwords(self):
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.change_pass).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('newPasswd').send_keys('Abcd@123')
        time.sleep(2)
        self.driver.find_element_by_id('cnfPasswd').send_keys('Abcd@12')
        time.sleep(2)
        self.driver.find_element_by_id('btn').click()
        if 'Password not matched' in self.driver.page_source:
            print('mismatch of new and conf password is working ')
        else:
            print('Password re generated ')
            count = count + 1
        self.assertEqual(0,count,msg='Password is re created with mis match of passwords')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_check_username_in_changepassword_page(self):
        self.p = pwd()
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.change_pass).click()
        self.data.page_loading(self.driver)
        username = self.data.get_admin_username()
        user = self.driver.find_element_by_name('userName').get_attribute('value')
        self.data.page_loading(self.driver)
        print(user,'in screen')
        print(username ,'in config')
        self.assertEqual(username,user,msg='Username and username present in chpass page is different')
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_change_password(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.change_pass).click()
        self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('newPasswd').send_keys('Abcd@123')
        time.sleep(2)
        self.driver.find_element_by_id('cnfPasswd').send_keys('Abcd@123')
        time.sleep(2)
        # self.driver.find_element_by_id('btn').click()
        print('Change password is worked')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()