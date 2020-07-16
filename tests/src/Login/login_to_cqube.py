import time

from Data.parameters import Data
from reuse_func import GetData


class Login_to_cqube():
    def __init__(self,driver):
        self.driver =driver

    def test_login(self):
        self.p = GetData()
        self.p.page_loading(self.driver)
        self.driver.find_element_by_id(Data.logout).click()

