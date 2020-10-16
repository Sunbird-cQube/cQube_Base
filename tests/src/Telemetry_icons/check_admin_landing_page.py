import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Test_admin_landing_page(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.driver.implicitly_wait(50)
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        self.data.page_loading(self.driver)

    def test_click_on_createuser(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("addUser").click()
        self.data.page_loading(self.driver)
        if "create-user" in self.driver.current_url:
            print("Create user screen is present ")
        else:
            print("create user screen is not present ")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)


    def test_click_on_changepwd(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("chPass").click()
        self.data.page_loading(self.driver)
        if "change-password" in self.driver.current_url:
            print("Change password screen is present ")
        else:
            print("Change password screen is not present ")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)


    def test_click_on_logs(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='logs']").click()
        self.data.page_loading(self.driver)
        if "all-logs" in self.driver.current_url:
            print(" logs  screen is present ")
        else:
            print("logs  screen is not present ")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)



    def test_click_on_userlist(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='user']").click()
        self.data.page_loading(self.driver)
        if "users" in self.driver.current_url:
            print(" all user  screen is present ")
        else:
            print("all users screen is not present ")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)


    def test_click_on_s3files(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("s3dwn").click()
        self.data.page_loading(self.driver)
        if "s3FileDownload" in self.driver.current_url:
            print(" s3FileDownload user  screen is present ")
        else:
            print("s3FileDownload users screen is not present ")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_click_on_summary(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='summary']").click()
        self.data.page_loading(self.driver)
        if "summary-statistics" in self.driver.current_url:
            print("Navigated summary statistics page")
        else:
            print("Summary statistics page does not exist ")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    def test_click_on_monitor(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.data.page_loading(self.driver)
        count = 0
        if ' Monitoring Details ' in self.driver.page_source:
            print('Monitoring details icon is present ')
        else:
            print('monitoring details icons is missing')
            count = count + 1
        self.assertEqual(0,count,msg='Monitoring icon is not present on page')
        self.data.page_loading(self.driver)

    def test_nifischedular(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//div[@id='nifi']").click()
        self.data.page_loading(self.driver)
        if "nifi-shedular" in self.driver.current_url:
            print("Navigated nifi schedular page")
        else:
            print("nifi schedular page does not exist ")
        self.driver.find_element_by_id(Data.home).click()
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()