import unittest

from Data.parameters import Data
from reuse_func import GetData


class Test_admin_login(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_admin_appln(self.driver)
        self.data.page_loading(self.driver)

    def test_admin_page(self):
        self.assertEqual("cQube Admin",self.driver.title,msg="Admin login page is not exists")
        self.data.login_admin(self.driver)
        self.data.page_loading(self.driver)
        print("admin login home page..")
        print(self.driver.title)
        self.driver.find_element_by_id(Data.logout).click()

    def test_unadmin_login(self):
        self.driver.find_element_by_id(Data.email).send_keys(Data.reportuser)
        self.driver.find_element_by_id(Data.passwd).send_keys(Data.reportpass)
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.login).click()
        self.data.page_loading(self.driver)
        print('login with report viewer in admin page')
        error = self.driver.find_element_by_id("err").text
        self.assertEqual("Unauthorised User",error,msg="dashboard report viewer is also logined to admin page! ")




    @classmethod
    def tearDownClass(cls):
        cls.driver.close()