import time
import unittest

from selenium.webdriver.support.select import Select

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Test_s3files(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)

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

    def test_bucket(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        print("choosing radio button and downloading s3 files")
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        for i in range(1,len(bucket_name.options)):
            bucket_name.select_by_index(i)
            self.data.page_loading(self.driver)
            self.driver.find_element_by_xpath("//*[@id='table']/thead[2]/tr[2]/td[1]/input").click()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("btn").click()
            time.sleep(3)
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("btn").click()
            time.sleep(3)
            self.data.page_loading(self.driver)
        self.driver.find_element_by_id("homeBtn").click()

    def test_cqubegj_raw(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        bucket_name.select_by_index(1)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("btn")
        if "s3FileDownload" in self.driver.current_url:
            print("s3FileDownload page is displayed")
        else:
             print("s3FileDownload is not exists ")
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
