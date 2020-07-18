import time


from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class login_test_invalidvalues():
    def __init__(self,driver):
        self.driver =driver
    def test_login(self):

        self.driver.find_element_by_id(Data.email).send_keys("abc@cqube.com")
        self.driver.find_element_by_id(Data.passwd).send_keys("abc123")
        self.driver.find_element_by_id(Data.login).click()
        self.p = GetData()
        self.p.page_loading(self.driver)
        errormsg = self.driver.find_element_by_xpath("//p").text
        self.driver.find_element_by_id(Data.email).clear()
        self.driver.find_element_by_id(Data.passwd).clear()
        return errormsg
