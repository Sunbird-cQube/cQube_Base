import time
import unittest

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class adminconsole_system_test(unittest.TestCase):

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

    def test_adminlanding_page(self):
        count = 0
        if 'home' in self.driver.current_url:
            print('Admin console page is displayed ')
        else:
            print('Admin console landng page is not displayed')
            count = count + 1
        self.assertEqual(0,count,msg="admin landing page not exist ")
        self.data.page_loading(self.driver)

    def test_createuser_icon(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('addUser').click()
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
        self.driver.find_element_by_id(Data.userlist).click()
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
        self.driver.find_element_by_id(Data.userlist).click()
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
        self.driver.find_element_by_id(Data.userlist).click()
        self.data.page_loading(self.driver)
        if self.data.get_demoemission_name() in self.driver.page_source:
            print("User is created and present in user list")
        else:
            print("User is not created and also not present in user list ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()

    def test_passwordBox(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('Chpass').click()
        time.sleep(2)
        if 'Change Password' in self.driver.page_source:
            print('Change password is displayed ')
        else:
            print('Change password is not displayed ')
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_navigate_to_s3files(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        if "s3FileDownload" in self.driver.current_url:
            print("s3FileDownload page is displayed")
        else:
            print("s3FileDownload is not exists ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("homeBtn").click()

    def test_check_summary(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath("//*[@id='summary']/div/td[2]").click()
        self.data.page_loading(self.driver)
        reports = self.driver.find_elements_by_tag_name('h2')
        count = len(reports)
        if "Diksha data Summary:" in self.driver.page_source:
            print('Diksha data Summary: statistics present')
        else:
            print('Diksha data Summary: is not present')

        if "Student Attendance Summary:" in self.driver.page_source:
            print('Student Attendance Summary: present')
        else:
            print('Student Attendance summmary is not present')

        if "CRC Report Summary:" in self.driver.page_source:
            print('CRC Report Summary: statistics present')
        else:
            print('CRC Report Summary: is not present')

        if "Semester Report Summary:" in self.driver.page_source:
            print(' Semester Report Summary: statistics present')
        else:
            print(' Semester Report Summary: is not present')

        if "Infra Report Summary:" in self.driver.page_source:
            print(' Infra Report Summary: statistics present')
        else:
            print(' Infra Report Summary: is not present')

        if "Inspection Report Summary:" in self.driver.page_source:
            print(' Inspection Report Summary: statistics present')
        else:
            print(' Inspection Report Summary: is not present')

        if "Static district file Summary:" in self.driver.page_source:
            print(' Static district file Summary: statistics present')
        else:
            print(' Static district file Summary: is not present')

        if "Static block file Summary:" in self.driver.page_source:
            print(' Static block file Summary: statistics present')
        else:
            print(' Static block file Summary: is not present')

        if "Static cluster file Summary:" in self.driver.page_source:
            print(' Static cluster file Summary: statistics present')
        else:
            print(' Static cluster file Summary: is not present')

        if "Static school file Summary:" in self.driver.page_source:
            print("Static school file Summary: is present ")
        else:
            print("Static school file Summary: is not present ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)

    def test_logout(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        self.data.page_loading(self.driver)
        self.assertEqual(self.driver.title, 'Log in to cQube', msg='Login page is not displayed')
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
