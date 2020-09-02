import time
import unittest

from selenium.webdriver.support.select import Select

from Data.key_parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Creating_users(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(30)
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        self.data.page_loading(self.driver)

    def test_createuser_icon(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.cuser_icon).click()
        head = self.driver.find_element_by_id('head').text
        self.assertEqual("Create User",head,msg="create user page is not exists")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_dashboard_usercreate(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.cuser).click()
        head = self.driver.find_element_by_id('head').text
        self.assertEqual("Create User", head, msg="create user page is not exists")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_create_adminrole(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.cuser).click()
        print("creating new user for admin role")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("username").send_keys()
        role = (Select(self.driver.find_element_by_id("role")))
        for i in range(len(role.options)):
            role.select_by_visible_text(" admin ")
            self.data.page_loading(self.driver)
        self.driver.find_element_by_id("passswd").send_keys()
        self.driver.find_element_by_id("btn").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_id(Data.userlist).click()
        self.data.page_loading(self.driver)
        if "ad_user" in self.driver.page_source:
            print("User is created and present in user list")
        else:
            print("User is not created and also not present in user list ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()

    def test_create_report_role(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.cuser).click()
        print("creating new user for reportviewer role")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("username").send_keys()
        role = (Select(self.driver.find_element_by_id("role")))
        for i in range(len(role.options)):
            role.select_by_visible_text(" report_viewer ")
            self.data.page_loading(self.driver)
        self.driver.find_element_by_id("passswd").send_keys()
        self.driver.find_element_by_id("btn").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_id(Data.userlist).click()
        self.data.page_loading(self.driver)
        if "viewerrole" in self.driver.page_source:
            print("User is created and present in user list")
        else:
            print("User is not created and also not present in user list ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()

    def test_create_emission_role(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.cuser).click()
        print("creating new user for emission role")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("username").send_keys()
        role = (Select(self.driver.find_element_by_id("role")))
        for i in range(len(role.options)):
            role.select_by_visible_text(" emission ")
            self.data.page_loading(self.driver)
        self.driver.find_element_by_id("passswd").send_keys()
        self.driver.find_element_by_id("btn").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_id(Data.userlist).click()
        self.data.page_loading(self.driver)
        if "emission_user" in self.driver.page_source:
            print("User is created and present in user list")
        else:
            print("User is not created and also not present in user list ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()

    def test_passwordBox(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.cuser).click()
        print("creating new user for emission role")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("username").send_keys("emission_user")
        role = (Select(self.driver.find_element_by_id("role")))
        for i in range(len(role.options)):
            role.select_by_visible_text(" emission ")
        self.driver.find_element_by_id("passswd").send_keys()
        self.driver.find_element_by_id("btn").click()
        time.sleep(2)
        error = self.driver.find_element_by_id('err').text
        self.assertEqual(error,"Password policy not met",msg="Password is accepted input is mis match with condtions")
        self.driver.find_element_by_id(Data.home).click()

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
