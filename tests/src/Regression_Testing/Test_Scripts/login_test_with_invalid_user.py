import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from get_dir import pwd


class login_test(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Chrome(dri.get_driver_path())
        self.driver.implicitly_wait(15)

    def test_url(self):
        self.driver.maximize_window()
        self.driver.get(Data.url)
        self.driver.find_element_by_xpath(Data.email).send_keys("xyz")
        self.driver.find_element_by_xpath(Data.pwd).send_keys("tibil123")
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.submit).click()
        time.sleep(3)
        errormsg = self.driver.find_element_by_xpath("/html/body/app-root/app-login/div/div[2]/div[2]/form/div[1]/div/label").text
        print(errormsg)
        self.assertEqual(errormsg,"Invalid email address" , msg="Failed")

    def tearDown(self):
        time.sleep(5)
        self.driver.close()


if __name__ == "__main__":
    unittest.main()