import unittest

from Data.parameters import Data
from reuse_func import GetData


class Test_login_to_cqube(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_vpn_cqube(self.driver)
        self.data.page_loading(self.driver)

    def test_login_with_admin(self):
        self.data.login_admin(self.driver)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        print("Dashboard options of cQube application...")
        options = self.driver.find_elements_by_xpath(Data.dashboard_options)
        for i in range(len(options)):
            print(options[i].text)
        self.driver.find_element_by_id(Data.logout).click()
        self.data.page_loading(self.driver)

    def test_login_with_reportviewer(self):
        self.driver.find_element_by_id(Data.email).send_keys(Data.reportuser)
        self.driver.find_element_by_id(Data.passwd).send_keys(Data.reportpass)
        self.driver.find_element_by_id("login").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/div/mat-nav-list[2]/mat-list-item/div/mat-icon").click()
        self.driver.find_element_by_id("chPass").click()
        print("checking change password options is exist or not")
        self.data.page_loading(self.driver)
        changepwd = self.driver.find_element_by_xpath("/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div/app-change-password/div[1]/div/div[2]/h2").text
        self.assertEqual("Change Password",changepwd,msg="Change password is not present")
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()