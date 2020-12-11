import time
import unittest

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class create_user(unittest.TestCase):

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

    def test_adduser_icon(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('addUser').click()
        self.data.page_loading(self.driver)
        head = self.driver.find_element_by_id('head').text
        self.assertEqual("Create User", head, msg="create user page is not exists")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_hamburger_create_user(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.adduser).click()
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
        self.driver.find_element_by_id("username").send_keys(self.data.get_demoadmin_name())
        role = (Select(self.driver.find_element_by_id("role")))
        for i in range(len(role.options)):
            role.select_by_visible_text(" admin ")
            self.data.page_loading(self.driver)
        self.driver.find_element_by_id("passswd").send_keys(self.data.get_demoadmin_password())
        self.driver.find_element_by_id("btn").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.userlst).click()
        self.data.page_loading(self.driver)
        if self.data.get_demoadmin_name() in self.driver.page_source:
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
        self.driver.find_element_by_id("username").send_keys(self.data.get_demoreport_name())
        role = (Select(self.driver.find_element_by_id("role")))
        for i in range(len(role.options)):
            role.select_by_visible_text(" report_viewer ")
            self.data.page_loading(self.driver)
        self.driver.find_element_by_id("passswd").send_keys(self.data.get_demoreport_password())
        self.driver.find_element_by_id("btn").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.userlst).click()
        self.data.page_loading(self.driver)
        if self.data.get_demoreport_name() in self.driver.page_source:
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
        self.driver.find_element_by_id("username").send_keys(self.data.get_demoemission_name())
        role = (Select(self.driver.find_element_by_id("role")))
        for i in range(len(role.options)):
            role.select_by_visible_text(" emission ")
            self.data.page_loading(self.driver)
        self.driver.find_element_by_id("passswd").send_keys(self.data.get_demoemission_password())
        self.driver.find_element_by_id("btn").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.userlst).click()
        self.data.page_loading(self.driver)
        if self.data.get_demoemission_name() in self.driver.page_source:
            print("User is created and present in user list")
        else:
            print("User is not created and also not present in user list ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()

    def test_roles_dropdown(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('crtUsr').click()
        self.data.page_loading(self.driver)
        role = (Select(self.driver.find_element_by_id("role")))
        count = len(role.options) - 1
        for i in range(1,len(role.options)):
            time.sleep(2)
            role.select_by_index(i)
            print(role.options[i].text)
            self.data.page_loading(self.driver)
        self.assertNotEqual(0, count, msg='Roles are missing ')
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_without_entering_fields_and_select_any_role(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('crtUsr').click()
        self.data.page_loading(self.driver)
        role = (Select(self.driver.find_element_by_id("role")))
        role.select_by_visible_text(" admin ")
        self.driver.find_element_by_id('btn').click()
        time.sleep(2)
        if 'This field is required' in self.driver.page_source:
            print('Error msg is displayed')
        else:
            print("Error msg is not displayed")
            count = count + 1
        self.assertEqual(0,count,msg='Error msg not displayed')
        self.data.page_loading(self.driver)

    def test_password_box_with_conditions(self):
        count = 0
        self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('crtUsr').click()
        self.data.page_loading(self.driver)
        role = (Select(self.driver.find_element_by_id("role")))
        role.select_by_index(2)
        self.driver.find_element_by_id("username").send_keys('')
        self.driver.find_element_by_id("passswd").send_keys('')
        self.driver.find_element_by_id('btn').click()
        if  'Enter atleast 8 characters' in self.driver.page_source:
            print('As per conditions password box is working ')
        else:
            print('Conditions are breaked by password box ')
            count = count + 1
        self.assertEqual(0,count,msg='Conditions are not met ')
        self.data.page_loading(self.driver)

    def test_password_box(self):
        count = 0
        self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('crtUsr').click()
        self.data.page_loading(self.driver)
        role = (Select(self.driver.find_element_by_id("role")))
        role.select_by_visible_text(' admin ')
        self.driver.find_element_by_id("username").send_keys('')
        self.driver.find_element_by_id("passswd").send_keys('')
        self.driver.find_element_by_id('btn').click()
        if 'Enter atleast 8 characters' not in self.driver.page_source:
            print('As per conditions password box is working ')
        else:
            print('Condition is passed with wrong values')
            count = count + 1
        self.assertEqual(0, count, msg='Conditions are not met ')
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()