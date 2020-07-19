import time

from Data.parameters import Data
from reuse_func import GetData


class login_test():
    def __init__(self,driver):
        self.driver = driver

    def test_login(self):
        self.p = GetData()
        self.driver.find_element_by_id(Data.email).send_keys("tibil@cqe.com")
        self.driver.find_element_by_id(Data.passwd).send_keys("tibl")
        time.sleep(2)
        self.driver.find_element_by_id(Data.login).click()
        self.p.page_loading(self.driver)
        errormsg = self.driver.find_element_by_xpath("//p").text
        return errormsg

