import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Click_ChangePwd(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Chrome(path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
    def test_set_negative_newpwd(self):
        self.driver.find_element_by_xpath(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.user).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.changepwd).click()
        pwd =self.driver.find_element_by_xpath(Data.create_headtext).text
        self.assertEqual(pwd,"Change Password","Change password is not found!..")
        self.driver.find_element_by_xpath(Data.new_pwd).send_keys("tibil123")
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.conf_pwd).send_keys("tibil12")
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.submit).click()
        time.sleep(3)
        errormsg = self.driver.find_element_by_xpath(Data.errormsg).text
        print(errormsg)
        self.assertEqual(errormsg,"Password not matched" ,"Matching password!")
    def tearDown(self):
            time.sleep(5)
            self.driver.close()

if __name__ == "__main__":
        unittest.main()