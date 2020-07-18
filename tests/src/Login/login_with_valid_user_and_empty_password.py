import time

from Data.parameters import Data


class login_with_no_passwd():
    def __init__(self,driver):
        self.driver = driver
    def test_nopwd(self):

        self.driver.find_element_by_id(Data.email).send_keys("xyz@gmail.com")
        self.driver.find_element_by_id(Data.login).click()
        errormsg = self.driver.find_element_by_xpath(Data.fieldReq).text
        self.driver.find_element_by_id(Data.email).clear()
        return errormsg
