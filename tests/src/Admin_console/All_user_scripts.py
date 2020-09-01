import time
import unittest

from selenium.common import exceptions

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Test_allusers(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)

    def test_click_on_allusers(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("user").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//*[@id='table_wrapper']/div[2]/div[1]/div/table/thead/tr/th[1]").click()
        self.data.page_loading(self.driver)
        values = self.driver.find_elements_by_xpath("//th[1]")
        for i in values:
            print(i.get_attribute("aria-sort"))
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//*[@id='table_wrapper']/div[2]/div[1]/div/table/thead/tr/th[1]").click()
        self.data.page_loading(self.driver)
        print("order of table records contains...")
        value = self.driver.find_elements_by_xpath("//th[1]")
        for i in value:
            print(i.get_attribute("aria-sort"))
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)

    def test_click_on_activatedbtn(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("user").click()
        self.data.page_loading(self.driver)
        print('Status of user')
        self.driver.find_element_by_xpath("//table[@id='table']/tbody/tr[1]/td[4]/button").click()
        time.sleep(2)
        self.driver.switch_to_alert().accept()
        time.sleep(5)
        btntxt = self.driver.find_element_by_xpath("//*[@id='table']/tbody/tr[1]/td[4]/button").text
        print(btntxt,"status of button is changed")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)


    def test_deactivatebtn(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("user").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//table[@id='table']/tbody/tr[1]/td[4]/button").click()
        time.sleep(2)
        self.driver.switch_to_alert().accept()
        time.sleep(5)
        btntxt = self.driver.find_element_by_xpath("//*[@id='table']/tbody/tr[1]/td[4]/button").text
        print(btntxt,"status of button is changed")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)


    def test_table_name(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("user").click()
        self.data.page_loading(self.driver)
        null = self.driver.find_element_by_xpath("//*[@id='table']/tbody/tr[6]/td[1]").text
        self.driver.find_element_by_id("homeBtn").click()
        print("name list of users")
        self.assertNotIn("null",null,msg="name with null word is exist!..")
        self.data.page_loading(self.driver)


    def test_search_box(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id("user").click()
        self.data.page_loading(self.driver)
        self.driver.find_element_by_xpath("//input[@type='search']").send_keys()
        time.sleep(3)
        self.driver.find_element_by_xpath("//input[@type='search']").clear()
        self.data.page_loading(self.driver)
        print("checking up with search box ")
        self.driver.find_element_by_xpath("//input[@type='search']").send_keys()
        res = self.driver.find_element_by_xpath("//*[@id='table']/tbody/tr/td").text
        self.assertEqual("No matching records found",res,msg="records are found")
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)





    @classmethod
    def tearDownClass(cls):
        cls.driver.close()