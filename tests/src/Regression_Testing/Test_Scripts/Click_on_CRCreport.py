import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class test_crc(unittest.TestCase):
    def setUp(self):
        driver_path = pwd()
        self.driver = webdriver.Chrome(executable_path=driver_path.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver = cqube(self.driver)
        driver.login_cqube()
        driver.navigate_to_student_report()

    def test_url(self):
        time.sleep(15)
        driver =cqube(self.driver)
        driver.navigate_to_crc_report()
        if "crc" in self.driver.current_url:
            print("CRC report page")
        else:
            print("invalid")
        time.sleep(5)

    def tearDown(self):
        time.sleep(5)
        self.driver.close()


if __name__ == "__main__":
    unittest.main()