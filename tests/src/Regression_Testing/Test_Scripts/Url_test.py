import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from get_dir import pwd


class url_test(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Chrome(dri.get_driver_path())
        self.driver.implicitly_wait(15)

    def test_url(self):
        self.driver.maximize_window()
        self.driver.get(Data.url)
        time.sleep(5)
        self.assertEqual(self.driver.current_url,Data.url+"#/login",msg="invalid url")



    def tearDown(self):
        time.sleep(5)
        self.driver.close()


if __name__ == "__main__":
    unittest.main()