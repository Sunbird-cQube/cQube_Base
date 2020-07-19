import time

from Data.parameters import Data
from reuse_func import GetData


class test_logout():
    def __init__(self,driver):
        self.driver = driver
    def test_logoutbtn(self):
        self.p = GetData()
        self.p.login_cqube(self.driver)
        self.driver.find_element_by_id(Data.Logout).click()
        self.p.page_loading(self.driver)
        if "login" in self.driver.current_url:
            print("login page visible")
        else:
            print("login page not visible")
