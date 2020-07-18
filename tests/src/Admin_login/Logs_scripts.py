import os
import time
import unittest

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Test_logs(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.data.open_admin_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_admin(self.driver)
        time.sleep(2)

    def test_click_on_logs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        if "all-logs" in self.driver.current_url:
            print("Logs page is present ")
        else:
            print("logs page is not present")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)

    def test_application_node_info(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type =Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(1)
        print(log_type.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        # try:
        #     self.msg = self.driver.find_element_by_xpath("//div[@id='files']/h1").text
        # except exceptions.NoSuchElementException:
        #     pass
        #
        # self.data.page_loading(self.driver)
        # if "No such file or directory" == self.msg:
        #     print(log_name.options[1].text, "has no files to download ")
        # else:
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(25)
        # self.filename = p.get_download_dir() + "/server-side-out.log"
        # result = os.path.isfile(self.filename)
        # self.assertTrue(result, msg="log is not dowloaded")
        # os.remove(self.filename)
        self.data.page_loading(self.driver)


    def test_application_node_error(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type =Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(1)
        print(log_type.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(2)
        print(log_name.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/server-side-error.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)

    def test_application_angular_info(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(1)
        print(log_type.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(3)
        print(log_name.options[3].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(10)
        self.filename = p.get_download_dir() + "/client-side-out.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)

    def test_application_angular_error(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(1)
        print(log_type.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(4)
        print(log_name.options[4].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/client-side-error.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)

    def test_admin_node_info(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(2)
        print(log_type.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(10)
        self.data.page_loading(self.driver)
        self.filename = p.get_download_dir() + "/admin-server-side-out.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)


    def test_admin_node_error(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(2)
        print(log_type.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(2)
        print(log_name.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/admin-server-side-error.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)

    def test_admin_angular_info(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(2)
        print(log_type.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(3)
        print(log_name.options[3].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/admin-client-side-out.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)


    def test_admin_angular_error(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(2)
        print(log_type.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(4)
        print(log_name.options[4].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/admin-client-side-error.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)


    def test_nifi_applogs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(3)
        print(log_type.options[3].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/nifi-app.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)


    def test_nifi_bootstrap(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(3)
        print(log_type.options[3].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(2)
        print(log_name.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(15)
        # self.filename = p.get_download_dir() + "/nifi-bootstrap.log"
        # result = os.path.isfile(self.filename)
        # self.assertTrue(result, msg="log is not dowloaded")
        # os.remove(self.filename)
        self.data.page_loading(self.driver)


    def test_python_access_logs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(4)
        print(log_type.options[4].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/access.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)


    def test_python_error_logs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(4)
        print(log_type.options[4].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(2)
        print(log_name.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/error.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)


    def test_System_syslogs(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(5)
        print(log_type.options[5].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/syslog.txt"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)
        self.data.page_loading(self.driver)


    def test_postgress_postgreslog(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("logs").click()
        self.data.page_loading(self.driver)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_index(6)
        print(log_type.options[6].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        p = pwd()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downld").click()
        time.sleep(5)
        self.filename = p.get_download_dir() + "/postgresql-10-main.log"
        result = os.path.isfile(self.filename)
        self.assertTrue(result, msg="log is not dowloaded")
        os.remove(self.filename)

        self.data.page_loading(self.driver)



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()