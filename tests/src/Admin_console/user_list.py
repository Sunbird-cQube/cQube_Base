import time
import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class user_list(unittest.TestCase):

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

    def test_userlist_icon(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.userprofiles).click()
        self.data.page_loading(self.driver)
        head = self.driver.find_element_by_id('head').text
        self.assertEqual("Users List", head, msg="user list page is not exists")
        print('Navigation to userlist page is working ')
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_hamburger_create_user(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.userlst).click()
        head = self.driver.find_element_by_id('head').text
        self.assertEqual("Users List", head, msg="user list page is not exists")
        print('Navigation to userlist page is working ')
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)


    def test_created_user_in_userlist(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.userlst).click()
        if self.data.get_demoreport_name() in self.driver.page_source:
            print("User is created and present in user list")
        else:
            print("User is not created and also not present in user list ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_homebtn_function(self):
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.userlst).click()
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        if 'admin-dashboard' in self.driver.current_url:
            print('Home button is working ')
        else:
            print('Home button is not working ')
            count = count + 1
        self.assertEqual(0,count,msg="Admin Landing page is not displayed")
        self.data.page_loading(self.driver)

    def test_searchbox(self):
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.userlst).click()
        self.driver.find_element_by_xpath("//*[@id='table_filter']/label/input").send_keys(self.data.get_demoreport_name())
        if self.data.get_demoreport_name() in self.driver.page_source:
            print('Search box is working fine')
        else:
            print("Search box is not searched ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)
        self.assertEqual(0,count,msg="Search box is not working ")










    @classmethod
    def tearDownClass(cls):
        cls.driver.close()