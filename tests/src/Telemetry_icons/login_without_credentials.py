from Data.parameters import Data
from reuse_func import GetData


class login_no_credentials():
    def __init__(self,driver):
        self.driver = driver

    def test_login_without_credentials(self):
        self.data = GetData()
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id(Data.login).click()
        self.data.page_loading(self.driver)
        error = self.driver.find_element_by_class_name("kc-feedback-text").text
        print(error)
        if error in self.driver.page_source:
            print('login failed due to without credentials')
        else:
            print('login is succesfull without credentials')
            count = count + 1
        self.driver.find_element_by_id('username').clear()
        self.driver.find_element_by_id('password').clear()
        self.data.page_loading(self.driver)
        return count