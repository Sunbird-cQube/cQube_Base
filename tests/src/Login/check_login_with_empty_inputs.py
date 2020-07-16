import time

from Data.parameters import Data
from reuse_func import GetData


class login_without_inputs():
    def __init__(self,driver):
        self.driver = driver
    def test_loginbtn(self):
        self.driver.find_element_by_id(Data.login).click()
        p =GetData()
        p.page_loading(self.driver)
        errormsg = self.driver.find_element_by_xpath(Data.fieldReq).text
        return errormsg


