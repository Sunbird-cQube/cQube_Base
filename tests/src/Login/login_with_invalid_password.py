import time

from Data.parameters import Data
from reuse_func import GetData


class login_test_with_invalid_password():
    def __init__(self,driver):
        self.driver= driver

    def test_invalidpwd(self):

        self.driver.find_element_by_id(Data.email).send_keys("tibil@gmail.com")
        self.driver.find_element_by_id(Data.passwd).send_keys("t")
        self.driver.find_element_by_id(Data.login).click()
        self.p = GetData()
        self.p.page_loading(self.driver)
        errormsg = self.driver.find_element_by_xpath("/html/body/app-root/app-login/div/div[2]/div[2]/form/div[2]/div/label").text
        self.driver.find_element_by_id(Data.email).clear()
        self.driver.find_element_by_id(Data.passwd).clear()
        return errormsg

