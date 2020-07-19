import unittest

from get_dir import pwd
from reuse_func import GetData


class Test_admin_screens(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.data.open_admin_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_admin(self.driver)
        self.data.page_loading(self.driver)

    def test_click_on_createuser(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//*[@id='crtUsr']/img").click()
        self.data.page_loading(self.driver)
        if "create-user" in self.driver.current_url:
            print("Create user screen is present ")
        else:
            print("create user screen is not present ")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)


    def test_click_on_changepwd(self):
        self.driver.find_element_by_id("chPass").click()
        self.data.page_loading(self.driver)
        if "change-password" in self.driver.current_url:
            print("Change password screen is present ")
        else:
            print("Change password screen is not present ")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)


    def test_click_on_logs(self):
        self.driver.find_element_by_xpath("//*[@id='logs']/img").click()
        self.data.page_loading(self.driver)
        if "all-logs" in self.driver.current_url:
            print(" logs  screen is present ")
        else:
            print("logs  screen is not present ")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)



    def test_click_on_allusers(self):
        self.driver.find_element_by_id("listUsrs").click()
        self.data.page_loading(self.driver)
        if "users" in self.driver.current_url:
            print(" all user  screen is present ")
        else:
            print("all users screen is not present ")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)


    def test_click_on_s3files(self):
        self.driver.find_element_by_id("s3dwn").click()
        self.data.page_loading(self.driver)
        if "s3FileDownload" in self.driver.current_url:
            print(" s3FileDownload user  screen is present ")
        else:
            print("s3FileDownload users screen is not present ")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)

    def test_click_on_summary(self):
        self.driver.find_element_by_xpath("//*[@id='summary']/img").click()
        self.data.page_loading(self.driver)
        if "summary-statistics" in self.driver.current_url:
            print("Navigated summary statistics page")
        else:
            print("Summary statistics page does not exist ")


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()