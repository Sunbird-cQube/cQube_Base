import time
import unittest
from selenium.webdriver.support.select import Select
from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Admin_console_regression(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        time.sleep(2)

    def test_createuser_icon(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('addUser').click()
        self.data.page_loading(self.driver)
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

    def test_roles_dropdown(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('crtUsr').click()
        self.data.page_loading(self.driver)
        role = (Select(self.driver.find_element_by_id("role")))
        count = len(role.options)-1
        for i in range(len(role.options)):
            role.select_by_index(i)
            print(role.options[i].text)
            self.data.page_loading(self.driver)
        self.assertNotEqual(0,count,msg='Roles are missing ')
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_application_logs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//a[@id='logs']").click()
        self.data.page_loading(self.driver)
        log_type =Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_visible_text(' Application ')
        print(log_type.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        for i in range(len(log_name.options)):
            log_name.select_by_index(i)
            print(log_name.options[i].text, "is selected")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)




    def test_admin_logs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//a[@id='logs']").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_visible_text(' Admin ')
        print(log_type.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        for i in range(len(log_name.options)):
            log_name.select_by_index(i)
            print(log_name.options[i].text, "is selected")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)



    def test_nifi_logs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//a[@id='logs']").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_visible_text(' Nifi ')
        print(log_type.options[3].text, "is selected")
        self.data.page_loading(self.driver)
        for i in range(len(log_name.options)):
            log_name.select_by_index(i)
            print(log_name.options[i].text, "is selected")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)


    def test_emission_logs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//a[@id='logs']").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_visible_text(' Emission ')
        print(log_type.options[4].text, "is selected")
        self.data.page_loading(self.driver)
        for i in range(len(log_name.options)):
            log_name.select_by_index(i)
            print(log_name.options[i].text, "is selected")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)




    def test_System_logs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//a[@id='logs']").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_visible_text(' System ')
        print(log_type.options[5].text, "is selected")
        self.data.page_loading(self.driver)
        for i in range(len(log_name.options)):
            log_name.select_by_index(i)
            print(log_name.options[i].text, "is selected")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)



    def test_postgress_logs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//a[@id='logs']").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_visible_text(' PostgreSql ')
        print(log_type.options[6].text, "is selected")
        self.data.page_loading(self.driver)
        for i in range(len(log_name.options)):
            log_name.select_by_index(i)
            print(log_name.options[i].text, "is selected")
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
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_bucket(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        print("choosing radio button and downloading s3 files")
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        for i in range(1,len(bucket_name.options)):
            bucket_name.select_by_index(i)
            print(bucket_name.options[i].text)
            self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_summary_icon(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//*[@id='summary']/img").click()
        self.data.page_loading(self.driver)
        if 'summary-statistics' in self.driver.current_url:
            print("Summmary statistics report page is present ")
        else:
            print('Summary report page is not displayed')
            count = count + 1
        self.assertEqual(0, count, msg='Summary report page is not working')
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_logout(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        self.data.page_loading(self.driver)
        rt = self.driver.title
        self.assertEqual(rt,'Log in to cQube',msg='Login page is not displayed')
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        self.data.page_loading(self.driver)

    def test_userlist_page(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_id(Data.userlist).click()
        self.data.page_loading(self.driver)
        if "User List" in self.driver.page_source:
            print("Userlist report is present ")
        else:
            print("User list report is not present ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_userlist_table(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_id(Data.userlist).click()
        self.data.page_loading(self.driver)
        table = self.driver.find_elements_by_xpath('//tr/td')
        for i in range(len(table)):
            print(table[i].text)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()