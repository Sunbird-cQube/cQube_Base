import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Click_ChangePassword(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Chrome(path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()

    def test_set_newpwd(self):
        self.driver.find_element_by_xpath(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.user).click()

        self.driver.find_element_by_xpath(Data.changepwd).click()
        pwd =self.driver.find_element_by_xpath(Data.create_headtext).text
        self.assertEqual(pwd,"Change Password","Change password is not found!..")
        self.driver.find_element_by_xpath("//input[@name='newPasswd']").send_keys("1234")
        time.sleep(2)
        self.driver.find_element_by_xpath("//input[@name='cnfpass']").send_keys("1234")
        self.driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(2)
    def tearDown(self):
            self.driver.close()

if __name__ == "__main__":
        unittest.main()