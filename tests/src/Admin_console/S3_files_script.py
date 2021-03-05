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
        print(self.driver.title)
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
        self.data.page_loading(self.driver)

    def test_s3files_icon(self):
        count = 0
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('s3dwn').click()
        if "s3FileDownload" in self.driver.current_url:
            print("s3FileDownload page is displayed")
        else:
            print("s3FileDownload is not exists ")
            count = count + 1
        self.data.page_loading(self.driver)
        self.assertEqual(0,count,msg="S3files icon is not working ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)

    def test_bucket_list(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        print("choosing radio button and downloading s3 files")
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        for i in range(1, len(bucket_name.options)):
            bucket_name.select_by_index(i)
            print(bucket_name.options[i].text,"is present and selected")
        self.data.page_loading(self.driver)
        self.assertNotEqual(0,len(bucket_name.options)-1,msg="Bucket names are not exists")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)


    def test_select_cqube_input(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        bucket_name.select_by_index(2)
        print(bucket_name.options[2].text,'is selected ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)

    def test_bucket(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        print("choosing radio button and downloading s3 files")
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        for i in range(1,len(bucket_name.options)-1):
            bucket_name.select_by_index(i)
            self.data.page_loading(self.driver)
            self.driver.find_element_by_xpath(Data.s3bucket_select1).click()
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("btn").click()
            time.sleep(3)
            self.data.page_loading(self.driver)
            self.driver.find_element_by_id("btn").click()
            time.sleep(3)
            self.data.page_loading(self.driver)
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)
    def test_cqubegj_raw(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        bucket_name.select_by_index(1)
        print(bucket_name.options[1].text,'is selected ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("btn")
        if "s3FileDownload" in self.driver.current_url:
            print("s3FileDownload page is displayed")
        else:
             print("s3FileDownload is not exists ")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id('btn').click()
        self.data.page_loading(self.driver)

    def test_cqube_input(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        print("choosing radio button and downloading s3 files")
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        bucket_name.select_by_visible_text(' cqube-qa-input ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.s3bucket_select1).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("btn").click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)

    def test_cqube_output(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        print("choosing radio button and downloading s3 files")
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        bucket_name.select_by_visible_text(' cqube-qa-output ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.s3bucket_select1).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("btn").click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)

    def test_cqube_emission(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        print("choosing radio button and downloading s3 files")
        bucket_name = Select(self.driver.find_element_by_name("bucketName"))
        bucket_name.select_by_visible_text(' cqube-qa-emission ')
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath(Data.s3bucket_select1).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("btn").click()
        time.sleep(3)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)

    def test_logoutbtn(self):
        count =0
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("downloads").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()
        self.data.page_loading(self.driver)
        if 'Log in to cQube' in self.driver.title:
            print('Logout button is working ')
        else:
            print('logout btn is not working')
            count = count + 1
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        self.assertEqual(0,count,msg='Logout is failed')
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
