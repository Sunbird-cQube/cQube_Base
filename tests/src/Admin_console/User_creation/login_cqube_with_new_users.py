import time
import unittest

from Data.parameters import Data
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

    def test_login_with_admin(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('username').send_keys()
        self.driver.find_element_by_id('password').send_keys()
        self.driver.find_element_by_id(Data.login).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_tag_name('button').click()
        self.data.page_loading(self.driver)
        if "home" in self.driver.current_url:
            print("Logined to cqube with admin user")
        else:
            print("login failed with admin user")
        self.driver.find_element_by_id('menu').click()
        self.driver.find_element_by_xpath("/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/div/mat-nav-list[2]/mat-list-item/div/mat-icon").click()
        time.sleep(2)
        self.driver.find_element_by_id('chPass').click()
        time.sleep(2)
        if "Change Password" in self.driver.page_source:
            print("Change password option is present ")
            count = count + 1
        else:
            print("Change password options  not present ")
        self.assertEqual(0,count,msg="Admin user also  have change password option!")
        self.driver.find_element_by_id(Data.logout).click()
        self.data.page_loading(self.driver)

    def test_login_with_reportviewer(self):
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id('username').send_keys()
        self.driver.find_element_by_id('password').send_keys()
        self.driver.find_element_by_id(Data.login).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_tag_name('button').click()
        self.data.page_loading(self.driver)
        if "home" in self.driver.current_url:
            print("Logined to cqube with report viewer user")
        else:
            print("login failed with report viewer user")
        self.driver.find_element_by_id('menu').click()
        if " User " in self.driver.page_source:
            print("User option is present ")
        else:
            print("User options is not present")
            count = count + 1
        self.assertEqual(0,count,msg="Admin user also not have change password option!")
        self.driver.find_element_by_id(Data.logout).click()
        self.data.page_loading(self.driver)

    def test_login_with_emission(self):
        print("emission user does not have access to cqube application")
        self.driver.find_element_by_id('username').send_keys()
        self.driver.find_element_by_id('password').send_keys()
        self.driver.find_element_by_id(Data.login).click()
        self.data.page_loading(self.driver)
        if "home" in self.driver.current_url:
            print("Logined to cqube with admin user")
        else:
            print("login failed with admin user")
        self.data.page_loading(self.driver)
        alert_obj = self.driver.switch_to.alert
        alert_obj.accept()
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()

