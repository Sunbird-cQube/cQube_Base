import csv
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
        self.driver.implicitly_wait(100)
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        time.sleep(2)

    def test_click_on_logs(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        if "all-logs" in self.driver.current_url:
            print("Logs page is present ")
        else:
            print("logs page is not present")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)

    def test_click_on_logs_icon(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.log_icon).click()
        self.data.page_loading(self.driver)
        if "all-logs" in self.driver.current_url:
            print("Logs page is present ")
        else:
            print("logs page is not present")
            count = count + 1
        self.driver.find_element_by_id("homeBtn").click()
        self.assertEqual(0,count,msg='Logs page does not exist ')
        self.data.page_loading(self.driver)

    def test_application_node_info(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Application ')
        print(log_type.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[1].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(25)
            self.filename = p.get_download_dir() + "/server_side-out.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)


    def test_application_node_error(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Application ')
        print(log_type.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(2)
        print(log_name.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[2].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/server_side-error.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)

    def test_application_angular_info(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Application ')
        print(log_type.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(3)
        print(log_name.options[3].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[3].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/client_side-out.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)

    def test_application_angular_error(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Application ')
        print(log_type.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(4)
        print(log_name.options[4].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[4].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/client_side-error.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)

    def test_admin_node_info(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Admin ')
        print(log_type.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[1].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(20)
            self.data.page_loading(self.driver)
            self.filename = p.get_download_dir() + "/admin_server_side-out.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)


    def test_admin_node_error(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Admin ')
        print(log_type.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(2)
        print(log_name.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[2].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/admin_server_side-error.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)

    def test_admin_angular_info(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Admin ')
        print(log_type.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(3)
        print(log_name.options[3].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[3].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/admin_client_side-out.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)


    def test_admin_angular_error(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Admin ')
        print(log_type.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(4)
        print(log_name.options[4].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[4].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/admin_client_side-error.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)


    def test_nifi_applogs(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Nifi ')
        print(log_type.options[3].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[1].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(5)
            self.filename = p.get_download_dir() + "/nifi-app.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)


    def test_nifi_bootstrap(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Nifi ')
        print(log_type.options[3].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(2)
        print(log_name.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[2].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/nifi-bootstrap.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)


    def test_emission_access_logs(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Emission ')
        print(log_type.options[4].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[1].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/emission_app-access.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)


    def test_emission_error_logs(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' Emission ')
        print(log_type.options[4].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(2)
        print(log_name.options[2].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[2].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/emission_app-error.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)


    def test_System_syslogs(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_id("choose_dist"))
        log_name = Select(self.driver.find_element_by_id("choose_block"))
        log_type.select_by_visible_text(' System ')
        print(log_type.options[5].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[1].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(15)
            self.filename = p.get_download_dir() + "/syslog.txt"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)


    def test_postgress_postgreslog(self):
        self.data.logs_page()
        self.data.page_loading(self.driver)
        time.sleep(5)
        log_type = Select(self.driver.find_element_by_name("logTypeName"))
        log_name = Select(self.driver.find_element_by_name("logName"))
        log_type.select_by_visible_text(' PostgreSql ')
        print(log_type.options[6].text, "is selected")
        self.data.page_loading(self.driver)
        log_name.select_by_index(1)
        print(log_name.options[1].text, "is selected")
        self.data.page_loading(self.driver)
        if "No such file or directory" in self.driver.page_source:
            print(log_name.options[1].text, "has no files to download ")
        else:
            p = pwd()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("downld").click()
            time.sleep(5)
            self.filename = p.get_download_dir() + "/postgresql-10-main.log"
            result = os.path.isfile(self.filename)
            self.assertTrue(result, msg="log is not dowloaded")
            with open(self.filename, "r") as f:
                reader = csv.reader(f, delimiter=",")
                data = list(reader)
                row_count = len(data)
            self.assertNotEqual(int(row_count),0,msg='Log file does not contains informations')
            os.remove(self.filename)
            self.data.page_loading(self.driver)



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()