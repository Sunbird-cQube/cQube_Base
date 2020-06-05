import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class user_data(unittest.TestCase):
    def setUp(self):
        driver_path = pwd()
        self.driver = webdriver.Chrome(driver_path.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver = cqube(self.driver)
        driver.login_cqube()

    def test_filling(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath("/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/mat-list/mat-list-item/div/button/span/mat-icon").click()
        time.sleep(3)
        self.driver.find_element_by_xpath("/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/mat-list/div/a[1]/div/span").click()
        time.sleep(2)
        header = self.driver.find_element_by_xpath("//h2").text
        self.assertEqual(header,"Create User","Create user not found!..")
        time.sleep(2)
        self.driver.find_element_by_xpath("//input[@name='firstname']").send_keys("Demo")
        self.driver.find_element_by_xpath("//input[@name='middlename']").send_keys("D")
        self.driver.find_element_by_xpath("//input[@name='lastname']").send_keys("sample")
        time.sleep(2)
        self.driver.find_element_by_xpath("//input[@name='gender'][1]").click()
        self.driver.find_element_by_xpath("//input[@name='email']").send_keys("abc@gmail.com")
        self.driver.find_element_by_xpath("//input[@name='Designation']").send_keys("Software tester")
        self.driver.find_element_by_xpath("//input[@name='cnfpass']").send_keys("12345")
        time.sleep(3)
        roles = self.driver.find_elements_by_xpath("//select/option")
        for i in range(len(roles)):
            print(roles[i].text)
            time.sleep(2)
        time.sleep(2)
        self.driver.find_element_by_xpath("//select/option[2]").click()
        time.sleep(3)
        startdate = self.driver.find_element_by_xpath("//input[@name='start_date']")
        startdate.click()
        
    def tearDown(self):
            time.sleep(5)
            self.driver.close()

if __name__ == "__main__":
        unittest.main()