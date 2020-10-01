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
        self.driver.find_element_by_xpath(Data.createusericon).click()
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

    # def test_click_on_logs(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     if "all-logs" in self.driver.current_url:
    #         print("Logs page is present ")
    #     else:
    #         print("logs page is not present")
    #     self.driver.find_element_by_id("homeBtn").click()
    #     self.data.page_loading(self.driver)
    #
    # def test_application_node_info(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Application ')
    #     print(log_type.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(1)
    #     print(log_name.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[1].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(25)
    #         self.filename = p.get_download_dir() + "/server_side-out.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_application_node_error(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Application ')
    #     print(log_type.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(2)
    #     print(log_name.options[2].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[2].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/server_side-error.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_application_angular_info(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Application ')
    #     print(log_type.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(3)
    #     print(log_name.options[3].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[3].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/client_side-out.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_application_angular_error(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Application ')
    #     print(log_type.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(4)
    #     print(log_name.options[4].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[4].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/client_side-error.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_admin_node_info(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Admin ')
    #     print(log_type.options[2].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(1)
    #     print(log_name.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[1].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(20)
    #         self.data.page_loading(self.driver)
    #         self.filename = p.get_download_dir() + "/admin_server_side-out.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_admin_node_error(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Admin ')
    #     print(log_type.options[2].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(2)
    #     print(log_name.options[2].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[2].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/admin_server_side-error.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_admin_angular_info(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Admin ')
    #     print(log_type.options[2].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(3)
    #     print(log_name.options[3].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[3].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/admin_client_side-out.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_admin_angular_error(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Admin ')
    #     print(log_type.options[2].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(4)
    #     print(log_name.options[4].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[4].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/admin_client_side-error.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_nifi_applogs(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Nifi ')
    #     print(log_type.options[3].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(1)
    #     print(log_name.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[1].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(5)
    #         self.filename = p.get_download_dir() + "/nifi-app.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_nifi_bootstrap(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Nifi ')
    #     print(log_type.options[3].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(2)
    #     print(log_name.options[2].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[2].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/nifi-bootstrap.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_emission_access_logs(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Emission ')
    #     print(log_type.options[4].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(1)
    #     print(log_name.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[1].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/emission_app-access.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_emission_error_logs(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' Emission ')
    #     print(log_type.options[4].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(2)
    #     print(log_name.options[2].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[2].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/emission_app-error.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_System_syslogs(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' System ')
    #     print(log_type.options[5].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(1)
    #     print(log_name.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[1].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(15)
    #         self.filename = p.get_download_dir() + "/syslog.txt"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    # def test_postgress_postgreslog(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("logs").click()
    #     self.data.page_loading(self.driver)
    #     log_type = Select(self.driver.find_element_by_name("logTypeName"))
    #     log_name = Select(self.driver.find_element_by_name("logName"))
    #     log_type.select_by_visible_text(' PostgreSql ')
    #     print(log_type.options[6].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     log_name.select_by_index(1)
    #     print(log_name.options[1].text, "is selected")
    #     self.data.page_loading(self.driver)
    #     if "No such file or directory" in self.driver.page_source:
    #         print(log_name.options[1].text, "has no files to download ")
    #     else:
    #         p = pwd()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("downld").click()
    #         time.sleep(5)
    #         self.filename = p.get_download_dir() + "/postgresql-10-main.log"
    #         result = os.path.isfile(self.filename)
    #         self.assertTrue(result, msg="log is not dowloaded")
    #         os.remove(self.filename)
    #         self.data.page_loading(self.driver)
    #
    #

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

    # def test_bucket(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("downloads").click()
    #     self.data.page_loading(self.driver)
    #     print("choosing radio button and downloading s3 files")
    #     bucket_name = Select(self.driver.find_element_by_name("bucketName"))
    #     for i in range(1,len(bucket_name.options)):
    #         bucket_name.select_by_index(i)
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_xpath("//*[@id='table']/thead[2]/tr[2]/td[1]/input").click()
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("btn").click()
    #         time.sleep(3)
    #         self.data.page_loading(self.driver)
    #         self.driver.find_element_by_id("btn").click()
    #         time.sleep(3)
    #         self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("homeBtn").click()
    #
    # def test_cqubegj_raw(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("downloads").click()
    #     self.data.page_loading(self.driver)
    #     bucket_name = Select(self.driver.find_element_by_name("bucketName"))
    #     bucket_name.select_by_index(1)
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("btn")
    #     if "s3FileDownload" in self.driver.current_url:
    #         print("s3FileDownload page is displayed")
    #     else:
    #          print("s3FileDownload is not exists ")
    #     self.data.page_loading(self.driver)

    # def test_summary_icon(self):
    #     count = 0
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_xpath("//*[@id='summary']/img").click()
    #     self.data.page_loading(self.driver)
    #     if 'summary-statistics' in self.driver.current_url:
    #         print("Summmary statistics report page is present ")
    #     else:
    #         print('Summary report page is not displayed')
    #         count = count + 1
    #     self.assertEqual(0, count, msg='Summary report page is not working')
    #     self.driver.find_element_by_id('homeBtn').click()
    #     self.data.page_loading(self.driver)

    # def test_dashboard_summary(self):
    #     count = 0
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     time.sleep(2)
    #     self.driver.find_element_by_xpath("//*[@id='summary']/div/td[2]").click()
    #     self.data.page_loading(self.driver)
    #     if 'summary-statistics' in self.driver.current_url:
    #         print("Summmary statistics report page is present ")
    #     else:
    #         print('Summary report page is not displayed')
    #         count = count + 1
    #     self.assertEqual(0, count, msg='Summary report page is not working')
    #     self.driver.find_element_by_id('homeBtn').click()
    #     self.data.page_loading(self.driver)

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
        rt = self.driver.title
        self.assertEqual(rt, 'Log in to cQube', msg='Login page is not displayed')
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
