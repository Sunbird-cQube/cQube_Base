import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class login_with_wrong_values():
    def __init__(self,driver):
        self.driver = driver

    def test_wrongvalues(self):
        self.cal = GetData()
        self.cal.page_loading(self.driver)
        self.driver.find_element_by_id(Data.email).send_keys("tibil@yahoo.com")
        self.driver.find_element_by_id(Data.passwd).send_keys("tib")
        self.driver.find_element_by_id(Data.login).click()
        self.p = GetData()
        self.p.page_loading(self.driver)
        errormsg = self.driver.find_element_by_xpath("/html/body/app-root/app-login/div/div[2]/div[2]/form/div[2]/div/label").text
        self.driver.find_element_by_id(Data.email).clear()
        self.driver.find_element_by_id(Data.passwd).clear()
        return errormsg

