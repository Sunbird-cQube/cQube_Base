


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
        self.data.page_loading(self.driver)
    #
    # def test_navigate_to_s3files(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("downloads").click()
    #     self.data.page_loading(self.driver)
    #     if "s3FileDownload" in self.driver.current_url:
    #         print("s3FileDownload page is displayed")
    #     else:
    #         print("s3FileDownload is not exists ")
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("homeBtn").click()
    #     self.data.page_loading(self.driver)
    #
    # def test_s3files_icon(self):
    #     count = 0
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id('s3dwn').click()
    #     if "s3FileDownload" in self.driver.current_url:
    #         print("s3FileDownload page is displayed")
    #     else:
    #         print("s3FileDownload is not exists ")
    #         count = count + 1
    #     self.data.page_loading(self.driver)
    #     self.assertEqual(0,count,msg="S3files icon is not working ")
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("homeBtn").click()
    #     self.data.page_loading(self.driver)
    #
    # def test_bucket_list(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("downloads").click()
    #     self.data.page_loading(self.driver)
    #     print("choosing radio button and downloading s3 files")
    #     bucket_name = Select(self.driver.find_element_by_name("bucketName"))
    #     for i in range(1, len(bucket_name.options)):
    #         bucket_name.select_by_index(i)
    #         print(bucket_name.options[i].text,"is present and selected")
    #     self.data.page_loading(self.driver)
    #     self.assertNotEqual(0,len(bucket_name.options)-1,msg="Bucket names are not exists")
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("homeBtn").click()
    #     self.data.page_loading(self.driver)
    #
    #
    # def test_select_cqube_input(self):
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("downloads").click()
    #     self.data.page_loading(self.driver)
    #     bucket_name = Select(self.driver.find_element_by_name("bucketName"))
    #     bucket_name.select_by_index(2)
    #     print(bucket_name.options[2].text,'is selected ')
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id("homeBtn").click()
    #     self.data.page_loading(self.driver)

    def test_bucket(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        # filenames =self.driver.find_elements_by_xpath("//*[@id='table']/thead/tr/td[2]")
        bucket_name.select_by_visible_text(' cqube-qa-output ')
        filenames = self.driver.find_elements_by_xpath("//*[@id='table']/thead[2]/tr/td[2]")
        for i in range(len(filenames)):
            print(filenames[i].text)
            self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
